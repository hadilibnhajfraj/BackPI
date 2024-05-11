const Exercice = require ("../model/exercice");

const multer = require("multer");

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

            // Créez et enregistrez le cours avec les documents
            const exercice = new Exercice({
                description: req.body.description,
                dateLimite: req.body.dateLimite,
                typeExercice: req.body.typeExercice,
                id_cours: req.body.id_cours,
                id_enseignant: req.body.id_enseignant,
                id_classe: req.body.id_classe,
                documents: documents
            });

            await exercice.save();
            res.status(200).send("Cours ajouté avec succès.");
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de l'ajout du cours.");
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
        await Exercice.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Exercice updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Exercice.findByIdAndDelete(req.params.id);
        res.status(200).send("Exercice deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Exercice.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Exercice.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


module.exports = { add, show, updated, deleted, allbyId, showByone };