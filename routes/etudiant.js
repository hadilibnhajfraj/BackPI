const express = require("express");
const router = express.Router();
const etudiantController = require("../controller/etudiantcontroller");

router.post("/add", etudiantController.add);

module.exports = router;
