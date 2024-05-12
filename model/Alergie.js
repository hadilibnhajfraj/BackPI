const mongo = require("mongoose");
const Schema = mongo.Schema;
const Alergie = new Schema({
  allergene: { type: String, required: true },
  id_etudiant: { type: Schema.Types.ObjectId, ref: "etudiant" },
});
module.exports = mongo.model("alergie", Alergie);
