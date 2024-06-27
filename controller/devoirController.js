// Import required modules
const Devoir = require("../model/devoir");
const multer = require("multer");
const fs = require('fs');
const path = require('path');



// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Name of the uploaded file
    }
});

// Configure multer upload
const upload = multer({ storage: storage }).array("documents", 5); // "documents" is the name of the file field in the form, and 5 is the maximum number of files allowed

// Add devoir with documents
async function add(req, res, next) {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        try {
            const documents = req.files.map(file => file.path); // Get file paths
            const devoir = new Devoir({
                ...req.body,
                documents: documents,
                createdAt: new Date()

            });
            await devoir.save();
          
            res.status(200).json("Devoir added");
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}

// Show all devoirs
async function show(req, res, next) {
    try {
        const data = await Devoir.find();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}





async function updated(req, res) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError || err) {
                console.log(err);
                return res.status(500).json({ message: "Erreur lors du téléversement des fichiers." });
            }

            const devoirId = req.params.id;

            // Trouver le devoir existant par son ID
            const existingDevoir = await Devoir.findById(devoirId);
            if (!existingDevoir) {
                return res.status(404).json({ message: "Devoir non trouvé." });
            }

            // Supprimer les anciens documents si de nouveaux documents sont téléchargés
            if (req.files && req.files.length > 0) {
                // Supprimer les anciens documents du système de fichiers
                if (existingDevoir.documents && existingDevoir.documents.length > 0) {
                    existingDevoir.documents.forEach(doc => {
                        if (fs.existsSync(doc)) {
                            fs.unlinkSync(doc); // Suppression du document existant
                        }
                    });
                }

                // Mettre à jour les chemins d'accès des documents avec les nouveaux fichiers téléchargés
                existingDevoir.documents = req.files.map(file => file.path);
            }

            // Mettre à jour les autres champs du devoir
            existingDevoir.nom = req.body.nom;
            existingDevoir.id_user = req.body.id_user;
            existingDevoir.classe = req.body.classe;
            existingDevoir.etudiant = req.body.etudiant;
            existingDevoir.matiere = req.body.matiere;

            // Enregistrer le devoir mis à jour dans la base de données
            await existingDevoir.save();

            res.status(200).json({ message: "Devoir mis à jour avec succès", devoir: existingDevoir });
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du devoir:', err);
        res.status(500).json({ message: "Erreur lors de la mise à jour du devoir." });
    }
}

// Delete devoir
async function deleted(req, res, next) {
    try {
        const deletedDevoir = await Devoir.findByIdAndDelete(req.params.id);

        if (!deletedDevoir) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        deletedDevoir.documents.forEach(documentPath => {
            fs.unlink(path.join(__dirname, '..', documentPath), err => {
                if (err) console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
            });
        });

        res.status(200).json({ message: "Devoir supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de la suppression du devoir." });
    }
}

// Get devoir by ID
async function allbyId(req, res, next) {
    try {
        const data = await Devoir.findById(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

// Get devoir by one parameter
async function showByone(req, res, next) {
    try {
        const data = await Devoir.findOne(req.params);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { add, show, updated, deleted, allbyId, showByone };
