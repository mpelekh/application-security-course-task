const Repository = require("./repository");
const Storage = require("../storage");

class UserRepository extends Repository {
  constructor() {
    super(new Storage());
  }

  async getByUserName(user) {
    await this.storage.initialize();
    return this.storage.getItem({ key: "user", value: user });
  }

  async registerUser({
    firstName,
    lastName,
    user,
    passwordHash,
    salt,
    salary,
    initializationVector,
    authTag
  }) {
    await this.storage.initialize();
    return this.storage.insertItem({
      insertTo: "users",
      values: {
        first_name: firstName,
        last_name: lastName,
        user,
        password_hash: passwordHash,
        salt,
        salary,
        initialization_vector: initializationVector,
        auth_tag: authTag
      }
    });
  }
}

module.exports = UserRepository;
