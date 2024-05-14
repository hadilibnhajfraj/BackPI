const Cours = require ("../model/cours");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/cours"); // Destination directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        console.log("File originalname:", file.originalname); // Log the original file name
        cb(null, Date.now() + "-" + file.originalname); // File name of the uploaded file
    }
});

const upload = multer({ storage: storage }).array("documents", 5); // "documents" is the name of the file field in the form, and 5 is the maximum number of files allowed

async function add(req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.log("Multer error:", err); // Log multer error
                return res.status(500).json({ message: "Une erreur s'est produite lors du téléversement des fichiers." });
            }

            // Check if req.files is defined
            if (!req.files) {
                return res.status(400).json({ message: "Aucun fichier n'a été téléversé." });
            }

            // Log the uploaded file paths
            console.log("Uploaded files:", req.files.map(file => file.path));

            // Create an array of file paths from the uploaded files
            const documents = req.files.map(file => file.path);

            // Create and save the course with the documents
            const cours = new Cours({
                nom: req.body.nom,
                horaire: req.body.horaire,
                descriptionContenu: req.body.descriptionContenu,
                planCours: req.body.planCours,
                id_enseignant: req.body.id_enseignant,
                id_classe: req.body.id_classe,
                id_matiere: req.body.id_matiere,
                documents: documents
            });

            await cours.save();
            res.status(200).send("Cours ajouté avec succès.");
        });
    } catch (err) {
        console.log("Internal error:", err); // Log internal server error
        res.status(500).send("Une erreur s'est produite lors de l'ajout du cours.");
    }
}




async function show(req, res, next) {
    try {
        const data = await Cours.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Cours.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("Cours updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Cours.findByIdAndDelete(req.params.id);
        res.status(200).send("Cours deleted")
    } catch (err) {
        console.log(err)
    }
};



module.exports = { add, show, updated, deleted };