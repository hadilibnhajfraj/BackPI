const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

// Route pour envoyer une notification
router.post('/envoyerNotification', notificationController.envoyerNotification);

// Route pour marquer une notification comme lue
router.post('/marquerCommeLue/:notificationId', notificationController.marquerCommeLue);
router.post('/weather', notificationController.envoyerWeatherUpdate);
router.get("/compternotificationsenvoyees", notificationController.compterNotificationsEnvoyees);
router.get("/touteslesnotifications", notificationController.getAllNotifications);
module.exports = router;
