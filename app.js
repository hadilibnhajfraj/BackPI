const http = require("http");
const express = require("express");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");


mongo.connect(mongoconnect.url, {useNewUrlParser: true,useUnifiedTopology: true}).then(() => console.log("mongo connecter")).catch((err) => console.log(err));


const classesRouter = require("./routes/classes.js");
const activiteRouter = require("./routes/activite.js");
const etudiantRouter = require("./routes/etudiant.js");
const exerciceRouter = require("./routes/exercice.js");
const coursRouter = require("./routes/cours.js");
const observationRouter = require("./routes/observation.js");
const userRouter = require("./routes/user.js");
const matiereRouter = require("./routes/matiere.js");
const devoirRouter = require("./routes/devoir.js");


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/classes", classesRouter);
app.use("/activite", activiteRouter);
app.use("/etudiant", etudiantRouter);
app.use("/exercice", exerciceRouter);
app.use("/cours", coursRouter);
app.use("/observation",observationRouter);
app.use("/user", userRouter);
app.use("/matiere", matiereRouter);
app.use("/devoir", devoirRouter);

app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);

server.listen(process.env.PORT || 3200,()=>{
    console.log("server run")
});



module.exports = app;
