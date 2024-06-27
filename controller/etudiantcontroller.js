
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


async function updated(req, res) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError || err) {
                console.log(err);
                return res.status(500).json({ message: "Erreur lors du téléversement des fichiers." });
            }

            const etudiantId = req.params.id;

            // Trouver l'étudiant existant par son ID
            const existingEtudiant = await Etudiant.findById(etudiantId);
            if (!existingEtudiant) {
                return res.status(404).json({ message: "Étudiant non trouvé." });
            }

            // Supprimer les anciennes images si de nouvelles images sont téléchargées
            if (req.files && req.files.length > 0) {
                // Supprimer les anciennes images du système de fichiers
                if (existingEtudiant.image && existingEtudiant.image.length > 0) {
                    existingEtudiant.image.forEach(img => {
                        if (fs.existsSync(img)) {
                            fs.unlinkSync(img); // Suppression de l'image existante
                        }
                    });
                }

                // Mettre à jour le chemin d'accès des images avec les nouveaux fichiers téléchargés
                existingEtudiant.image = req.files.map(file => file.path);
            }

            // Mettre à jour les autres champs de l'étudiant
            existingEtudiant.nom = req.body.nom;
            existingEtudiant.prenom = req.body.prenom;
            existingEtudiant.date_de_naissance = req.body.date_de_naissance;
            existingEtudiant.adresse = req.body.adresse;
            existingEtudiant.niveau = req.body.niveau;
            existingEtudiant.situation_familiale = req.body.situation_familiale;
            existingEtudiant.id_user = req.body.id_user;
            existingEtudiant.classe = req.body.classe;

            // Enregistrer l'étudiant mis à jour dans la base de données
            await existingEtudiant.save();

            res.status(200).json({ message: "Étudiant mis à jour avec succès", etudiant: existingEtudiant });
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'étudiant:', err);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'étudiant." });
    }
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