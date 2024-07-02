const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    login: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    validatedByAdmin: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true, trim: true },
    activated: { type: Boolean, default: false },
    langKey: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    activationKey: { type: String, trim: true },
    activationDate: { type: Date },
    resetKey: { type: String, trim: true },
    resetDate: { type: Date },
    idtMatag: { type: Number },
    tel: { type: String, trim: true },
    countryCode: { type: String, trim: true },
    resetCode: { type: String }, // Assurez-vous que ce champ est bien défini
    enableOtpMail: { type: Boolean },
    authorities: [{ type: String, enum: ['admin', 'enseignant', 'parent'] }],
    createdBy: String,
    lastModifiedBy: String,
    util: String,   
    dateOp: { type: Date }
}, { timestamps: true });
userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) {
          return reject(err);
        }
        if (!isMatch) {
          return reject(new Error("Invalid password"));
        }
        resolve(true);
      });
    });
  };

module.exports = mongoose.model("User", userSchema);