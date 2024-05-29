const Observation = require ("../model/observation");

async function add(req, res, next) {
    try {
        const observation = new Observation(req.body);
        await observation.save();
        res.status(200).json("Observation added");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding observation");
    }
}

async function show(req, res, next) {
    try {
        const data = await Observation.find();
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
    }
}

async function updated(req, res, next) {
    try {
        await Observation.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json("Observation updated")
    } catch (err) {
        console.log(err)
    }
};

async function deleted(req, res, next) {
    try {
        await Observation.findByIdAndDelete(req.params.id);
        res.status(200).json("Observation deleted")
    } catch (err) {
        console.log(err)
    }
};

async function allbyId(req, res, next) {
    try {
        const data = await Observation.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};


async function showByone(req, res, next) {
    try {
        const data = await Observation.findOne(req.params);
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
};

async function getByMealType(req, res, next) {
    try {
        const { mealType } = req.params;
        const data = await Observation.find({ repas: mealType });
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}


async function getByMood(req, res, next) {
    try {
        const { mood } = req.params;
        const data = await Observation.find({ humeur: mood });
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}


async function getByHealthStatus(req, res, next) {
    try {
        const { healthStatus } = req.params;
        const data = await Observation.find({ sante: healthStatus });
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { add, show, updated, deleted, allbyId, showByone, getByMealType, getByMood, getByHealthStatus };