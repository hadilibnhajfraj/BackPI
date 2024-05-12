const express = require("express");
const router = express.Router();
const busController = require("../controller/busController");

router.post("/add", busController.add);
router.get("/getBus", busController.show);
router.put("/updatetBus/:id", busController.update);
router.delete("/deleteBus/:id", busController.deleteBus);
module.exports = router;
