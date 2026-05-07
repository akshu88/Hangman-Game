const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/user/:id/update
router.post('/:id/update', auth, async (req, res) => {
  try {
    const { gamesPlayed, wins, losses, coins } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
      gamesPlayed,
      wins,
      losses,
      coins
    });

    res.json({ message: '✅ Stats updated successfully' });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;
