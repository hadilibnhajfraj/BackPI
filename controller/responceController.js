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

        // Vérifiez l'existence du sender
        const isValidSender = await User.exists({ _id: sender });
        if (!isValidSender) {
            return res.status(400).json({ error: 'Invalid sender' });
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
                $set: { etat: 'traite' }
            },
            { new: true }
        ).populate('responses');

        if (!updatedReclamation) {
            return res.status(404).json({ error: 'Reclamation not found.' });
        }

        // Récupérer l'utilisateur qui a créé la réclamation
        const userWhoCreatedReclamation = await User.findById(updatedReclamation.user);

        // Si le sender de la réponse est différent de l'utilisateur qui a créé la réclamation, envoyer un e-mail
        if (sender.toString() !== userWhoCreatedReclamation._id.toString()) {
            const emailSubject = 'Réponse à votre réclamation';
            const emailText = 'Une réponse a été apportée à votre réclamation. Consultez votre tableau de bord pour plus de détails.';
            console.log("yyyy" + userWhoCreatedReclamation.email);
            await sendEmail(userWhoCreatedReclamation.email, emailSubject, emailText);
        }

        res.status(200).json({ message: "Response added and reclamation updated successfully" });

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
      const currentDate = new Date(); // Récupère la date actuelle
      req.body.date = currentDate; // Met à jour la date dans req.body
  
      const updatedResponse = await Response.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!updatedResponse) {
        return res.status(404).json({ error: 'Response not found' });
      }
  
      res.status(200).json({ message: 'Response updated successfully', updatedResponse });
    } catch (err) {
      console.error('Error updating response', err);
      res.status(500).json({ error: 'Unable to update response' });
    }
  }
async function deleteResponce(req, res, next) {
    try {
        const data = await Response.findByIdAndDelete(req.params.id);
        res.send({ message:"removed"});
    }
    catch (err) { console.log(err); }
}

async function getAllResponsesForReclamation(req, res, next) {
    try {
        const { reclamationId } = req.params;

        // Find the reclamation and populate the responses and their senders' details
        const reclamation = await Reclamation.findById(reclamationId)
            .populate({
                path: 'responses',
                populate: {
                    path: 'sender',
                    select: 'firstName lastName'
                }
            });

        if (!reclamation) {
            return res.status(404).json({ error: 'Reclamation not found.' });
        }

        res.status(200).json(reclamation.responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving responses");
    }
}



async function getResponce(req, res, next) {
    try {
        const bus = await Response.findById(req.params.id)
            
        if (!bus) {
            return res.status(404).json("reclamation not found");
        }
        res.json(bus);
    } catch (err) {
        console.log(err);
        res.status(500).json("Error fetching chauffeur");
    }
}
module.exports = {
    add,
    show,
    update,
    deleteResponce,
    getAllResponsesForReclamation,
    getResponce
}