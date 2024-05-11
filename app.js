const http = require("http");
const express = require("express");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");

mongo.connect(mongoconnect.url, {useNewUrlParser: true,useUnifiedTopology: true}).then(() => console.log("mongo connecter")).catch((err) => console.log(err));


const enseignantRouter = require("../BackPI/routes/enseignant.js");
const classesRouter = require("../BackPI/routes/classes.js");
const activiteRouter = require("../BackPI/routes/activite.js");
const etudiantRouter = require("../BackPI/routes/etudiant.js");
const exerciceRouter = require("../BackPI/routes/exercice.js");
const coursRouter = require("../BackPI/routes/cours.js");
const observationRouter = require("../BackPI/routes/observation.js");
const userRouter = require("../BackPI/routes/user.js");
const parentRouter = require("../BackPI/routes/parent.js");
const matiereRouter = require("../BackPI/routes/matiere.js");


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/enseignant", enseignantRouter);
app.use("/classes", classesRouter);
app.use("/activite", activiteRouter);
app.use("/etudiant", etudiantRouter);
app.use("/exercice", exerciceRouter);
app.use("/cours", coursRouter);
app.use("/observation",observationRouter);
app.use("/user", userRouter);
app.use("/parent", parentRouter);
app.use("/matiere", matiereRouter);

const server = http.createServer(app);

server.listen(3000, console.log("server run"));
module.exports = app;
