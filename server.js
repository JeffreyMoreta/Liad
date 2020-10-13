const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const omdb = require("./config/api.js");
const morgan = require("morgan");
const ObjectId = require("mongodb").ObjectID;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const fetch = require("node-fetch");
const configDB = require("./config/database.js");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
var db;

mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  require("./app/routes.js")(app, passport, db, fetch, omdb, ObjectId);
});

require("./config/passport")(passport);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "rcbootcamp2020b",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const loungeName = "LoungeBot";

io.on("connection", (socket) => {
  socket.on("join", ({ username }) => {
    const user = userJoin(socket.id, username);

    socket.join();

    socket.emit("message", formatMessage(loungeName, "Welcome to the Lounge"));

    socket.broadcast.emit(
      "message",
      formatMessage(loungeName, `${user.username} has joined`)
    );
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    
    io.emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.emit(
        "message",
        formatMessage(loungeName, `${user.username} has disconnected`)
      );
    }
  });
});

server.listen(port);
console.log("The magic happens on port " + port);
