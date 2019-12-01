const sqlite = require("sqlite");

class Storage {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      this.dbConnection = await sqlite.open("./database.sqlite");
      await this.dbConnection.migrate();

      this.initialized = true;
    }

    return this;
  }

  getItem({ key, value }) {
    return this.dbConnection.get(
      `SELECT * FROM users WHERE ${key} = '${value}'`
    );
  }

  insertItem({ insertTo, values }) {
    const columnsArray = Object.keys(values);
    const valuesArray = Object.keys(values).map(key => `'${values[key]}'`);

    return this.dbConnection.run(
      `INSERT INTO ${insertTo} (${columnsArray}) values (${valuesArray})`
    );
  }
}

module.exports = Storage;
