const express = require("express");
const router = express.Router();
const classcontroller = require("../controller/classeController");
router.post("/add", classcontroller.add);
router.get("/show", classcontroller.show);
router.put("/update/:id", classcontroller.update);
router.delete("/delete/:id", classcontroller.deleteclass);
module.exports = router;
