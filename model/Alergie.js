const mongo = require("mongoose");
const Schema = mongo.Schema;
const Alergie = new Schema({
  allergene: { type: String, required: true },
  //id_user: { type: Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongo.model("alergie", Alergie);
