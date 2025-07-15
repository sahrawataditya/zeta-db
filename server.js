const express = require("express");
const bodyParser = require("body-parser");
const { Model, StringField, NumberField, BooleanField } = require("./orm");

class User extends Model {
  static id = new NumberField();
  static name = new StringField();
  static email = new StringField();
  static isAdmin = new BooleanField();
}

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Initialize database connection
User.init().then(() => {
  console.log("Database connection ready");
});

// Routes
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const id = await user.save();
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find(req.query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.update(id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Application server running on port ${port}`);
});
