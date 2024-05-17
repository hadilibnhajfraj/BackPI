const express = require("express");
const router = express.Router();
const exerciceController = require("../controller/excerciceController");

router.get('/all', exerciceController.show);

router.post('/add', exerciceController.add);

router.put('/update/:id',exerciceController.updated);

router.delete('/drop/:id', exerciceController.deleted);

router.get('/showById/:id', exerciceController.allbyId);

router.get('/showByName/:name',exerciceController.showByone);

router.get('/findByCourse/:courseId', exerciceController.findByCourse);

router.get('/findByType/:type', exerciceController.findByType);

router.get('/findByDateRange', exerciceController.findByDateRange);

module.exports = router;