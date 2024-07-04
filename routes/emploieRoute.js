const express = require("express");
const router = express.Router();
const emploiecontroller = require("../controller/emploieController");
router.post("/add", emploiecontroller.add);
router.get("/show", emploiecontroller.show);
router.put("/update/:id", emploiecontroller.updated);
router.delete("/delete/:id", emploiecontroller.deleted);
router.post('/:emploiId/classes/:classId/seances', emploiecontroller.addSeance);
router.put('/:id/extend/:additionalWeeks', emploiecontroller.extendEmploie);
router.get('/emp/:id', emploiecontroller.showById);
router.get('/classe/:id', emploiecontroller.showByClassId);
router.get('/generate-timetable/:id', emploiecontroller.generateTimetablePDF);
router.get('/generate-timetable/:id/:ide', emploiecontroller.generateTimetableForTeacherPDF);
router.get('/emailetudiant/:id', emploiecontroller.getEmailsOfClassStudents);
router.get('/emailparent/:id', emploiecontroller.getEmailsOfParentsOfClassStudents);
router.get('/idenseignant/:id', emploiecontroller.getTeacherIdsByEmploiId);
router.get('/emailenseignant/:id', emploiecontroller.getEmailsOfTeachersByEmploiId);
router.post('/save/:id', emploiecontroller.generateAndSendGlobalTimetable);
router.get('/getparentemploi/:id',emploiecontroller.emploiByParent)




module.exports = router;
