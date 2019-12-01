class Repository {
  constructor(storage) {
    this.storage = storage;
  }

  async getById(id) {
    throw Error("this method should be impelemented in child class");
  }

  async getAll() {
    throw Error("this method should be impelemented in child class");
  }
}

module.exports = Repository;
