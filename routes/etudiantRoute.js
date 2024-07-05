const express = require("express");
const router = express.Router();
const etudiantcontroller = require("../controller/etudiantcontroller");
router.post("/add", etudiantcontroller.addEtudiant);
router.get("/show", etudiantcontroller.showEtudiant);
router.put("/update/:id", etudiantcontroller.updateEtudiant);
router.delete("/delete/:id", etudiantcontroller.deleteEtudiant);
router.put("/changeStudentClass/:ids/:idc", etudiantcontroller.changeStudentClass);
router.get("/recherche", etudiantcontroller.recherche);

router.get('/all', etudiantcontroller.show);

router.post('/add', etudiantcontroller.add);

router.put('/update/:id',etudiantcontroller.updated);

router.delete('/delete/:id', etudiantcontroller.deleted);

router.get('/showById/:id', etudiantcontroller.allbyId);

router.get('/showByName/:name',etudiantcontroller.showByone);

module.exports = router;