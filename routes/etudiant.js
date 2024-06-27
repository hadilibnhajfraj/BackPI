const express = require("express");
const router = express.Router();
const etudiantController = require("../controller/etudiantController");

router.get('/all', etudiantController.show);

router.post('/add', etudiantController.add);

router.put('/update/:id', etudiantController.updated);

router.delete('/drop/:id', etudiantController.deleted);

router.get('/showById/:id', etudiantController.allbyId);

router.get('/showByName/:name', etudiantController.showByone);

module.exports = router;