const crypto = require('crypto');

const key = crypto.randomBytes(32); // 32 bytes untuk AES-256
const iv = crypto.randomBytes(16); // 16 bytes untuk IV

console.log('CRYPT_KEY=' + key.toString('hex')); // 64 karakter hex
console.log('CRYPT_IV=' + iv.toString('hex')); // 32 karakter hex
