const mongoose = require("mongoose");
const { ATLAS_DB_URL, NODE_ENV } = require("./server.config");

let instance;

class DBConnection {
  #isConnected;
  constructor(db_uri) {
    if (instance) {
      throw new Error("Only one connection can exist");
    }
    this.uri = db_uri;
    instance = this;
    this.#isConnected = false;
  }

  async connect() {
    if (this.#isConnected) {
      throw new Error("DB Already connected");
    }
    if (NODE_ENV == "development") {
      await mongoose.connect(ATLAS_DB_URL);
      this.#isConnected = true;
    }
  }

  async disconnect() {
    this.isConnected = false;
  }
}

const db = Object.freeze(new DBConnection());

module.exports = db;
