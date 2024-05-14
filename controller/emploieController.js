const Emploi = require("../model/emploi");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/emplois"); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // File name for uploaded file
    }
});

const upload = multer({ storage: storage }).single("document"); // "document" is the name of the file field in the form, allowing only one file

async function add(req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "An error occurred while uploading files." });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ message: "An error occurred while uploading files." });
            }

            // Create and save the Emploi with the uploaded file path
            const emploi = new Emploi({
                year: req.body.year,
                level: req.body.level,
                classe: req.body.classe,
                teacher: req.body.teacher,
                rooms: req.body.rooms,
                file: req.file.path // Saving the file path
            });

            await emploi.save();
            res.status(200).send("Emploi ajouté avec succès.");
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while adding the emploi.");
    }
}



async function show(req, res, next) {
    try {
        const data = await Emploi.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Emploi.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("zmploie updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Emploi.findByIdAndDelete(req.params.id);
        res.status(200).send("emploie deleted")
    } catch (err) {
        console.log(err)
    }
};



module.exports = { add, show, updated, deleted };