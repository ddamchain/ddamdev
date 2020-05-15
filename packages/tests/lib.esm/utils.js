'use strict';
import { ddamers } from "ddamers";
function randomBytes(seed, lower, upper) {
    if (!upper) {
        upper = lower;
    }
    if (upper === 0 && upper === lower) {
        return new Uint8Array(0);
    }
    let result = ddamers.utils.arrayify(ddamers.utils.keccak256(ddamers.utils.toUtf8Bytes(seed)));
    while (result.length < upper) {
        result = ddamers.utils.concat([result, ddamers.utils.keccak256(ddamers.utils.concat([seed, result]))]);
    }
    let top = ddamers.utils.arrayify(ddamers.utils.keccak256(result));
    let percent = ((top[0] << 16) | (top[1] << 8) | top[2]) / 0x01000000;
    return result.slice(0, lower + Math.floor((upper - lower) * percent));
}
function randomHexString(seed, lower, upper) {
    return ddamers.utils.hexlify(randomBytes(seed, lower, upper));
}
function randomNumber(seed, lower, upper) {
    let top = randomBytes(seed, 3);
    let percent = ((top[0] << 16) | (top[1] << 8) | top[2]) / 0x01000000;
    return lower + Math.floor((upper - lower) * percent);
}
function equals(a, b) {
    // Array (treat recursively)
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!equals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    // BigNumber
    if (a.eq) {
        if (!b.eq || !a.eq(b)) {
            return false;
        }
        return true;
    }
    // Uint8Array
    if (a.buffer) {
        if (!b.buffer || a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    // Something else
    return a === b;
}
export { randomBytes, randomHexString, randomNumber, equals };
