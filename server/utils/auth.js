// Themepark auth code

const sodium = require("libsodium-wrappers-sumo");
const keystoreDB = require("./db").themeparkDB;

let initialized = false;

let algorithms = null;

// All functions calling libsodium MUST call this at least once
async function init() {
    if (!initialized) {
        await sodium.ready;
        initialized = true;
        algorithms = {
            argon2i: sodium.crypto_pwhash_ALG_ARGON2I13,
            argon2id: sodium.crypto_pwhash_ALG_ARGON2ID13,
            default: sodium.crypto_pwhash_ALG_DEFAULT
        }
    }
}

async function hashpw(password, algo = 'argon2id', memlimitMB = 19, iters = 2) {
    await init();
    const a = algorithms[algo];
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    const memlimit = memlimitMB * 1024 * 1024;
    const hash = sodium.crypto_pwhash(32, password, salt, iters, memlimit, a);
    return `${a}$${iters}$${memlimitMB}$${sodium.to_base64(salt)}$${sodium.to_base64(hash)}`;
}

// not used EVER but still here just in case ;)
async function hashpwModerate(password) {
    await init();
    const memlimitMB = Math.floor(sodium.crypto_pwhash_MEMLIMIT_MODERATE / (1024 * 1024));
    return await hashpw(password, 'argon2id', memlimitMB, sodium.crypto_pwhash_OPSLIMIT_MODERATE);
}

async function hashpwSecure(password) {
    await init();
    const memlimitMB = Math.floor(sodium.crypto_pwhash_MEMLIMIT_SENSITIVE / (1024 * 1024));
    return await hashpw(password, 'argon2id', memlimitMB, sodium.crypto_pwhash_OPSLIMIT_SENSITIVE);
}

async function checkpw(password, hash) {
    const hashObj = await splithash(hash); // Init is also called here to obtain base64 decoders from libsodium
    const newHash = sodium.crypto_pwhash(hashObj.hash.length, password, hashObj.salt, hashObj.iters, hashObj.memlimitMB * 1024 * 1024, hashObj.algID);
    return sodium.memcmp(hashObj.hash, newHash);
}

async function splithash(hash) {
    await init();
    const hashElements = hash.split("$");
    return {
        algID: Number(hashElements[0]),
        iters: Number(hashElements[1]),
        memlimitMB: Number(hashElements[2]),
        salt: sodium.from_base64(hashElements[3]),
        hash: sodium.from_base64(hashElements[4])
    };
}

// Functions for application

// Secrets are random keys used to sign session ids. They are added periodically to the database.
// This function is scheduled to run at predefined intervals in main.js
async function updateSessionSecrets(secrets, renewAfter = 7, discardAfter = 30) {
    const curTime = new Date();
    const discardDate = new Date();
    discardDate.setTime(curTime.getTime() - discardAfter * 24 * 60 * 60 * 1000);
    await keystoreDB("SESSION_SECRETS").where('created', '<', discardDate).del();
    var dbSecrets = await keystoreDB("SESSION_SECRETS");
    dbSecrets.sort((a, b) => b.created - a.created);
    const renewDuration = renewAfter * 24 * 60 * 60 * 1000;
    if (dbSecrets.length === 0 || curTime.getTime() - dbSecrets[0].created.getTime() > renewDuration) {
        const newSecret = sodium.to_base64(sodium.randombytes_buf(64));
        await keystoreDB("SESSION_SECRETS").insert({value: newSecret});
        dbSecrets.splice(0, 0, {value: newSecret, created: curTime});
    }
    secrets.length = dbSecrets.length;
    for (let i = 0; i < dbSecrets.length; ++i) {
        secrets[i] = dbSecrets[i].value;
    }
}

/**
 * Function to be used as middleware for express.
 * Returns a function that can process a login request and determine whether the request was valid.
 *
 * If valid, req.authorized = true
 *
 * If invalid, req.authorized = false
 *
 * @param {(user: String) => String | undefined} getPassFunc Callback function to use as the user lookup method.
 * @returns
 */
function authenticate(getPassFunc) {
    return async function (req, res, next) {
        if (req.body === undefined || req.body.username === undefined || req.body.password === undefined) {
            req.authorized = false;
            return next();
        }
        const hashedpw = await getPassFunc(req.body.username);
        if (hashedpw === undefined) {
            req.authorized = false;
            return next();
        }
        req.authorized = await checkpw(req.body.password, hashedpw).catch((err) => {
            return false;
        });
        return next();
    }
}

// Predef query used to delete excess sessions from the database.
// maxSessions defines the limit. Oldest sessions get deleted first.
async function pruneSessions(user, maxSessions, isEmployee = false) {
    await keystoreDB('SESSIONS').whereNotIn('session_id', function () {
        this.select('session_id')
            .from(function () {
                this.select('session_id')
                    .from('SESSIONS')
                    .where(keystoreDB.raw(`JSON_EXTRACT(data, '$.${isEmployee ? 'employeeUser' : 'user'}') = '${user}'`))
                    .orderBy('created', 'desc')
                    .limit(maxSessions)
                    .as('latest_sessions')
            });
    })
        .andWhere(keystoreDB.raw(`JSON_EXTRACT(data, '$.${isEmployee ? 'employeeUser' : 'user'}') = '${user}'`))
        .del();
}

module.exports = {
    hashpw,
    hashpwModerate,
    hashpwSecure,
    checkpw,
    splithash,
    updateSessionSecrets,
    authenticate,
    pruneSessions
};