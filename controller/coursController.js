const Cours = require("../model/cours");
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

const upload = multer({ storage: storage }).array("documents", 5);

async function add(req, res, next) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError || err) {
            console.log(err);
            return res.status(500).json({ message: "Erreur lors du téléversement des fichiers." });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Aucun fichier téléchargé." });
        }

        const documents = req.files.map(file => file.path);

        const cours = new Cours({
            nom: req.body.nom,
            horaire: req.body.horaire,
            descriptionContenu: req.body.descriptionContenu,
            planCours: req.body.planCours,
            id_user: req.body.id_user,
            classe: req.body.classe,
            matiere: req.body.matiere,
            documents: documents
        });

        try {
            await cours.save();
            res.status(200).json({ message: "Cours ajouté avec succès." });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de l'ajout du cours." });
        }
    });
}

async function show(req, res, next) {
    try {
        const data = await Cours.find();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des cours.");
    }
}

async function updated(req, res, next) {
    // Utilisation de multer pour gérer le téléversement de fichiers
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError || err) {
            console.log(err);
            return res.status(500).json({ message: "Erreur lors du téléversement des fichiers." });
        }

        const coursId = req.params.id;
        console.log(`Updating cours with ID: ${coursId}`);

        try {
            // Recherche du cours existant par son ID
            const existingCours = await Cours.findById(coursId);
            if (!existingCours) {
                console.log(`Cours with ID ${coursId} not found.`);
                return res.status(404).json({ message: "Cours non trouvé." });
            }

            // Suppression des documents existants associés au cours
            console.log(`Existing documents to delete: ${existingCours.documents}`);
            existingCours.documents.forEach(docPath => {
                fs.unlink(path.join(__dirname, '..', docPath), err => {
                    if (err) console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
                    else console.log(`Deleted file: ${docPath}`);
                });
            });

            // Mapping des nouveaux chemins de fichiers depuis les fichiers téléversés
            const documents = req.files.map(file => file.path);
            console.log(`New documents paths: ${documents}`);

            // Mise à jour des champs du cours avec les nouvelles valeurs
            existingCours.nom = req.body.nom;
            existingCours.horaire = req.body.horaire;
            existingCours.descriptionContenu = req.body.descriptionContenu;
            existingCours.planCours = req.body.planCours;
            existingCours.id_user = req.body.id_user;
            existingCours.classe = req.body.classe; // Assurez-vous que votre modèle Cours a les champs 'classe' et 'matiere'
            existingCours.matiere = req.body.matiere;
            existingCours.documents = documents;
            console.log(`Updated cours data: ${JSON.stringify(existingCours)}`);

            // Sauvegarde du cours mis à jour dans la base de données
            await existingCours.save();

            // Réponse réussie avec le cours mis à jour
            res.status(200).json({ message: "Cours mis à jour avec succès.", cours: existingCours });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de la mise à jour du cours." });
        }
    });
}


async function deleted(req, res, next) {
    try {
        const deletedCours = await Cours.findByIdAndDelete(req.params.id);

        if (!deletedCours) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        deletedCours.documents.forEach(documentPath => {
            fs.unlink(path.join(__dirname, '..', documentPath), err => {
                if (err) console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
            });
        });

        res.status(200).json({ message: "Cours supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de la suppression du cours." });
    }
}

async function allbyId(req, res, next) {
    try {
        const data = await Cours.findById(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération du cours.");
    }
}

async function showByone(req, res, next) {
    try {
        const data = await Cours.findOne(req.params);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération du cours.");
    }
}

async function downloadDocument(req, res, next) {
    try {
        const coursId = req.params.id;
        const documentIndex = req.params.docIndex;

        const cours = await Cours.findById(coursId);
        if (!cours || !cours.documents[documentIndex]) {
            return res.status(404).send("Document non trouvé.");
        }

        const documentPath = cours.documents[documentIndex];
        res.download(documentPath, path.basename(documentPath), err => {
            if (err) {
                console.log(err);
                res.status(500).send("Erreur lors du téléchargement du document.");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors du téléchargement du document.");
    }
}

async function search(req, res, next) {
    try {
        const criteria = {};

        if (req.query.nom) {
            criteria.nom = { $regex: req.query.nom, $options: 'i' };
        }
        if (req.query.id_classe) {
            criteria.id_classe = req.query.id_classe;
        }
        if (req.query.id_matiere) {
            criteria.id_matiere = req.query.id_matiere;
        }
        if (req.query.id_user) {
            criteria.id_user = req.query.id_user;
        }

        const data = await Cours.find(criteria);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la recherche des cours.");
    }
}

module.exports = { add, show, updated, deleted, allbyId, showByone, downloadDocument, search };
