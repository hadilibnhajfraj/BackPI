const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get('/all', userController.show);

router.post('/add', userController.add);

router.put('/update/:id', userController.updated);

router.delete('/drop/:id', userController.deleted);

router.get('/showById/:id', userController.allbyId);

router.get('/showByName/:name', userController.showByone);

module.exports = router;