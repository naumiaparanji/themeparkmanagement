// Themepark auth code

const sodium = require("libsodium-wrappers-sumo");
const keystoreDB = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_ADDR,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_KEYSTORE_DB,
    },
});

let initialized = false;

let algorithms = null;

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

/**
 * Hash password string. Defaults to minimum recommended settings on the OWASP cheat sheet.
 * https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
 * @param {String} password Password string to hash.
 * @param {String} algo Algorithm to use (argon2i, argon2id, default).
 * @param {Number} memlimitMB Memory limit of algorithm in megabytes.
 * @param {Number} iters Ops limit in hash algorithm.
 * @returns {Promise<String>} Formatted hash string.
 */
async function hashpw(password, algo = 'argon2id', memlimitMB = 19, iters = 2) {
    await init();
    const a = algorithms[algo];
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    const memlimit = memlimitMB * 1024 * 1024;
    const hash = sodium.crypto_pwhash(32, password, salt, iters, memlimit, a);
    return `${a}$${iters}$${memlimitMB}$${sodium.to_base64(salt)}$${sodium.to_base64(hash)}`;
}

/**
 * Convenience function that uses moderate security parameters with hashpw.
 * @param {String} password Password string to hash.
 * @returns {Promise<String>} Formatted hash string.
 */
async function hashpwModerate(password) {
    await init();
    const memlimitMB = Math.floor(sodium.crypto_pwhash_MEMLIMIT_MODERATE / (1024 * 1024));
    return await hashpw(password, 'argon2id', memlimitMB, sodium.crypto_pwhash_OPSLIMIT_MODERATE);
}

/**
 * Convenience function that uses high/sensitive security parameters with hashpw.
 * @param {String} password Password string to hash.
 * @returns {Promise<String>} Formatted hash string.
 */
async function hashpwSecure(password) {
    await init();
    const memlimitMB = Math.floor(sodium.crypto_pwhash_MEMLIMIT_SENSITIVE / (1024 * 1024));
    return await hashpw(password, 'argon2id', memlimitMB, sodium.crypto_pwhash_OPSLIMIT_SENSITIVE);
}

/**
 * Verify that a guessed password matches what is stored in the database.
 * @param {String} password Password to verify.
 * @param {String} hash Formatted hash string from database.
 * @returns {Promise<Boolean>} True if password matches hash.
 */
async function checkpw(password, hash) {
    const hashObj = await splithash(hash); // Init is also called here to obtain base64 decoders from libsodium
    const newHash = sodium.crypto_pwhash(hashObj.hash.length, password, hashObj.salt, hashObj.iters, hashObj.memlimitMB * 1024 * 1024, hashObj.algID);
    return sodium.memcmp(hashObj.hash, newHash);
}

/**
 * Break hash string from hashpw into its components.
 * @example
 * // Splithash object formatting
 * {
        algID: int,
        iters: int,
        memlimitMB: int,
        salt: salt_bytes,
        hash: hash_bytes
    }
 * @param {String} hash Formatted hash string.
 * @returns {Promise<Object>} Object containing hash string components.
 */
async function splithash(hash){
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

/**
 * Update the secret store in the keystore database, filling the provided array with valid secrets.
 * @param {Array} secrets Destination array to place valid secrets from keystore.
 * @param {Number} renewAfter Number of days to keep latest secret in use.
 * @param {Number} discardAfter Number of days to wait before deleting a secret from the keystore.
 */
async function updateSessionSecrets(secrets, renewAfter=7, discardAfter=30) {
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
 * If valid, request object obtains the authorized = true attribute.
 * 
 * If invalid, request object obtains the authorized = true and auth_error = reason_str attributes.
 * 
 * @param {(user: String) => String | undefined} getPassFunc Callback function to use as the user lookup method.
 * @returns 
 */
function authenticate(getPassFunc) {
    return async function (req, res, next) {
        if (req.body === undefined || req.body.username === undefined || req.body.password === undefined) {
            req.authorized = false;
            req.auth_err = "Bad request";
            return next();
        }
        const hashed_pw = await getPassFunc(req.body.username);
        if (hashed_pw === undefined) {
            req.authorized = false;
            req.auth_err = "Invalid user";
            return next();
        }
        req.authorized = await checkpw(req.body.password, hashed_pw).catch((err) => {
            req.auth_err = "Failed to parse user password from database";
            return false;
        });
        return next();
    }
}

module.exports = {
    keystoreDB,
    hashpw,
    hashpwModerate,
    hashpwSecure,
    checkpw,
    splithash,
    updateSessionSecrets,
    authenticate,
};