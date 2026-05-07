const express = require('express');
const User = require('../models/User');
const Game = require('../models/Game');
const protect = require('../middleware/auth');

const router = express.Router();

// Seed Akshita12 if she doesn't exist
async function ensureAkshita() {
  const exists = await User.findOne({ username: 'Akshita12' });
  if (!exists) {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('akshita123', 10);
    await User.create({
      username: 'Akshita12',
      email: 'akshita12@hangman.com',
      password: hashed,
      gamesPlayed: 50,
      wins: 40,
      losses: 10,
      coins: 9999,
      highScore: 9999
    });
    console.log('✅ Akshita12 seeded');
  }
}
ensureAkshita();

router.get('/user-stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const wins = user.wins;
    const winRate = user.gamesPlayed > 0
      ? ((wins / user.gamesPlayed) * 100).toFixed(2) : 0;
    const userGames = await Game.find({ userId: req.userId })
      .sort({ createdAt: -1 }).limit(10);
    res.status(200).json({
      success: true,
      dashboard: {
        username: user.username,
        email: user.email,
        gamesPlayed: user.gamesPlayed,
        wins,
        losses: user.losses,
        winRate: parseFloat(winRate),
        coins: user.coins,
        highScore: user.highScore,
        recentGames: userGames
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const topPlayers = await User.find()
      .sort({ coins: -1 })
      .limit(5)
      .select('username coins gamesPlayed wins losses highScore');

    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      username: player.username,
      coins: player.coins,
      gamesPlayed: player.gamesPlayed,
      wins: player.wins,
      losses: player.losses,
      highScore: player.highScore
    }));

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user-rank', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const usersAbove = await User.countDocuments({ coins: { $gt: user.coins } });
    res.status(200).json({
      success: true,
      userRank: {
        rank: usersAbove + 1,
        username: user.username,
        coins: user.coins,
        totalPlayers: await User.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;