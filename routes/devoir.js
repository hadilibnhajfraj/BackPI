const express = require("express");
const router = express.Router();
const devoirController = require("../controller/devoirController");
const mailController = require("../controller/mailController"); // Import mailController

router.get('/all', devoirController.show);

router.post('/add', devoirController.add);

router.put('/update/:id', devoirController.updated);

router.delete('/drop/:id', devoirController.deleted);

router.get('/showById/:id', devoirController.allbyId);

router.get('/showByName/:name', devoirController.showByone);

router.post('/sendEmail', (req, res) => {
    mailController.sendMail(); // Appel de la fonction sendMail du contrôleur
    res.status(200).json({ message: 'Email sending initiated' });
});

module.exports = router;