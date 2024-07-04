const express = require("express");
const router = express.Router();
const coursController = require("../controller/coursController");
router.post("/add", coursController.add);
router.get("/show", coursController.show);
router.put("/update/:id", coursController.updated);
router.delete("/delete/:id", coursController.deleted);
module.exports = router;
