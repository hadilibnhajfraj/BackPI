const express = require("express");
const router = express.Router();
const enseignantController = require("../controller/enseignantController");

router.get('/all', enseignantController.show);

router.post('/add', enseignantController.add);

router.put('/update/:id',enseignantController.updated);

router.delete('/drop/:id', enseignantController.deleted);

router.get('/showById/:id', enseignantController.allbyId);

router.get('/showByName/:name',enseignantController.showByone);

module.exports = router;