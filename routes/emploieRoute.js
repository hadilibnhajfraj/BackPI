const express = require("express");
const router = express.Router();
const emploiecontroller = require("../controller/emploieController");
router.post("/add", emploiecontroller.add);
router.get("/show", emploiecontroller.show);
router.put("/update/:id", emploiecontroller.updated);
router.delete("/delete/:id", emploiecontroller.deleted);
module.exports = router;
