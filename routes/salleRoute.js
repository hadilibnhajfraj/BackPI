const express = require("express");
const router = express.Router();
const salleController = require("../controller/salleController");
router.post("/add", salleController.add);
router.get("/show", salleController.show);
router.put("/update/:id", salleController.update);
router.delete("/delete/:id", salleController.deleted);
module.exports = router;
