const express = require("express");
const router = express.Router();
const etudiantcontroller = require("../controller/etudiantController copy");
router.post("/add", etudiantcontroller.addEtudiant);
router.get("/show", etudiantcontroller.showEtudiant);
router.put("/update/:id", etudiantcontroller.updateEtudiant);
router.delete("/delete/:id", etudiantcontroller.deleteEtudiant);
router.put("/changeStudentClass/:ids/:idc", etudiantcontroller.changeStudentClass);
router.get("/recherche", etudiantcontroller.recherche);
module.exports = router;
