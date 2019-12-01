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

      const passwordHash = crypto
        .createHmac("sha256", userInfo.salt)
        .update(password)
        .digest("hex");

      return passwordHash === userInfo.password_hash;
    } catch (error) {
      throw new Error("Can't login.");
    }
  }

  static async register({ firstName, lastName, user, password }) {
    try {
      const salt = crypto.randomBytes(8).toString("hex"); // The result will be 16 chars string.
      const passwordHash = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");

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
