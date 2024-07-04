const express = require("express");
const router = express.Router();
const classcontroller = require("../controller/classeController");
router.post("/add", classcontroller.add);
router.get("/show", classcontroller.showClass);
router.put("/update/:id", classcontroller.updated);
router.delete("/delete/:id", classcontroller.deleted);
module.exports = router;
