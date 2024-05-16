// Importer le module nodemailer pour l'envoi d'e-mails
const nodemailer = require("nodemailer");

// Importer le modèle de Notification
const Notification = require("../model/Notification"); // Assurez-vous d'ajuster le chemin selon votre structure de dossiers

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
    const { parentId, message } = req.body; // Récupérer parentId et message depuis le corps de la requête

    // Créer une instance de Notification
    const notification = new Notification({
      parent: parentId,
      message: message,
      statut: "envoyée",
    });

    // Enregistrer la notification dans la base de données
    await notification.save();

    // Envoyer l'e-mail de notification au parent
    const options = {
      from: "t0429597@gmail.com", // Adresse e-mail expéditeur
      to: "hadil.ibnhajfraj@gmail.com", // Adresse e-mail du destinataire (remplacez par l'e-mail du parent)
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
    // Répondre au client avec un statut 500 Internal Server Error et un message d'erreur
    res
      .status(500)
      .json({ erreur: "Erreur lors de l'envoi de la notification" });
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

module.exports = {
  envoyerNotification,
  marquerCommeLue,
};
