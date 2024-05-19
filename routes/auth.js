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

module.exports = router;
