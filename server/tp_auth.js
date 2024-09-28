// Themepark auth code

const sodium = require("libsodium-wrappers-sumo");

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
 * @param {Number} memlimit_mb Memory limit of algorithm in megabytes.
 * @param {Number} iters Ops limit in hash algorithm.
 * @returns {Promise<String>} Formatted hash string.
 */
async function hashpw(password, algo = 'argon2id', memlimit_mb = 19, iters = 2) {
    await init();
    const a = algorithms[algo];
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    const memlimit = memlimit_mb * 1024 * 1024;
    const hash = sodium.crypto_pwhash(32, password, salt, iters, memlimit, a);
    return `${a}$${iters}$${memlimit_mb}$${sodium.to_base64(salt)}$${sodium.to_base64(hash)}`;
}

/**
 * Convenience function that uses moderate security parameters with hashpw.
 * @param {String} password Password string to hash.
 * @returns {Promise<String>} Formatted hash string.
 */
async function hashpw_moderate(password) {
    await init();
    const memlimit_mb = Math.floor(sodium.crypto_pwhash_MEMLIMIT_MODERATE / (1024 * 1024));
    return await hashpw(password, 'argon2id', memlimit_mb, sodium.crypto_pwhash_OPSLIMIT_MODERATE);
}

/**
 * Convenience function that uses high/sensitive security parameters with hashpw.
 * @param {String} password Password string to hash.
 * @returns {Promise<String>} Formatted hash string.
 */
async function hashpw_secure(password) {
    await init();
    const memlimit_mb = Math.floor(sodium.crypto_pwhash_MEMLIMIT_SENSITIVE / (1024 * 1024));
    return await hashpw(password, 'argon2id', memlimit_mb, sodium.crypto_pwhash_OPSLIMIT_SENSITIVE);
}

/**
 * Verify that a guessed password matches what is stored in the database.
 * @param {String} password Password to verify.
 * @param {String} hash Formatted hash string from database.
 * @returns {Promise<Boolean>} True if password matches hash.
 */
async function checkpw(password, hash) {
    s_hash  = await splithash(hash); // Init is also called here to obtain base64 decoders from libsodium
    const new_hash = sodium.crypto_pwhash(s_hash["hash"].length, password, s_hash["salt"], s_hash["iters"], s_hash["memlimit_mb"] * 1024 * 1024, s_hash["alg_id"]);
    return sodium.memcmp(s_hash["hash"], new_hash);
}

/**
 * Break hash string from hashpw into its components.
 * @example
 * // Splithash object formatting
 * {
        alg_id: int,
        iters: int,
        memlimit_mb: int,
        salt: salt_bytes,
        hash: hash_bytes
    }
 * @param {String} hash Formatted hash string.
 * @returns {Promise<Object>} Object containing hash string components.
 */
async function splithash(hash){
    await init();
    const s_hash = hash.split("$");
    return {
        alg_id: Number(s_hash[0]),
        iters: Number(s_hash[1]),
        memlimit_mb: Number(s_hash[2]),
        salt: sodium.from_base64(s_hash[3]),
        hash: sodium.from_base64(s_hash[4])
    };
}

module.exports = {
    hashpw,
    hashpw_moderate,
    hashpw_secure,
    checkpw,
    splithash
};