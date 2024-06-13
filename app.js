const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const mongoConnection = require("../BackPI/config/dbconnection.json");
const path = require("path");
const cors = require("cors");
dotenv.config();
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
  app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var messageRouter = require("../BackPI/routes/messageroute");
var userRoute = require("../BackPI/routes/userroute");
var etudiantRoute = require("../BackPI/routes/etudiantRoute");
var reclamationRoute = require("../BackPI/routes/reclamationRoute");
var responceRoute = require("../BackPI/routes/responceRoute");



const bodyParser = require("body-parser");

// app.use(express.json()); // You can uncomment this line if needed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/message", messageRouter);
app.use("/user", userRoute);
app.use("/etudiant", etudiantRoute);
app.use("/reclamation", reclamationRoute);
app.use("/responce", responceRoute);


const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;
