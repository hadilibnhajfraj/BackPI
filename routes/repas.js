const express = require("express");
const router = express.Router();
const repasController = require("../controller/repasControlelr");

router.post("/add", repasController.add);
router.get("/getRepas", repasController.show);
router.put("/updatetRepas/:id", repasController.update);
router.delete("/deleteRepas/:id", repasController.deleteRepas);
module.exports = router;
