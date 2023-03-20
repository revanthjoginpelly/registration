const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const { conenctMongo, user_model } = require("./mongoose");
const { signinRouter } = require("./routes/signim.route");
const { registerRouter } = require("./routes/register.route");
//const { ftruncateSync } = require('fs')

const port = 3000;

const app = express();

//app.use(express.json())

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "views")));

app.get("/", (req, res) => {
  res.render("index1");
});

app.use("/signin", signinRouter);

app.use("/register", registerRouter);

async function finduser(filter) {
  return user_model.findOne(filter);
}

app.get("/users/:email", async (req, res) => {
  var emailWith = req.params.email;
  let email = emailWith.slice(1);

  const result = await finduser({ email });
  var user_name = result.user_name;
  var user_email = result.email;
  var age = result.age;
  var batch = result.batch;

  res.render("user", {
    user_name: user_name,
    user_email: user_email,
    age: age,
    batch: batch,
  });
});
app.get("/logout", (req, res) => {
  res.redirect("/");
});

async function startserver() {
  await conenctMongo();

  app.listen(port, (req, res) => {
    console.log(` port :${port}`);
  });
}

startserver();
