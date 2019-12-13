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

      if (userInfo.password_hash !== passwordHash) {
        return false;
      }

      // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
      // crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
      const secretKey = crypto.pbkdf2Sync(
        password,
        userInfo.salt,
        100000,
        24,
        "sha512"
      );

      const decipher = crypto.createDecipheriv(
        "aes-192-ccm",
        secretKey,
        Buffer.from(userInfo.initialization_vector, "hex"),
        {
          authTagLength: 16
        }
      );

      decipher.setAuthTag(Buffer.from(userInfo.auth_tag, "hex"));

      const salary = decipher.update(
        Buffer.from(userInfo.salary, "hex"),
        null,
        "utf8"
      );
      decipher.final();

      return {
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        user,
        salary
      };
    } catch (error) {
      throw new Error("Can't login.");
    }
  }

  static async register({ firstName, lastName, user, password, salary }) {
    try {
      const salt = crypto.randomBytes(16).toString("hex"); // The result will be 32 chars string.

      // https://nodejs.org/api/crypto.html#crypto_crypto_scryptsync_password_salt_keylen_options
      // crypto.scryptSync(password, salt, keylen[, options])
      const passwordHash = crypto
        .scryptSync(password, salt, 64)
        .toString("hex");

      // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
      // crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
      const secretKey = crypto.pbkdf2Sync(password, salt, 100000, 24, "sha512");

      const initializationVector = crypto.randomBytes(12);

      const cipher = crypto.createCipheriv(
        "aes-192-ccm",
        secretKey,
        initializationVector,
        { authTagLength: 16 }
      );
      const salaryEncrypted = cipher.update(salary, "utf8");
      cipher.final();

      const authTag = cipher.getAuthTag();

      await userRepository.registerUser({
        firstName,
        lastName,
        user,
        passwordHash,
        salt,
        salary: salaryEncrypted.toString("hex"),
        initializationVector: initializationVector.toString("hex"),
        authTag: authTag.toString("hex")
      });

      return true;
    } catch (error) {
      throw new Error("Can't register.");
    }
  }
}

module.exports = Authenticator;
