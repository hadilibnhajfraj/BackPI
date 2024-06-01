const express = require("express");
const router = express.Router();
const emploiecontroller = require("../controller/emploieController");
router.post("/add", emploiecontroller.add);
router.get("/show", emploiecontroller.show);
router.put("/update/:id", emploiecontroller.updated);
router.delete("/delete/:id", emploiecontroller.deleted);
router.post('/:emploiId/classes/:classId/seances', emploiecontroller.addSeance);
router.put('/:id/extend/:additionalWeeks', emploiecontroller.extendEmploie);
router.put('/:id', emploiecontroller.showById);
router.put('/classe/:id', emploiecontroller.showByClassId);
router.get('/generate-timetable/:id', emploiecontroller.generateTimetablePDF);
router.get('/generate-timetable/:id/:ide', emploiecontroller.generateTimetableForTeacherPDF);
router.get('/save/:id', emploiecontroller.saveTimetable);

module.exports = router;
