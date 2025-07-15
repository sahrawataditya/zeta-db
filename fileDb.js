const fs = require("fs");
const path = require("path");

class mainDb {
  constructor(dbName = "mydatabase") {
    this.dbName = dbName;
    this.filePath = path.join(__dirname, `${dbName}.json`);
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(rawData);
      }
    } catch (error) {
      console.error("Error loading database:", error);
    }
    // Initialize empty database structure
    return { schemas: {}, tables: {} };
  }

  saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
      return true;
    } catch (error) {
      console.error("Error saving database:", error);
      return false;
    }
  }

  createTable(tableName, schema) {
    if (this.data.tables[tableName]) {
      throw new Error(`Table ${tableName} already exists`);
    }

    this.data.schemas[tableName] = schema;
    this.data.tables[tableName] = {};
    return this.saveData();
  }

  insert(tableName, record) {
    if (!this.data.tables[tableName]) {
      throw new Error(`Table ${tableName} doesn't exist`);
    }

    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    this.data.tables[tableName][id] = { ...record, id };
    return this.saveData() ? id : false;
  }

  find(tableName, conditions = {}) {
    if (!this.data.tables[tableName]) {
      throw new Error(`Table ${tableName} doesn't exist`);
    }

    const records = Object.values(this.data.tables[tableName]);

    if (Object.keys(conditions).length === 0) {
      return records;
    }

    return records.filter((record) => {
      return Object.entries(conditions).every(([key, value]) => {
        return record[key] === value;
      });
    });
  }

  update(tableName, id, updates) {
    if (!this.data.tables[tableName]?.[id]) {
      throw new Error(`Record ${id} not found in table ${tableName}`);
    }

    this.data.tables[tableName][id] = {
      ...this.data.tables[tableName][id],
      ...updates,
    };
    return this.saveData();
  }

  delete(tableName, id) {
    if (!this.data.tables[tableName]?.[id]) {
      throw new Error(`Record ${id} not found in table ${tableName}`);
    }

    delete this.data.tables[tableName][id];
    return this.saveData();
  }
}

module.exports = { mainDb };
