const mongoose = require('mongoose');

const banqueSchema = new mongoose.Schema({
  chequeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cheque', required: true }
});

const Banque = mongoose.model('Banque', banqueSchema);

module.exports = Banque;
