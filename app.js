const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

//create connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "mike",
  password: "",
  database: "acme",
  connectionLimit: 10,
  port: "3306"
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + db.threadId);
});

app.get("/", (req, res) => res.send("Welcome to home screen"));

app.get("/getInfo", (req, res) => {
  db.query(`SELECT * FROM users;`, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/addUser", (req, res) => {
  let user = {
    first_name: "Jimmy",
    last_name: "Mac",
    email: "jim@gmail.com",
    password: "12345",
    location: "South Carolina",
    dept: "Java Developer",
    is_admin: 1
  };

  const {
    first_name,
    last_name,
    email,
    password,
    location,
    dept,
    is_admin
  } = user;

  db.query(
    `INSERT INTO users(first_name, last_name, email, password, location, dept, is_admin) 
    VALUES('${first_name}', '${last_name}', '${email}', '${password}', '${location}', '${dept}', '${is_admin}');`,
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.get("/deleteUser", (req, res) => {
  db.query(`DELETE FROM users WHERE id=6`, (err, results) => {
    if (err) throw err;
    res.send("user was deleted");
  });
});

app.get("/updateUser", (req, res) => {
  db.query(
    `UPDATE users SET first_name='Kim Updated' WHERE id=5`,
    (err, results) => {
      if (err) throw err;
      res.send("user updated");
    }
  );
});

app.listen(mysql, () => console.log("server started on Port 3000"));
