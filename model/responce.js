const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    reclamation: {
        type: Schema.Types.ObjectId,
        ref: 'Reclamation',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Response", responseSchema);
