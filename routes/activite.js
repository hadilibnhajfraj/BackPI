const express = require("express");
const router = express.Router();
const activiteController = require("../controller/activiteController");

router.post("/add", activiteController.add);
router.get("/getActivite", activiteController.show);
router.put("/updatetActivite/:id", activiteController.update);
router.delete("/deleteActivite/:id", activiteController.deleteActivites);
module.exports = router;
