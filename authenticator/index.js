const crypto = require("crypto");
const UserRepository = require("../storage/user-repository");
const userRepository = new UserRepository();

class Authenticator {
  static async login({ user, password }) {
    try {
      const userInfo = await userRepository.getByUserName(user);
      if (!userInfo) {
        return false;
      }

      // https://nodejs.org/api/crypto.html#crypto_crypto_scryptsync_password_salt_keylen_options
      // crypto.scryptSync(password, salt, keylen[, options])
      console.time("Login - find password hash");
      const passwordHash = crypto
        .scryptSync(password, userInfo.salt, 64)
        .toString("hex");
      console.timeEnd("Login - find password hash");

      return passwordHash === userInfo.password_hash;
    } catch (error) {
      console.log(error);
      throw new Error("Can't login.");
    }
  }

  static async register({ firstName, lastName, user, password }) {
    try {
      const salt = crypto.randomBytes(16).toString("hex"); // The result will be 32 chars string.
      // https://nodejs.org/api/crypto.html#crypto_crypto_scryptsync_password_salt_keylen_options
      // crypto.scryptSync(password, salt, keylen[, options])
      const passwordHash = crypto
        .scryptSync(password, salt, 64)
        .toString("hex");

      await userRepository.registerUser({
        firstName,
        lastName,
        user,
        passwordHash,
        salt
      });

      return true;
    } catch (error) {
      throw new Error("Can't register.");
    }
  }
}

module.exports = Authenticator;
