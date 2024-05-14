const express = require("express");
const router = express.Router();
const matierecontroller = require("../controller/matiereController");
router.post("/add", matierecontroller.add);
router.get("/show", matierecontroller.show);
router.put("/update/:id", matierecontroller.update);
router.delete("/delete/:id", matierecontroller.deleted);
module.exports = router;
