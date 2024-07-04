const express = require("express");
const router = express.Router();
const classcontroller = require("../controller/classeController");
router.post("/add", classcontroller.addClass);
router.get("/show", classcontroller.showClass);
router.put("/update/:id", classcontroller.updatedClass);
router.delete("/delete/:id", classcontroller.deletedClass);
module.exports = router;
