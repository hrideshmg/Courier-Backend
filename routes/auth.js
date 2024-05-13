const db = require("../db");
const express = require("express");
const router = express.Router();
const md5 = require("md5");

/* GET home page. */
router.get("/", function (req, res) {
  db.get(
    "select email from user where name=$name",
    { $name: "admin" },
    (err, row) => {
      if (!row || err) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json({ email: row });
      }
    },
  );
});

router.post("/register", (req, res) => {
  body = req.body;
  errors = [];
  if (!body.username) errors.push("No Username Specified");
  if (!body.email) errors.push("No Email Specified");
  if (!body.password) errors.push("No Password Specified");
  if (errors.length) {
    res.status(400).json({ errors: errors });
  } else {
    var insert =
      "insert into user (name,email,password) values ($name, $email, $password)";
    db.run(
      insert,
      {
        $name: body.username,
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

module.exports = router;
