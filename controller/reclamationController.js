const REclamation = require("../model/reclamation");
const Response = require('../model/responce');

async function add(req, res, next) {
    try {
        const reclamation = new REclamation(req.body);
        await reclamation.save();
        res.status(200).send("reclation added successfully");
    } catch (err) {
        console.error(err);
    }
}
async function show(req, res, next) {
    try {
        const data = await REclamation.find();
        res.json(data);
    } catch (err) {
        console.log(err);
    }
}
async function update(req, res, next) {
    try {
        const data = await REclamation.findByIdAndUpdate(req.params.id, req.body).populate('user', 'firstName lastName');
        res.send("updated");
    } catch (err) {  console.log(err); }
}
async function deletreclamation(req, res, next) {
    try {
        const data = await REclamation.findByIdAndDelete(req.params.id, req.body);
        res.send("removed");
    }
    catch (err) { console.log(err); }
}


// Function to get a reclamation by ID and update its status to "lu"
async function getReclamationAndMarkAsRead(req, res, next) {
    try {
        // Extract the reclamation ID from the request parameters
        const { id } = req.params;

        // Find the reclamation by ID and update its status to "lu"
        const reclamation = await REclamation.findByIdAndUpdate(id, { etat: 'lu' }, { new: true });

        // If reclamation is not found, return a 404 response
        if (!reclamation) {
            return res.status(404).json({ error: 'Reclamation not found.' });
        }

        // If reclamation is found, return it along with the updated status
        res.status(200).json(reclamation);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the reclamation.');
    }
}

async function findOne(req, res, next) {
    try {
        // Find the reclamation by ID
        const reclamation = await REclamation.findById(req.params.id);

        // If reclamation is not found, return a 404 response
        if (!reclamation) {
            return res.status(404).json({ error: 'Reclamation not found.' });
        }

        // Populate the responses field to get the response documents
        await reclamation.populate('responses');

        // Extract response bodies from the populated responses
        const responseBodies = reclamation.responses.map(response => response.body);

        // Replace response IDs with response bodies in the responses field
        const updatedReclamation = {
            ...reclamation.toObject(),
            responses: responseBodies
        };

        // Return the updated reclamation
        res.status(200).json(updatedReclamation);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the reclamation.');
    }
};

async function genererNotificationReclamation(req, res) {
    try {
        // Rechercher toutes les réclamations non lues
        const unreadReclamations = await REclamation.find({
            etat: 'non lu' // Vérifier l'état de la réclamation
        }).populate('user'); // Populer le champ 'user' pour obtenir les détails de l'utilisateur

        // Si des réclamations non lues sont trouvées, générer un message de notification
        if (unreadReclamations.length > 0) {
            const notifications = unreadReclamations.map(reclamation => {
                return {
                    user: reclamation.user.firstName + ' ' + reclamation.user.lastName,
                    body: reclamation.body
                };
            });

            res.status(200).json({ notifications, notification: `Vous avez ${unreadReclamations.length} nouveaux reclamation(s).` }); // Envoyer la notification dans la réponse
        } else {
            res.status(200).json({ notification: "Aucune nouvelle réclamation non lue." }); // Si aucune réclamation non lue n'est trouvée
        }
    } catch (error) {
        console.error("Erreur lors de la génération de la notification de réclamation:", error);
        res.status(500).json({ error: 'Erreur lors de la génération de la notification de réclamation.' }); // En cas d'erreur
    }
}




module.exports = {
    add,
    show,
    update,
    deletreclamation,
    getReclamationAndMarkAsRead,
    findOne,
    genererNotificationReclamation
}