const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    id_user_envoie:{type:Schema.Types.ObjectId,ref:'User',required: true},
    id_user_receive:{type:Schema.Types.ObjectId,ref:'User',required: true},
    message: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);