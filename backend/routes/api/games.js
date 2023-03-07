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

// JOIN GAME AS GUEST
router.put('/join-game-as-guest', async (req, res) => {
    const game = await Game.findOne({ where: { pin: req.body.pin }, include: { model: User } });
    const player = await User.findByPk(req.body.userId);

    if (game) {
        await player.update({ gameId: game.id });
        await player.save();
    };

    return res.json({ player, game });
});

// JOIN GAME AS HOST
router.put('/join-game-as-host', async (req, res) => {
    const game = await Game.findByPk(req.body.gameId, { include: { model: User } });
    const player = await User.findByPk(req.body.userId);

    await player.update({ gameId: game.id, isHost: true });
    await player.save();

    return res.json({ player, game });
});

// LEAVE GAME
router.put('/leave-game', async (req, res) => {
    const player = await User.findByPk(req.body.userId);

    await player.update({ gameId: null });
    await player.save();
});

// KICK PLAYER OUT
router.put('/kick-out', async (req, res) => {
    const player = await User.findByPk(req.body.userId);
    await player.update({ gameId: null });
    await player.save();

    const game = await Game.findByPk(req.body.gameId, { include: { model: User } });
    return res.json(game);
});

// END GAME
router.delete('/end-game', async (req, res) => {
    const game = await Game.findByPk(req.body.gameId);
    const players = await User.findAll({ where: { gameId: game.id } });

    for (let player of players) {
        await player.update({ gameId: null, isHost: false });
        await player.save();
    };

    await game.destroy();
});

module.exports = router;
