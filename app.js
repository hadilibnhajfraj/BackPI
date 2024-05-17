const http = require("http");
const express = require("express"); // Importer Express
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");

const offrerouter = require("./routes/offre");
const chequerouter = require("./routes/cheque");
const facturerouter = require("./routes/facture");
const fraisrouter = require("./routes/frais");

const app = express(); // Créer une instance d'application Express

app.use(bodyParser.json());

// Définir les routes
app.use("/offre", offrerouter);
app.use("/cheque", chequerouter);
app.use("/facture", facturerouter);
app.use("/frais", fraisrouter);

// Connexion à MongoDB
mongo.connect(mongoconnect.url, mongoconnect.options)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const server = http.createServer(app); // Utiliser l'instance d'application pour créer le serveur
server.listen(3000, () => console.log("Server running on port 3000")); // Utiliser une fonction de rappel pour afficher le message de démarrage
