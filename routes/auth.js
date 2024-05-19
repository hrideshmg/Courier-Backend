const db = require("../db");
const express = require("express");
const router = express.Router();
const md5 = require("md5");

router.post("/register", (req, res) => {
  body = req.body;
  errors = [];
  if (!body.email) errors.push("No Email Specified");
  if (!body.password) errors.push("No Password Specified");
  if (errors.length) {
    res.status(400).json({ errors: errors });
  } else {
    var insert = "insert into user (email,password) values ($email, $password)";
    db.run(
      insert,
      {
        $email: body.email,
        $password: md5(body.password),
      },
      (err) => {
        if (err) {
          res.status(400).json({ errors: [err.message] });
        } else {
          res.status(200).send({});
        }
      },
    );
  }
});

router.post("/login", (req, res) => {
  const body = req.body;
  const errors = [];
  if (!body.email) errors.push("No Email Specified");
  if (!body.password) errors.push("No Password Specified");
  if (errors.length) {
    res.status(400).json({ errors: errors });
  } else {
    const query =
      "SELECT * FROM user WHERE email = $email AND password = $password";
    db.get(
      query,
      {
        $email: body.email,
        $password: md5(body.password),
      },
      (err, row) => {
        if (err) {
          res.status(500).json({ errors: [err.message] });
        } else if (!row) {
          res.status(403).json({ errors: ["Invalid email or password"] });
        } else {
          req.session.user = {
            id: row.id,
            email: row.email,
          };
          console.log(req.session.user);
          res.status(200).json({ message: "Login successful" });
        }
      },
    );
  }
});

module.exports = router;
