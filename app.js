//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
let auth = require("./middleware/auth");
let config = require("./config");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//dummy user login and password
const username = "dummyUser";
const password = "123";

//formula variables
var currentNum = 0;
var oldNum = 0;
var nextNum = 0;

app.get("/",function(req, res) {
  res.render("index"); //render index.ejs
});

app.get("/login",auth.checkToken,function(req, res) {
  res.render("login"); //render login.ejs
});

app.post("/login", function(req, res) {

  const requestedUsername = req.body.username;
  const requestedPassword = req.body.password;

  console.log("body : ",req.body);

  if (requestedUsername != username || requestedPassword != password) {
    res.status(403).json({
      success: false,
      message: 'Incorrect username or password'
    });
  } else {
      //jwt authentication, takes in payload, secret, and options as arguments
      let token = jwt.sign({username: username}, //find out which user is owner of token
        config.secret,
        { expiresIn: '24h' // option, expires in 24 hours
        }
      );
      // return the jwt token for future API calls
      res.json({
        success: true,
        message: 'Authentication successful!',
        token: token //generated token is string
      });
  }
});

app.get("/counter",function(req, res) {
  res.render("counter", {
    myCurrentNum: currentNum
  });
});

app.post("/counter",auth.checkToken,function(req, res) {
  var cancelValue = req.body.cancel;
  var confirmValue = req.body.confirm;

  console.log(req.body);
  if (cancelValue != 'false'){
    console.log("CANCEL",currentNum);
   return res.json({
      myCurrentNum: currentNum
    });
  }

  if (confirmValue != 'false'){
    console.log("CONFIRM",nextNum);
    currentNum =nextNum;
    return res.json({
      myCurrentNum: nextNum
    });
  }
});

app.post("/result",auth.checkToken,function(req, res) {
  oldNum = currentNum; //store the currentNum safely in oldNum

  if (currentNum*2 < 1){
    nextNum = 1;
  } else {
    nextNum = currentNum * 2;
  }

  res.json({
    success: true,
    message:  {
      myOldNum: oldNum,
      myNextNum: nextNum
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
