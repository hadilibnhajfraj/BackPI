const mongo = require("mongoose");
const Schema = mongo.Schema;
const Bus = new Schema({
  itinéraire: { type: String, required: true },
  horaire: { type: String, required: true },
  matricule: { type: String, required: true },
});
module.exports = mongo.model("bus", Bus);
