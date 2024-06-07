const Reclamation = require('../model/reclamation');
const Response = require('../model/responce');
const nodemailer = require('nodemailer');
const User = require("../model/user"); 

// Configurez le transporteur SMTP pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "t0429597@gmail.com",
      pass: "frrz sozl ivqu fudj",
    },
    secure: true, // Utilisez le port sécurisé
    port: 587, // Port sécurisé pour Gmail
  });
  

// Fonction pour envoyer un e-mail
async function sendEmail(receiverEmail, subject, text) {
    try {
        await transporter.sendMail({
            from: 't0429597@gmail.com',
            to: receiverEmail,
            subject: subject,
            text: text
        });
        console.log('E-mail envoyé avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    }
}

async function add(req, res, next) {
    try {
        const { reclamation, sender, body } = req.body;

        // Vérifiez que les champs nécessaires sont présents
        if (!reclamation || !sender || !body) {
            return res.status(400).json({ error: 'All fields are required: reclamationId, sender, body' });
        }

        // Créer une nouvelle réponse
        const newResponse = new Response({
            reclamation: reclamation,
            sender: sender,
            body
        });

        const savedResponse = await newResponse.save();

        // Mettre à jour la réclamation avec le nouvel état et ajouter la réponse
        const updatedReclamation = await Reclamation.findByIdAndUpdate(
            reclamation,
            {
                $push: { responses: savedResponse._id },
                etat: 'traité'
            },
            { new: true }
        ).populate('responses');

        if (!updatedReclamation) {
            return res.status(404).json({ error: 'Reclamation not found.' });
        }

         // Récupérer l'utilisateur qui a créé la réclamation
         const userWhoCreatedReclamation = await User.findById(updatedReclamation.user);

         // Si le sender de la réponse est différent de l'utilisateur qui a créé la réclamation, envoyer un e-mail
         if (sender !== userWhoCreatedReclamation.email) {
             const emailSubject = 'Réponse à votre réclamation';
             const emailText = 'Une réponse a été apportée à votre réclamation. Consultez votre tableau de bord pour plus de détails.';
             console.log("yyyy" + userWhoCreatedReclamation.email);
             await sendEmail(userWhoCreatedReclamation.email, emailSubject, emailText);
         }
 
         res.status(200).send("Response added and reclamation updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while adding the response");
    }
}

async function show(req, res, next) {
    try {
        const data = await Response.find();
        res.json(data);
    } catch (err) {
        console.log(err);
    }
}
async function update(req, res, next) {
    try {
        const data = await Response.findByIdAndUpdate(req.params.id, req.body);
        res.send("updated");
    } catch (err) {  console.log(err); }
}
async function deleteResponce(req, res, next) {
    try {
        const data = await Response.findByIdAndDelete(req.params.id);
        res.send("removed");
    }
    catch (err) { console.log(err); }
}

async function getAllResponsesForReclamation(req, res, next) {
    try {
        const { reclamationId } = req.params;

        // Find the reclamation and populate the responses
        const reclamation = await Reclamation.findById(reclamationId).populate('responses');

        if (!reclamation) {
            return res.status(404).json({ error: 'Reclamation not found.' });
        }

        res.status(200).json(reclamation.responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving responses");
    }
}

module.exports = {
    add,
    show,
    update,
    deleteResponce,
    getAllResponsesForReclamation
}