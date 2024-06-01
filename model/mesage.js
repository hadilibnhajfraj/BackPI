const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    id_user_envoie: {
        type: Schema.Types.ObjectId,
        refPath: 'envoieModel',
        required: true
    },
    envoieModel: {
        type: String,
        required: true,
        enum: ['User', 'Etudiant']
    },
    id_user_receive: {
        type: Schema.Types.ObjectId,
        refPath: 'receiveModel',
        required: true
    },
    receiveModel: {
        type: String,
        required: true,
        enum: ['User', 'Etudiant']
    },
    message: String,
    image: {
        type: String,
        default: null
    },
    fichier: {
        type: String,
        default: null
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    etat: { 
        type: String, 
        enum: ['lu', 'non lu'], // Options autorisées pour l'état
        default: 'non lu' // Valeur par défaut pour l'état
    },
});

module.exports = mongoose.model("Message", messageSchema);
