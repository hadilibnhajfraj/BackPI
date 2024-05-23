const http = require("http");
const express = require("express"); // Importer Express
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoconnect = require("./config/dbconnection.json");
const offrerouter = require("./routes/offre");
const chequerouter = require("./routes/cheque");
const facturerouter = require("./routes/facture");
const fraisrouter = require("./routes/frais");
const banquerouter = require("./routes/banque");
const userrouter = require("./routes/user");

const EventEmitter = require('events');

// Augmenter la limite des écouteurs par défaut
EventEmitter.defaultMaxListeners = 20;

const app = express(); // Créer une instance d'application Express

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

// Définir les routes
app.use("/offre", offrerouter);
app.use("/cheque", chequerouter);
app.use("/facture", facturerouter);
app.use("/frais", fraisrouter);
app.use("/banque", banquerouter);
app.use("/user", userrouter);

// Connexion à MongoDB
mongoose.connect(mongoconnect.url, mongoconnect.options)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const server = http.createServer(app); // Utiliser l'instance d'application pour créer le serveur
server.listen(3000, () => console.log("Server running on port 3000")); // Utiliser une fonction de rappel pour afficher le message de démarrage
