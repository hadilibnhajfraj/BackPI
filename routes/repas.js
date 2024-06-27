const express = require("express");
const router = express.Router();
const repasController = require("../controller/repasControlelr");

router.post("/add", repasController.add);
router.get("/getRepas", repasController.show);
router.get("/getAllRepas", repasController.getAllRepas);
router.put("/updatetRepas/:id", repasController.update);
router.put("/updatetRepasallergie/:id/allergies", repasController.updateAllergieRepas);
router.get('/repas/:id', repasController.getRepas);
router.get('/repasallergie/:id', repasController.getRepasAllergie);
router.delete("/deleteRepas/:id", repasController.deleteRepas);
router.post('/repas/:repasId/favori', repasController.marquerRepasFavori);
module.exports = router;
