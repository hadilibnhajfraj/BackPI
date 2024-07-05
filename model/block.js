const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  blocker: {
    type: Schema.Types.ObjectId,
    refPath: 'blockerModel',
    required: true
  },
  blockerModel: {
    type: String,
    required: true,
    enum: ['User', 'Etudiant']
  },
  blocked: {
    type: Schema.Types.ObjectId,
    refPath: 'blockedModel',
    required: true
  },
  blockedModel: {
    type: String,
    required: true,
    enum: ['User', 'Etudiant']
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Block", blockSchema);