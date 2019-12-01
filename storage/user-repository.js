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

  async registerUser({ firstName, lastName, user, passwordHash, salt }) {
    await this.storage.initialize();
    return this.storage.insertItem({
      insertTo: "users",
      values: {
        first_name: firstName,
        last_name: lastName,
        user,
        password_hash: passwordHash,
        salt
      }
    });
  }
}

module.exports = UserRepository;
