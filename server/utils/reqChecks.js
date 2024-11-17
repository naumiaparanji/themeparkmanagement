function matchKeys(obj, keys, exact = false) {
    const objKeys = Object.keys(obj);
    if (exact && keys.length != objKeys.length) return false;
    const objKeySet = new Set(objKeys);
    for (let key of keys) {
        if (!objKeySet.has(key)) return false;
    }
    return true;
}

// Other common use functions go here

module.exports = {
    matchKeys
}