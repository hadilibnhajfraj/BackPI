const express = require("express");
const router = express.Router();
const busController = require("../controller/busController");

router.post("/add", busController.add);
router.post("/addChauffeur", busController.addChauffeur);
router.get("/getBus", busController.show);
router.get("/getChauffeur", busController.showChauffeur);
router.put("/updatetBus/:id", busController.update);
router.put("/updatetChauffeur/:id", busController.updateChauffeur);
router.delete("/deleteBus/:id", busController.deleteBus);
router.delete("/deleteChauffeur/:id", busController.deleteChauffeur);
module.exports = router;
