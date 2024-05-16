const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  statut: {
    type: String,
    enum: ["envoyée", "non envoyée", "lue"],
    default: "non envoyée",
  },
  date: { type: Date, default: Date.now },
  type: { type: String },
  lien: { type: String },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
