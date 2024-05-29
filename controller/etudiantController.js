
const Etudiant = require("../model/etudiant");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage }).array("image", 5);

async function add(req, res) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError || err) {
                console.log(err);
                return res.status(500).json({ message: "Erreur lors du téléversement des fichiers." });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "Aucun fichier téléchargé." });
            }

            const image = req.files.map(file => file.path);

            // Récupérer les données de la requête et assigner correctement classe.nom et classe._id
            const etudiantData = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                date_de_naissance: req.body.date_de_naissance,
                adresse: req.body.adresse,
                niveau: req.body.niveau,
                situation_familiale: req.body.situation_familiale,
                id_user: req.body.id_user,
                image: image,
                classe: req.body.classe,

            };

            const etudiant = new Etudiant(etudiantData);
            await etudiant.save();
            res.status(200).json({ message: "Étudiant ajouté avec succès" });
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'étudiant:', err);
        res.status(500).json({ message: "Erreur lors de l'ajout de l'étudiant." });
    }
}




async function show(req, res, next) {
    try {
        const data = await Etudiant.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}


async function updated(req, res, next) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError || err) {
            console.log(err);
            return res.status(500).json({ message: "Error uploading files." });
        }

        const etudiantId = req.params.id;
        console.log(`Updating etudiant with ID: ${etudiantId}`);

        try {
            // Find the existing etudiant by its ID
            const existingEtudiant = await Etudiant.findById(etudiantId);
            if (!existingEtudiant) {
                console.log(`Etudiant with ID ${etudiantId} not found.`);
                return res.status(404).json({ message: "Etudiant not found." });
            }

            // Delete existing images associated with the etudiant
            console.log(`Existing images to delete: ${existingEtudiant.image}`);
            existingEtudiant.image.forEach(docPath => {
                fs.unlink(path.join(__dirname, '..', docPath), err => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    } else {
                        console.log(`Deleted file: ${docPath}`);
                    }
                });
            });

            // Map new file paths from uploaded files
            const image = req.files.map(file => file.path);
            console.log(`New image paths: ${image}`);

            // Update etudiant fields with new values
            existingEtudiant.nom = req.body.nom;
            existingEtudiant.prenom = req.body.prenom;
            existingEtudiant.date_de_naissance = req.body.date_de_naissance;
            existingEtudiant.adresse = req.body.adresse;
            existingEtudiant.id_user = req.body.id_user;
            existingEtudiant.classe = req.body.classe; // Make sure your Etudiant model has 'classe' and 'matiere' fields
            existingEtudiant.niveau = req.body.niveau;
            existingEtudiant.image = image;
            existingEtudiant.situation_familiale = req.body.situation_familiale;

            console.log(`Updated etudiant data: ${JSON.stringify(existingEtudiant)}`);

            // Save the updated etudiant to the database
            await existingEtudiant.save();

            // Successful response with the updated etudiant
            res.status(200).json({ message: "Etudiant updated successfully.", etudiant: existingEtudiant });
        } catch (err) {
            console.log(err); // Log the specific error for debugging purposes
            res.status(500).json({ message: "Error updating etudiant." });
        }
    });
}


async function deleted(req, res, next) {
    try {
        await Etudiant.findByIdAndDelete(req.params.id);
        res.status(200).json("Etudiant deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Etudiant.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Etudiant.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };