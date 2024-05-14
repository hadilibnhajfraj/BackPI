const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const mongoConnection = require("../BackPI/config/dbconnection.json");
const path = require("path");
var app = express(); // Move this line up
// les deux lignes hethom homa ali ya9raw fichier .twig ay haja feha html
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig"); 

mongoose
  .connect(mongoConnection.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo connection error:", err));
var messageRouter = require("../BackPI/routes/messageroute");
var userRoute = require("../BackPI/routes/userroute");


const bodyParser = require("body-parser");

// app.use(express.json()); // You can uncomment this line if needed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/message", messageRouter);
app.use("/user", userRoute);

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;
