const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
//connect to database 
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "webtest_db",

});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const status = req.body.status;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      res.send({ message: err });
    }

    db.query(
      "INSERT INTO users (username, password,status) VALUES (?,?,?)",
      [username, hash, status],
      (err, result) => {

        if (status === "student") {
          db.query(
            "INSERT INTO students (id, username,type,pretest) VALUES (?,?,'',0)",
            [result.insertId, username],
            (err, result) => {
            }
          );
        }
        res.send({ message: err });
      }
    );

  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get("/logout", (req, res) => {
  req.session.user = null;
  res.send({ massage: "logout susess" });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, results) => {
      if (err) {
        res.send({ err: err });
      }
      if (results.length == 1) {
        bcrypt.compare(password, results[0].password, (error, response) => {
          if (response) {
            req.session.user = results[0];
            res.send(results[0]);
          }
          else {
            res.send({ message: "Wrong username/password combination!" });
          }

        });

      }
      else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

app.post("/addpretest", (req, res) => {
  const username = req.body.username;
  const pretest = req.body.pretest;
  const type = (pretest <= 25) ? "D" : (pretest <= 50) ? "C" : (pretest <= 75) ? "B" : "A";
  const listTest = { D: [1, 2, 3], C: [4, 5, 6], B: [7, 8, 9] }
  const test = type == "A" ? 0 : 3;
  const listSend = [];
  if (req.session.user && (req.session.user.status === "techer")) {

    db.query(
      "UPDATE students SET type = ?, pretest = ? WHERE username = ?",
      [type, pretest, username],
      (err, result) => {
        if (err) {
          listSend.push(err);
        }
      }
    );
    const Tid = (type === "D") ? listTest.D : (type === "C") ? listTest.C : (type === "B") ? listTest.B : [];
    for (let i = 0; i < test; i++) {
      db.query(
        "INSERT INTO scores (username, Tid,session1,session2,session3,status) VALUES (?,?,0,0,0,0)",
        [username, Tid[i]],
        (error, result) => {
          if (error) {
            listSend.push(error);
          }
        }
      );
    }
    res.send({ massage: listSend })
  }
});

app.get("/students", (req, res) => {
  if (req.session.user && (req.session.user.status === "techer")) {
    db.query(
      "SELECT * FROM students",
      (err, results) => {
        if (err) {
          res.send({ message: err });
        }
        res.send(results);
      });

  } else {
    res.send({ loggedIn: false });
  }
});

app.get("/student", (req, res) => {
  if (req.session.user && (req.session.user.status === "student")) {
    db.query(
      "SELECT * FROM students WHERE username= ?;", req.session.user.username,
      (err, results) => {
        if (err) {
          res.send({ message: err });
        }
        res.send(results);
      });

  } else {
    res.send({ loggedIn: false });
  }
});


app.post("/score", (req, res) => {
  const student = req.body.student;
  if (req.session.user && req.session.user.status == 'techer') {
    db.query(
      "SELECT * FROM scores WHERE username = ? AND status = 1;;", student,
      (err, results) => {
        if (err) {
          res.send({ message: err });
        }

        res.send(results);
      });

  } else {
    res.send({ loggedIn: false });

  }
});

app.get("/score", (req, res) => {
  if (req.session.user && req.session.user.status == 'student') {
    db.query(
      "SELECT * FROM scores WHERE username = ? AND status = 0;", req.session.user.username,
      (err, results) => {
        if (err) {
          res.send({ message: err });
        }
        res.send(results);
      });

  } else {
    res.send({ loggedIn: false });

  }
});

app.post("/addsession3", (req, res) => {
  const id = req.body.id;
  const point = req.body.point;

  if (req.session.user && (req.session.user.status === "student")) {
    db.query(
      "UPDATE scores SET session3 = ?, status = 1 WHERE id = ?;",
      [point, id],
      (error, result) => {
        if (error) {
          res.send({ massage: error });
        } else {
          res.send("200 Ok");
        }
      }
    );
  } else {
    res.send({ loggedIn: false });

  }
});





app.listen(3001, () => {
  console.log("running server");
});