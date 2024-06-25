const express = require("express");
const router = express.Router();
const virementcontroller = require("../controller/virementcontroller");

// Routes pour les virements
router.post("/addvirement", virementcontroller.addVirement);
router.get("/show", virementcontroller.showVirements);
router.get("/show/:id", virementcontroller.getVirement);
router.put("/update/:id", virementcontroller.updateVirement);
router.delete("/delete/:id", virementcontroller.deleteVirement);

module.exports = router;
