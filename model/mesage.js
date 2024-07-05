const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    id_user_envoie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "envoieModel",
    },
    id_user_receive: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiveModel",
    },
    envoieModel: {
      type: String,
      required: true,
      enum: ["User", "Etudiant"],
    },
    receiveModel: {
      type: String,
      required: true,
      enum: ["User", "Etudiant"],
    },
    message: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    fichier: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
