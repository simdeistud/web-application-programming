// password.util.js
const crypto = require('crypto');

const PBKDF2_ITERS = 100000;
const SALT_BYTES = 16;

const hashPassword = (password) => {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERS, 64, 'sha512')
    .toString('hex');

  return { salt, hash, iters: PBKDF2_ITERS, algo: 'sha512' };
};

const passwordIsValid = (password, salt, storedHash, iters) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, iters, 64, 'sha512')
    .toString('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(storedHash, 'hex')
  );
};

module.exports = { hashPassword, passwordIsValid };