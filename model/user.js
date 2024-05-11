const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'enseignant', 'parent'], default: 'admin' }
});

module.exports = mongoose.model("user", User);
