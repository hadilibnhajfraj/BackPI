const express = require("express");
const router = express.Router();
const activiteController = require("../controller/activiteController");

router.get('/all', activiteController.show);

router.post('/add', activiteController.add);

router.put('/update/:id',activiteController.updated);

router.delete('/drop/:id', activiteController.deleted);

router.get('/showById/:id', activiteController.allbyId);

router.get('/showByName/:name',activiteController.showByone);

router.get("/enseignant/:idEnseignant", activiteController.findByEnseignant);

module.exports = router;