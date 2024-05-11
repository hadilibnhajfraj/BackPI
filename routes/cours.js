const express = require("express");
const router = express.Router();
const coursController = require("../controller/coursController");

router.get('/all', coursController.show);

router.post('/add', coursController.add);

router.put('/update/:id',coursController.updated);

router.delete('/drop/:id', coursController.deleted);

router.get('/showById/:id', coursController.allbyId);

router.get('/showByName/:name',coursController.showByone);

module.exports = router;