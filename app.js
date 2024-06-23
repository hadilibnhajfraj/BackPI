const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

// Chargement de la configuration de la base de données
const mongoconnect = require("./config/dbconnection.json");

// Connexion à MongoDB
mongoose.connect(mongoconnect.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté"))
.catch((err) => console.log("Erreur de connexion à MongoDB:", err));

// Chargement des routes
const alergieRouter = require("../BackPI/routes/alergie");
const etudiantRouter = require("../BackPI/routes/etudiant");
const repasRouter = require("../BackPI/routes/repas");
const busRouter = require("../BackPI/routes/bus");
const activiteRouter = require("../BackPI/routes/activite");
const notificationRouter = require("../BackPI/routes/notification");
const inscriptionRouter = require("../BackPI/routes/inscription");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Middleware CORS
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware pour analyser les corps de requête
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Définition des routes
app.use("/alergie", alergieRouter);
app.use("/etudiant", etudiantRouter);
app.use("/repas", repasRouter);
app.use("/bus", busRouter);
app.use("/activite", activiteRouter);
app.use("/notification", notificationRouter);
app.use("/inscription", inscriptionRouter);

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Le serveur tourne sur le port 3000");
});

module.exports = app;
