const express = require('express');
const router = express.Router();
const inscrireActivite  = require('../controller/inscriptionController');

// Route pour s'inscrire à une activité
router.post('/inscrire', inscrireActivite.inscrireActivite);

module.exports = router;
