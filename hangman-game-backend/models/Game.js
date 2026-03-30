const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: String,
  category: {
    type: String,
    enum: ['computer-fundamentals', 'lifestyle'],
    required: true
  },
  word: String,
  result: {
    type: String,
    enum: ['win', 'loss'],
    required: true
  },
  attempts: Number,
  guessedLetters: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', GameSchema);