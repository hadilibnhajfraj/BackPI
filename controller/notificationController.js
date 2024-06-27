// Importer le module nodemailer pour l'envoi d'e-mails
const nodemailer = require("nodemailer");
const axios = require('axios');
// Importer le modèle de Notification
const Notification = require("../model/Notification"); // Assurez-vous d'ajuster le chemin selon votre structure de dossiers
const User = require("../model/User");
async function getWeather() {
  const apiKey = '465e5eedb508a1b6073d12f51f59adb4'; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=tunis&appid=465e5eedb508a1b6073d12f51f59adb4&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
async function envoyerWeatherUpdate(req, res) {
  try {
    const weatherData = await getWeather();

    const weatherMessage = `Weather Update for Tunis:
    Temperature: ${weatherData.main.temp}°C
    Weather: ${weatherData.weather[0].description}`;

    const options = {
      from: 't0429597@gmail.com',
      to: 'hadil.ibnhajfraj@gmail.com', // Replace with the administrator's email
      subject: 'Real-time Weather Update',
      text: weatherMessage,
    };

    await transporter.sendMail(options);

    console.log('Weather update sent successfully.');
    res.status(200).json({ message: 'Weather update sent successfully' });
  } catch (error) {
    console.error('Error sending weather update:', error);
    res.status(500).json({ error: 'Error sending weather update' });
  }
}
// Créer un transporteur SMTP pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "t0429597@gmail.com",
    pass: "frrz sozl ivqu fudj",
  },
  secure: true, // Utilisez le port sécurisé
  port: 587, // Port sécurisé pour Gmail
});

// Définir la méthode envoyerNotification
async function envoyerNotification(req, res) {
  try {
    const { emailParent, message } = req.body;

    // Rechercher l'utilisateur parent dans la base de données par email
    const parent = await User.findOne({ email: emailParent, authorities: 'parent' });

    if (!parent) {
      return res.status(404).json({ erreur: "Parent non trouvé ou n'est pas un parent" });
    }

    // Créer une instance de Notification
    const notification = new Notification({
      parent: parent._id,
      message: message,
      statut: "envoyée",
    });

    // Enregistrer la notification dans la base de données
    await notification.save();

    // Envoyer l'e-mail de notification au parent trouvé
    const options = {
      from: "t0429597@gmail.com",
      to: emailParent, // Utilisation de l'e-mail fourni dans la requête
      subject: "Notification de l'école",
      text: message,
    };

    // Envoyer l'e-mail
    await transporter.sendMail(options);

    console.log("Notification envoyée avec succès.");

    // Répondre au client avec un statut 200 OK
    res.status(200).json({ message: "Notification envoyée avec succès" });
  } catch (erreur) {
    console.error("Erreur lors de l'envoi de la notification :", erreur);
    res.status(500).json({ erreur: "Erreur lors de l'envoi de la notification" });
  }
}
async function marquerCommeLue(req, res) {
  try {
    const notificationId = req.params.notificationId; // Récupérer l'identifiant de la notification depuis les paramètres d'URL

    // Mettre à jour le statut de la notification dans la base de données
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { statut: "lue" },
      { new: true }
    );

    if (!notification) {
      // Si aucune notification avec cet ID n'est trouvée
      return res.status(404).json({ erreur: "Notification introuvable" });
    }

    console.log("Notification marquée comme lue :", notification);
    res.status(200).json(notification); // Répondre avec la notification mise à jour
  } catch (erreur) {
    console.error(
      "Erreur lors du marquage de la notification comme lue :",
      erreur
    );
    res
      .status(500)
      .json({ erreur: "Erreur lors du marquage de la notification comme lue" });
  }
}
async function compterNotificationsEnvoyees(req, res) {
  try {
    const { emailParent } = req.query;

    // Trouver le parent avec l'email fourni
    const parent = await User.findOne({ email: emailParent, authorities: 'parent' });

    if (!parent) {
      return res.status(404).json({ erreur: "Parent non trouvé ou n'est pas un parent" });
    }

    // Compter les notifications envoyées pour ce parent
    const count = await Notification.countDocuments({ parent: parent._id, statut: "envoyée" });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Erreur lors du comptage des notifications envoyées :", error);
    res.status(500).json({ erreur: "Erreur lors du comptage des notifications envoyées" });
  }
}
async function getAllNotifications(req, res) {
  try {
    const { emailParent } = req.query;

    // Trouver le parent avec l'email fourni
    const parent = await User.findOne({ email: emailParent, authorities: 'parent' });

    if (!parent) {
      return res.status(404).json({ erreur: "Parent non trouvé ou n'est pas un parent" });
    }

    // Récupérer toutes les notifications pour ce parent
    const notifications = await Notification.find({ parent: parent._id }).populate('parent');
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ erreur: "Erreur lors de la récupération des notifications" });
  }
}

module.exports = {
  envoyerNotification,
  marquerCommeLue,
  getWeather,
  envoyerWeatherUpdate,
  compterNotificationsEnvoyees,
  getAllNotifications
};
