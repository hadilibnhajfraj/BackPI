const http = require("http");
const express = require("express");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");

mongo
  .connect(mongoconnect.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongo connecter"))
  .catch((err) => console.log(err));

const alergietRouter = require("../BackPI/routes/alergie");
const etudiantRouter = require("../BackPI/routes/etudiant");
const repasRouter = require("../BackPI/routes/repas");
const busRouter = require("../BackPI/routes/bus");
const activiteRouter = require("../BackPI/routes/activite");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/alergie", alergietRouter);
app.use("/etudiant", etudiantRouter);
app.use("/repas", repasRouter);
app.use("/bus", busRouter);
app.use("/activite", activiteRouter);
const server = http.createServer(app);

server.listen(3000, console.log("server run"));
module.exports = app;
