const mongo = require("mongoose");
const Schema = mongo.Schema;
const Inscription = new Schema({
  id_user: { type: Schema.Types.ObjectId, ref: "User" },
  id_activite: { type: Schema.Types.ObjectId, ref: "Activites" },
});
module.exports = mongo.model("inscription", Inscription);
