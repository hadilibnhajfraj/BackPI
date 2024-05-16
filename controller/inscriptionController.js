const Activites = require("../model/Activites");
const Inscription = require("../model/Inscription"); // Correct import

// Function to handle activity registration
async function inscrireActivite(req, res) {
  const { id_user, id_activite } = req.body;

  try {
    // Retrieve the activity
    const activite = await Activites.findById(id_activite);

    if (!activite) {
      return res.status(404).json({ erreur: "Activité non trouvée" });
    }

    // Count the number of registrations for this activity
    const inscriptionCount = await Inscription.countDocuments({ id_activite });

    // Check if the limit has been reached
    if (inscriptionCount >= activite.nblimite) {
      return res
        .status(400)
        .json({ erreur: "Nombre limite d'inscriptions atteint" });
    }

    // Check if the user is already registered for this activity
    const existingInscription = await Inscription.findOne({
      id_user,
      id_activite,
    });

    if (existingInscription) {
      return res
        .status(400)
        .json({ erreur: "Utilisateur déjà inscrit à cette activité" });
    }

    // Create a new registration
    const nouvelleInscription = new Inscription({ id_user, id_activite });
    await nouvelleInscription.save();

    res.status(201).json({
      message: "Inscription réussie",
      inscription: nouvelleInscription,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
}

module.exports = { inscrireActivite };
