const express = require("express");
const router = express.Router();
const matiereController = require("../controller/matiereController");

router.get('/all', matiereController.show);

router.post('/add', matiereController.add);

router.put('/update/:id', matiereController.updated);

router.delete('/drop/:id', matiereController.deleted);

router.get('/showById/:id', matiereController.allbyId);

router.get('/showByName/:name', matiereController.showByone);

module.exports = router;