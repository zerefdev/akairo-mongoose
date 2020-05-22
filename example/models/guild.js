const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  joinedAt: {
    type: Number
  },
  settings: {
    type: Object,
    require: true
  }
});

module.exports = mongoose.model('Guild', guildSchema);
