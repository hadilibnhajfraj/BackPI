const http = require("http");
const express = require("express");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");
const cors = require("cors");
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
const notificationRouter = require("../BackPI/routes/notification");
const inscriptionRouter = require("../BackPI/routes/inscription");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/alergie", alergietRouter);
app.use("/etudiant", etudiantRouter);
app.use("/repas", repasRouter);
app.use("/bus", busRouter);
app.use("/activite", activiteRouter);
app.use("/notification", notificationRouter);
app.use("/inscription", inscriptionRouter);
const server = http.createServer(app);

server.listen(3000, console.log("server run"));
module.exports = app;
