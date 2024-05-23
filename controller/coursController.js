const Cours = require("../model/cours");
const multer = require("multer");
const fs = require('fs'); // Importation du module fs
const path = require('path'); // Importation du module path

// Configurez le stockage des fichiers téléchargés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Dossier où les fichiers téléchargés seront enregistrés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Nom du fichier téléchargé
    }
});

const upload = multer({ storage: storage }).array("documents", 5); // Gestion du téléchargement de plusieurs fichiers

async function add(req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            }

            // Vérifiez si des fichiers ont été téléchargés
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "Aucun fichier téléchargé." });
            }

            // Récupérez les chemins des fichiers téléversés
            const documents = req.files.map(file => file.path);

            // Créez un nouveau cours avec les données du formulaire et les chemins des documents
            const cours = new Cours({
                nom: req.body.nom,
                horaire: req.body.horaire,
                descriptionContenu: req.body.descriptionContenu,
                planCours: req.body.planCours,
                id_user: req.body.id_user,
                id_classe: req.body.id_classe,
                id_matiere: req.body.id_matiere,
                documents: documents
            });

            // Enregistrez le cours dans la base de données
            await cours.save();

            // Retournez une réponse JSON indiquant que le cours a été ajouté avec succès
            res.status(200).json({ message: "Cours ajouté avec succès." });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du cours." });
    }
}

async function show(req, res, next) {
    try {
        const data = await Cours.find();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            }

            const coursId = req.params.id;

            // Vérifie d'abord si le cours existe
            const existingCours = await Cours.findById(coursId);
            if (!existingCours) {
                return res.status(404).json({ message: "Cours non trouvé." });
            }

            // Supprime les anciens documents
            existingCours.documents.forEach(docPath => {
                fs.unlink(path.join(__dirname, '..', docPath), err => {
                    if (err) {
                        console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
                    }
                });
            });

            // Créez un tableau de chemins de fichiers à partir des nouveaux fichiers téléchargés
            const documents = req.files.map(file => file.path);

            // Met à jour tous les champs du cours avec les données de la requête
            existingCours.nom = req.body.nom;
            existingCours.horaire = req.body.horaire;
            existingCours.descriptionContenu = req.body.descriptionContenu;
            existingCours.planCours = req.body.planCours;
            existingCours.id_user = req.body.id_user;
            existingCours.id_classe = req.body.id_classe;
            existingCours.id_matiere = req.body.id_matiere;
            existingCours.documents = documents;

            // Enregistre les modifications
            await existingCours.save();

            res.status(200).json({
                message: "Cours mis à jour avec succès.",
                cours: existingCours
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du cours." });
    }
}


async function deleted(req, res, next) {
    try {
        const deletedCours = await Cours.findByIdAndDelete(req.params.id);

        if (!deletedCours) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        deletedCours.documents.forEach(documentPath => {
            fs.unlink(path.join(__dirname, '..', documentPath), err => {
                if (err) {
                    console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
                }
            });
        });

        res.status(200).json({ message: "Cours supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du cours." });
    }
}

async function allbyId(req, res, next) {
    try {
        const data = await Cours.findById(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération du cours.");
    }
}

async function showByone(req, res, next) {
    try {
        const data = await Cours.findOne(req.params);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération du cours.");
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
                res.status(500).send("Une erreur s'est produite lors du téléchargement du document.");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors du téléchargement du document.");
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
        res.status(500).send("Une erreur s'est produite lors de la recherche des cours.");
    }
}


module.exports = { add, show, updated, deleted, allbyId, showByone, downloadDocument, search };
