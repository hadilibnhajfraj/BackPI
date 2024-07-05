const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mongoConnection = require("../BackPI/config/dbconnection.json");
const path = require("path");
const cors = require("cors");
const { afficherConversation } = require("./controller/mesageController");
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
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use(cors(corsOptions));

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
app.use('/uploads', express.static('uploads'));
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("fetchConversation", async ({ id1, id2 }) => {
    try {
      const data = await afficherConversation(id1, id2);
      io.emit("conversationData", data);
    } catch (err) {
      console.error("Error fetching conversation:", err);
      socket.emit("conversationError", { error: "Internal Server Error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("msg", "user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;
