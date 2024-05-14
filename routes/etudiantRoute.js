const express = require("express");
const router = express.Router();
const etudiantcontroller = require("../controller/etudiantController");
router.post("/add", etudiantcontroller.add);
router.get("/show", etudiantcontroller.show);
router.put("/update/:id", etudiantcontroller.update);
router.delete("/delete/:id", etudiantcontroller.deleteetudiant);
module.exports = router;
