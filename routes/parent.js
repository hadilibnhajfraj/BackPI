const express = require("express");
const router = express.Router();
const parentController = require("../controller/parentController");

router.get('/all', parentController.show);

router.post('/add', parentController.add);

router.put('/update/:id', parentController.updated);

router.delete('/drop/:id', parentController.deleted);

router.get('/showById/:id', parentController.allbyId);

router.get('/showByName/:name', parentController.showByone);

module.exports = router;