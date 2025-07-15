const axios = require("axios");

class RemoteDB {
  constructor(baseURL = "http://localhost:5656") {
    this.client = axios.create({ baseURL });
  }

  async createTable(tableName, schema) {
    const response = await this.client.post(`/tables/${tableName}`, { schema });
    return response.data;
  }

  async insert(tableName, record) {
    const response = await this.client.post(`/${tableName}`, record);
    return response.data.id;
  }

  async find(tableName, conditions = {}) {
    const response = await this.client.get(`/${tableName}`, {
      params: conditions,
    });
    return response.data;
  }

  async update(tableName, id, updates) {
    const response = await this.client.put(`/${tableName}/${id}`, updates);
    return response.data;
  }

  async delete(tableName, id) {
    const response = await this.client.delete(`/${tableName}/${id}`);
    return response.data;
  }
}

class Model {
  static db = new RemoteDB();

  static async init() {
    try {
      await this.db.createTable(this.name, this.getSchema());
    } catch (error) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }
  }

  static getSchema() {
    const schema = {};
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof Field) {
        schema[key] = value.type;
      }
    }
    return schema;
  }

  constructor(attributes = {}) {
    Object.assign(this, attributes);
  }

  async save() {
    const constructor = this.constructor;
    const record = {};

    for (const [key, value] of Object.entries(constructor)) {
      if (value instanceof Field) {
        record[key] = this[key];
      }
    }

    const id = await constructor.db.insert(constructor.name, record);
    this.id = id;
    return id;
  }

  static async find(conditions = {}) {
    const records = await this.db.find(this.name, conditions);
    return records.map((record) => new this(record));
  }

  static async update(id, updates) {
    return this.db.update(this.name, id, updates);
  }

  static async delete(id) {
    return this.db.delete(this.name, id);
  }
}

// Field definitions remain the same as before
class Field {
  constructor(type) {
    this.type = type;
  }
}

class StringField extends Field {
  constructor() {
    super("string");
  }
}

class NumberField extends Field {
  constructor() {
    super("number");
  }
}

class BooleanField extends Field {
  constructor() {
    super("boolean");
  }
}

module.exports = { Model, StringField, NumberField, BooleanField };
