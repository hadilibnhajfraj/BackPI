const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('./config/dbconnection.json');

// Import routes
const classRoute = require('./routes/classeRoute');
const coursRoute = require('./routes/coursRoutes');
const emploieRoute = require('./routes/emploieRoute');
const emploieEnseignantRoute = require('./routes/emploieEnseignantRoute');
const etudiantRoute = require('./routes/etudiantRoute');
const matiereRoute = require('./routes/matiereRoute');
const salleRoute = require('./routes/salleRoute');
const seanceRoute = require('./routes/seanceRoute');
const userRoute = require('./routes/userRoute');

// Initialize express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Set up mongoose connection
mongoose.connect(config.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Define routes
app.use('/user', userRoute);
app.use('/salle', salleRoute);
app.use('/matiere', matiereRoute);
app.use('/etudiant', etudiantRoute);
app.use('/emploie', emploieRoute);
app.use('/cours', coursRoute);
app.use('/classe', classRoute);
app.use('/seance', seanceRoute);
app.use('/emploiEnseignant', emploieEnseignantRoute);

// Create and start server
const server = http.createServer(app);
server.listen(3000, () => console.log('Server running on port 3000'));
module.exports = app;
