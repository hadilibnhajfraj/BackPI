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

const classRoute = require("./routes/classeRoute");
const coursRoute = require("./routes/coursRoutes");
const emploieRoute = require("./routes/emploieRoute");
const etudiantRoute = require("./routes/etudiantRoute");
const matiereRoute = require("./routes/matiereRoute");
const salleRoute = require("./routes/salleRoute");
const seanceRoute = require("./routes/seanceRoute");
const userRoute = require("./routes/userRoute");

var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/salle", salleRoute);
app.use("/matiere", matiereRoute);
app.use("/etudiant", etudiantRoute);
app.use("/emploie", emploieRoute);
app.use("/cours", coursRoute);
app.use("/classe", classRoute);
app.use("/seance", seanceRoute);

const server = http.createServer(app);

server.listen(3000, console.log("server run"));
module.exports = app;
