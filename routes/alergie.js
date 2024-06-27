const express = require("express");
const router = express.Router();
const alergieController = require("../controller/alergieController");

router.post("/add", alergieController.add);
router.get("/getlistetudiant", alergieController.getAll);
router.get("/getAlergie", alergieController.show);
router.put("/updatetAlergie/:id", alergieController.update);
router.delete("/deleteAlergie/:id", alergieController.deleteAlergie);
module.exports = router;
