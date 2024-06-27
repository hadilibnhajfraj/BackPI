const express = require('express');
const router = express.Router();
const inscrireActivite  = require('../controller/inscriptionController');

router.post('/inscrire/:id_activite', inscrireActivite.inscrireActivite);

module.exports = router;
