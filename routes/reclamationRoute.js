const express = require("express");
const router = express.Router();
const reclamationController = require("../controller/reclamationController");
router.post('/add', reclamationController.add);
router.get('/showall', reclamationController.show);
router.put('/update/:id', reclamationController.update);
router.delete('/delete/:id', reclamationController.deletreclamation);
router.get('/lire/:id', reclamationController.getReclamationAndMarkAsRead);
router.get('/find/:id', reclamationController.findOne);
router.get('/notification', reclamationController.genererNotificationReclamation);



module.exports = router;