const Exercice = require("../model/exercice");
const multer = require("multer");
const fs = require('fs'); // Ajout de l'importation du module fs
const path = require('path'); // Ajout de l'importation du module path

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Dossier où les fichiers téléchargés seront enregistrés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Nom du fichier téléchargé
    }
});

const upload = multer({ storage: storage }).array("documents", 5); // "documents" est le nom du champ de fichier dans le formulaire, et 5 est le nombre maximum de fichiers autorisés

async function add(req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            }

            // Créez un tableau de chemins de fichiers à partir des fichiers téléversés
            const documents = req.files.map(file => file.path);

            // Créez et enregistrez l'exercice avec les documents
            const exercice = new Exercice({
                description: req.body.description,
                dateLimite: req.body.dateLimite,
                typeExercice: req.body.typeExercice,
                cours: req.body.cours,
                id_user: req.body.id_user,
                documents: documents
            });

            await exercice.save();
            res.status(200).json("Exercice ajouté avec succès.");
        });
    } catch (err) {
        console.log(err);
        res.status(500).json("Une erreur s'est produite lors de l'ajout de l'exercice.");
    }
}

async function show(req, res, next) {
    try {
        const data = await Exercice.find();
        res.status(200).json(data)
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

            const exerciceId = req.params.id;

            try {
                // Recherche du cours existant par son ID
                const existingExercice = await Exercice.findById(exerciceId);
                if (!existingExercice) {
                    return res.status(404).send("Exercice non trouvé.");
                }

                // Suppression des documents existants associés au cours
                console.log(`Existing documents to delete: ${existingExercice.documents}`);
                for (const docPath of existingExercice.documents) {
                    try {
                        await fs.promises.unlink(path.join(__dirname, '..', docPath));
                        console.log(`Deleted file: ${docPath}`);
                    } catch (err) {
                        console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
                    }
                }

                // Mapping des nouveaux chemins de fichiers depuis les fichiers téléversés
                const documents = req.files.map(file => file.path);
                console.log(`New documents paths: ${documents}`);

                // Met à jour tous les champs de l'exercice avec les données de la requête
                existingExercice.description = req.body.description;
                existingExercice.dateLimite = req.body.dateLimite;
                existingExercice.typeExercice = req.body.typeExercice;
                existingExercice.cours = req.body.cours;
                existingExercice.id_user = req.body.id_user;
                existingExercice.documents = documents;

                // Enregistre les modifications
                await existingExercice.save();

                res.status(200).json("Exercice mis à jour avec succès.");
            } catch (err) {
                console.log(err);
                res.status(500).json("Une erreur s'est produite lors de la mise à jour de l'exercice.");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json("Une erreur s'est produite lors de la mise à jour de l'exercice.");
    }
}

async function deleted(req, res, next) {
    try {
        const deletedExercice = await Exercice.findByIdAndDelete(req.params.id);

        // Si l'exercice n'est pas trouvé
        if (!deletedExercice) {
            return res.status(404).send("Exercice non trouvé.");
        }

        // Suppression des documents associés à l'exercice
        deletedExercice.documents.forEach(documentPath => {
            fs.unlink(path.join(__dirname, '..', documentPath), err => {
                if (err) {
                    console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
                }
            });
        });

        res.status(200).json("Exercice supprimé avec succès.");
    } catch (err) {
        console.log(err);
        res.status(500).json("Une erreur s'est produite lors de la suppression de l'exercice.");
    }
}

async function allbyId(req, res, next) {
    try {
        const data = await Exercice.findById(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération de l'exercice.");
    }
}

async function showByone(req, res, next) {
    try {
        const data = await Exercice.findOne(req.params);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération de l'exercice.");
    }
}

async function findByCourse(req, res, next) {
    try {
        const courseId = req.params.courseId;
        const exercices = await Exercice.find({ id_cours: courseId });
        res.status(200).json(exercices);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération des exercices par cours.");
    }
}

// Fonction pour trouver tous les exercices dont la date limite est comprise dans une plage de dates spécifiée
async function findByDateRange(req, res, next) {
    try {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        // Recherche les exercices dont la date limite est comprise dans la plage de dates spécifiée
        const exercices = await Exercice.find({ dateLimite: { $gte: startDate, $lte: endDate } });

        res.status(200).json(exercices);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération des exercices par plage de dates.");
    }
}

// Fonction pour trouver tous les exercices d'un type spécifique
async function findByType(req, res, next) {
    try {
        const exerciceType = req.params.type;
        const exercices = await Exercice.find({ typeExercice: exerciceType });
        res.status(200).json(exercices);
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la récupération des exercices par type.");
    }
}


module.exports = { add, show, updated, deleted, allbyId, showByone, findByCourse, findByDateRange, findByType };
