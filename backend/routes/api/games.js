const express = require('express');
const { Game, User } = require('../../db/models');

const router = express.Router();

// GET GAME
router.get('/:gameId', async (req, res) => {
    const game = await Game.findByPk(req.params.gameId, { include: { model: User } });
    return res.json(game);
});

// CREATE NEW GAME
router.post('/new-game', async (req, res) => {
    const pin = Math.floor((Math.random() * 8999) + 1000); // Random number from 1000 to 9999
    const game = await Game.create({ pin, stage: 'Lobby' });

    return res.json(game);
});

// JOIN GAME BY PIN
router.put('/join-game-by-pin', async (req, res) => {
    const game = await Game.findOne({ where: { pin: req.body.pin } });
    const player = await User.findByPk(req.body.userId);

    if (game) {
        await player.update({ gameId: game.id });
        await player.save();
    };

    return res.json({ player, game });
});

// JOIN GAME BY ID
router.put('/join-game-by-id', async (req, res) => {
    const game = await Game.findByPk(req.body.gameId);
    const player = await User.findByPk(req.body.userId);

    await player.update({ gameId: game.id, isHost: true });
    await player.save();

    return res.json({ player, game });
});

// END GAME
router.delete('/end-game', async (req, res) => {
    const game = await Game.findByPk(req.body.gameId);
    await game.destroy();
});

module.exports = router;
