const http = require("http");
const express = require("express");
const mongoose = require("mongoose"); // It's generally good practice to stick with conventional naming
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");

// Create the Express app
var app = express();

// Connect to MongoDB
mongoose
  .connect(mongoconnect.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Configure middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Create the HTTP server using the Express app
const server = http.createServer(app);
server.listen(3000, () => console.log("Server running on port 3000"));

// Export the app for other modules to use
module.exports = app;
