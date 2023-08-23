/*
const express = require("express");
const pool = require("./db");
const port = 1337;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post('/', (req, res) => {
    const { name, location } = req.body
    res.status(200).send({
        message: `you keys were ${name}, ${location}`
    })
})

app.listen(port, () => console.log(`Server has started on port ${port}`));

*/

const express = require("express");
const pool = require("./db");
const port = 4000;

const app = express();
app.use(express.json());

//routes

app.get("/setup", async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE schools( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))"
    );
    res.status(200).send({ message: "Successfully created table" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  const { name, location } = req.body;
  try {
    await pool.query("INSERT INTO schools (name, address) VALUES ($1, $2)", [
      name,
      location,
    ]);
    res.status(200).send({ message: "Successfully added child" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM schools");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// GET user by Id
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const query = "SELECT * FROM schools WHERE id = $1";
    const values = [userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const user = result.rows[0];
      return res.json(user);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
