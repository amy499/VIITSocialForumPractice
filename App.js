const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/students", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", callback => {
  console.log("connection succeeded");
});

const app = express();

app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "static")));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.post("/signup", (req, res) => {
  var data = {
    email: req.body.email_address,
    GrNo: req.body.gr_number,
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    mobileNumber: req.body.mobile_num,
    department: req.body.departmentName,
    Year: req.body.currentYear,
    division: req.body.currentDivision,
    password: req.body.createPassword
  };
  db.collection("details").insertOne(data, (err, collection) => {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  res.send("Fina-fucking-lly Registered! YOU BITCH ASS");
});

app.post("/login", (req, res) => {
  db.collection("details").findOne({ email: req.body.email }, (err, user) => {
    if (user === null) {
      res.end("Login Invalid");
      console.log("No Such User");
    } else if (
      user.email === req.body.email &&
      user.password === req.body.pwd
    ) {
      res.send("Logged In");
    } else {
      console.log("Credentials wrong");
      res.end("Login Invalid");
    }
  });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "registration.html"));
});

app.get("/login_form", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "login.html"));
});
app.listen(3000);

console.log("server listening at port 3000");
