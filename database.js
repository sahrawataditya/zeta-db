const express = require("express");
const bodyParser = require("body-parser");
const { mainDb } = require("./fileDb");

class DatabaseServer {
  constructor(port = 5656) {
    this.port = port;
    this.app = express();
    this.db = new mainDb();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(bodyParser.json());
  }

  setupRoutes() {
    this.app.post("/tables/:tableName", (req, res) => {
      try {
        const { tableName } = req.params;
        const { schema } = req.body;
        this.db.createTable(tableName, schema);
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Record operations
    this.app.post("/:tableName", (req, res) => {
      try {
        const { tableName } = req.params;
        const record = req.body;
        const id = this.db.insert(tableName, record);
        res.status(201).json({ id, ...record });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get("/:tableName", (req, res) => {
      try {
        const { tableName } = req.params;
        const conditions = req.query;
        const records = this.db.find(tableName, conditions);
        res.json(records);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.put("/:tableName/:id", (req, res) => {
      try {
        const { tableName, id } = req.params;
        const updates = req.body;
        this.db.update(tableName, id, updates);
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.delete("/:tableName/:id", (req, res) => {
      try {
        const { tableName, id } = req.params;
        this.db.delete(tableName, id);
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Database server running on port ${this.port}`);
    });
  }
}

module.exports = { DatabaseServer };

if (require.main === module) {
  const server = new DatabaseServer();
  server.start();
}
