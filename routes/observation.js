const express = require("express");
const router = express.Router();
const observationController = require("../controller/observationController");

router.get('/all', observationController.show);

router.post('/add', observationController.add);

router.put('/update/:id',observationController.updated);

router.delete('/drop/:id', observationController.deleted);

router.get('/showById/:id', observationController.allbyId);

router.get('/showByName/:name',observationController.showByone);

router.get('/meal/:mealType', observationController.getByMealType);

router.get('/byMood/:mood', observationController.getByMood);

router.get('/health/:healthStatus', observationController.getByHealthStatus);

module.exports = router;