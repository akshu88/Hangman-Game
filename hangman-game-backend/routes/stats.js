const express = require('express');
const auth = require('../middleware/auth');
const Game = require('../models/Game');
const User = require('../models/User');

const router = express.Router();

// Get user statistics
router.get('/user-stats', auth, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.userId });

    const stats = {
      totalGames: games.length,
      wins: games.filter(g => g.result === 'win').length,
      losses: games.filter(g => g.result === 'loss').length,
      winRate: games.length > 0 
        ? ((games.filter(g => g.result === 'win').length / games.length) * 100).toFixed(2) 
        : 0,
      byCategory: {
        'computer-fundamentals': {
          total: games.filter(g => g.category === 'computer-fundamentals').length,
          wins: games.filter(g => g.category === 'computer-fundamentals' && g.result === 'win').length,
          losses: games.filter(g => g.category === 'computer-fundamentals' && g.result === 'loss').length
        },
        'lifestyle': {
          total: games.filter(g => g.category === 'lifestyle').length,
          wins: games.filter(g => g.category === 'lifestyle' && g.result === 'win').length,
          losses: games.filter(g => g.category === 'lifestyle' && g.result === 'loss').length
        }
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const games = await Game.find();

    // Calculate stats for each user
    const userStats = {};

    games.forEach(game => {
      if (!userStats[game.username]) {
        userStats[game.username] = {
          username: game.username,
          totalGames: 0,
          wins: 0,
          losses: 0
        };
      }
      userStats[game.username].totalGames++;
      if (game.result === 'win') {
        userStats[game.username].wins++;
      } else {
        userStats[game.username].losses++;
      }
    });

    // Convert to array and sort by wins
    const leaderboard = Object.values(userStats)
      .map(user => ({
        ...user,
        winRate: user.totalGames > 0 
          ? ((user.wins / user.totalGames) * 100).toFixed(2) 
          : 0
      }))
      .sort((a, b) => b.wins - a.wins);

    res.json({
      message: '✅ Leaderboard retrieved',
      leaderboard
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// Get category-wise leaderboard
router.get('/leaderboard/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const games = await Game.find({ category });

    const userStats = {};

    games.forEach(game => {
      if (!userStats[game.username]) {
        userStats[game.username] = {
          username: game.username,
          category,
          totalGames: 0,
          wins: 0,
          losses: 0
        };
      }
      userStats[game.username].totalGames++;
      if (game.result === 'win') {
        userStats[game.username].wins++;
      } else {
        userStats[game.username].losses++;
      }
    });

    const leaderboard = Object.values(userStats)
      .map(user => ({
        ...user,
        winRate: user.totalGames > 0 
          ? ((user.wins / user.totalGames) * 100).toFixed(2) 
          : 0
      }))
      .sort((a, b) => b.wins - a.wins);

    res.json({
      message: '✅ Category leaderboard retrieved',
      leaderboard
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;