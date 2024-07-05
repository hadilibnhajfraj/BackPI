
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");
const cors = require('cors');
const { afficherConversation } = require("./controller/mesageController");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
// Middleware to parse JSON and URL-encoded bodies
/*app.use(express.json());
app.use(express.urlencoded({ extended: true }));*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Connect to MongoDB
mongoose
    .connect(mongoconnect.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connecté"))
    .catch((err) => console.log(err));


// Chargement des routes
const alergieRouter = require("../BackPI/routes/alergie");
const repasRouter = require("../BackPI/routes/repas");
const busRouter = require("../BackPI/routes/bus");
const notificationRouter = require("../BackPI/routes/notification");
const inscriptionRouter = require("../BackPI/routes/inscription");
const classesRouter = require("../BackPI/routes/classes.js");
const activiteRouter = require("../BackPI/routes/activite.js");
const etudiantRouter = require("../BackPI/routes/etudiant.js");
const exerciceRouter = require("../BackPI/routes/exercice.js");
const coursRouter = require("../BackPI/routes/cours.js");
const observationRouter = require("../BackPI/routes/observation.js");
const userRouter = require("../BackPI/routes/userRoutes.js");
const matiereRouter = require("../BackPI/routes/matiere.js");
const devoirRouter = require("../BackPI/routes/devoir.js");
const offrerouter = require("./routes/offre");
const chequerouter = require("./routes/cheque");
const facturerouter = require("./routes/facture");
const fraisrouter = require("./routes/frais");
const banquerouter = require("./routes/banque");
const userrouter = require("./routes/userRoutes.js");
const virementrouter = require("./routes/virement");
const classRoute = require('./routes/classeRoute');
const coursRoute = require('./routes/coursRoutes');
const emploieRoute = require('./routes/emploieRoute');
const emploieEnseignantRoute = require('./routes/emploieEnseignantRoute');
//const etudiantRoute = require('./routes/etudiantRoute');
const matiereRoute = require('./routes/matiereRoute');
const salleRoute = require('./routes/salleRoute');
const seanceRoute = require('./routes/seanceRoute');
var messageRouter = require("../BackPI/routes/messageroute");

var etudiantRoute = require("../BackPI/routes/etudiantRoute");
var reclamationRoute = require("../BackPI/routes/reclamationRoute");
var responceRoute = require("../BackPI/routes/responceRoute");
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
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Définition des routes
app.use("/alergie", alergieRouter);
app.use("/repas", repasRouter);
app.use("/bus", busRouter);
app.use("/notification", notificationRouter);
app.use("/inscription", inscriptionRouter);
app.use("/classes", classesRouter);
app.use("/activite", activiteRouter);
app.use("/etudiant", etudiantRouter);
app.use("/exercice", exerciceRouter);
app.use("/cours", coursRouter);
app.use("/observation", observationRouter);
app.use("/users", userRouter);
app.use("/matiere", matiereRouter);
app.use("/devoir", devoirRouter);
// Définir les routes
app.use("/offre", offrerouter);
app.use("/cheque", chequerouter);
app.use("/facture", facturerouter);
app.use("/frais", fraisrouter);
app.use("/banque", banquerouter);
app.use("/user", userrouter);
app.use("/virement", virementrouter);
app.use('/salle', salleRoute);
app.use('/matiere', matiereRoute);
app.use('/etudiants', etudiantRoute);
app.use('/emploie', emploieRoute);
app.use('/cours', coursRoute);
app.use('/classe', classRoute);
app.use('/seance', seanceRoute);
app.use('/emploiEnseignant', emploieEnseignantRoute);
//app.use("/etudiant", etudiantRoute);
app.use("/reclamation", reclamationRoute);
app.use("/responce", responceRoute);
app.use("/message", messageRouter);
app.use('/uploads', express.static('uploads'));
const server = http.createServer(app);
const corsOptionss = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use(cors(corsOptionss));
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Un client est connecté');

  socket.on('msgs', (msg) => {
    console.log('Message reçu : ', msg);
    // Faire quelque chose avec le message reçu, comme le transmettre à d'autres utilisateurs
    socket.broadcast.emit('msgs', msg); // Envoyer le message à tous les autres clients connectés
  });

  socket.on('fetchConversation', ({ id1, id2 }) => {
    // Logique pour récupérer la conversation entre id1 et id2
    const conversation = fetchConversationFromDatabase(id1, id2);
    socket.emit('conversationData', conversation);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});