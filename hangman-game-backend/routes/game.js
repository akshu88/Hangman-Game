const express = require('express');
const auth = require('../middleware/auth');
const Game = require('../models/Game');

const router = express.Router();

// Words for each category
const WORDS = {
  'computer-fundamentals': [
    'algorithm', 'variable', 'function', 'database', 'network',
    'cache', 'pointer', 'loop', 'array', 'binary'
  ],
  'lifestyle': [
    'exercise', 'meditation', 'nutrition', 'wellness', 'mindfulness',
    'balance', 'health', 'happiness', 'therapy', 'lifestyle'
  ]
};

// POST /api/game/start — get a word from the backend
router.post('/start', auth, async (req, res) => {
  try {
    const { category } = req.body;

    if (!WORDS[category]) {
      return res.status(400).json({ message: '❌ Invalid category' });
    }

    const words = WORDS[category];
    const word  = words[Math.floor(Math.random() * words.length)];

    res.json({
      message: '✅ Game started',
      word,
      category,
      attempts: 6,
      guessedLetters: []
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// POST /api/game/result — save game result
router.post('/result', auth, async (req, res) => {
  try {
    const { category, word, result, attempts, guessedLetters } = req.body;

    const game = new Game({
      userId: req.userId,
      username: req.username,
      category,
      word,
      result,
      attempts,
      guessedLetters
    });

    await game.save();

    res.json({ message: '✅ Game result saved', game });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// GET /api/game/user-stats — stats for logged-in user
router.get('/user-stats', auth, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.userId });

    const stats = {
      totalGames: games.length,
      wins:   games.filter(g => g.result === 'win').length,
      losses: games.filter(g => g.result === 'loss').length,
      winRate: games.length > 0
        ? ((games.filter(g => g.result === 'win').length / games.length) * 100).toFixed(2)
        : 0
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// GET /api/game/leaderboard — public leaderboard sorted by wins
router.get('/leaderboard', async (req, res) => {
  try {
    const games = await Game.find();

    const userStats = {};

    games.forEach(game => {
      if (!userStats[game.username]) {
        userStats[game.username] = { username: game.username, totalGames: 0, wins: 0, losses: 0 };
      }
      userStats[game.username].totalGames++;
      if (game.result === 'win') userStats[game.username].wins++;
      else userStats[game.username].losses++;
    });

    const leaderboard = Object.values(userStats)
      .map(user => ({
        ...user,
        winRate: user.totalGames > 0
          ? ((user.wins / user.totalGames) * 100).toFixed(2)
          : 0
      }))
      .sort((a, b) => b.wins - a.wins);

    res.json({ message: '✅ Leaderboard retrieved', leaderboard });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;
