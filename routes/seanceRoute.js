const express = require("express");
const router = express.Router();
const seanceController = require("../controller/seanceController");
router.post("/add", seanceController.add);
router.get("/show", seanceController.show);
router.put("/update/:id", seanceController.update);
router.delete("/delete/:id", seanceController.deleted);
router.get('/options', seanceController.fetchAvailableOptions);
router.delete('/:id/cancel', seanceController.cancelSeance);
router.get("/show/:id", seanceController.findSeance);

module.exports = router;
