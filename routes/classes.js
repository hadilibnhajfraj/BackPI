const express = require("express");
const router = express.Router();
const classeController = require("../controller/classeController");

router.get('/all', classeController.show);

router.post('/add', classeController.add);

router.put('/update/:id',classeController.updated);

router.delete('/drop/:id', classeController.deleted);

router.get('/showById/:id', classeController.allbyId);

router.get('/showByName/:name',classeController.showByone);

module.exports = router;