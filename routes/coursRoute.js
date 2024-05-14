const express = require("express");
const router = express.Router();
const courscontroller = require("../controller/coursController");
router.post("/add", courscontroller.add);
router.get("/show", courscontroller.show);
router.put("/update/:id", courscontroller.updated);
router.delete("/delete/:id", courscontroller.deleted);
module.exports = router;
