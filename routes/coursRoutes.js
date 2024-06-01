const express = require("express");
const router = express.Router();
const coursController = require("../controller/coursController");
router.post("/add", coursController.add);
router.get("/show", coursController.show);
router.put("/update/:id", coursController.update);
router.delete("/delete/:id", coursController.deletecours);
module.exports = router;
