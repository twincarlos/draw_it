const express = require('express');
const { Game, User, Prompt } = require('../../db/models');

const router = express.Router();

// GET GAME
router.get('/:gameId', async (req, res) => {
    const game = await Game.findByPk(req.params.gameId, { include: [{ model: User }, { model: Prompt }] });
    return res.json(game);
});

// CREATE NEW GAME
router.post('/new-game', async (req, res) => {
    const pin = Math.floor((Math.random() * 8999) + 1000); // Random number from 1000 to 9999
    const game = await Game.create({ pin, stage: 'Lobby' });

    const player = await User.findByPk(req.body.userId);
    await player.update({ gameId: game.id, isHost: true });
    await player.save();

    const newGame = await Game.findByPk(game.id, { include: [{ model: User }, { model: Prompt }] });
    return res.json(newGame);
});

// JOIN GAME AS GUEST
router.put('/join-game', async (req, res) => {
    const game = await Game.findOne({ where: { pin: req.body.pin }, include: [{ model: User }, { model: Prompt }] });
    const player = await User.findByPk(req.body.userId);

    if (game) {
        await player.update({ gameId: game.id });
        await player.save();
    };

    return res.json({ game, player });
});

// JOIN GAME AS HOST
// router.put('/join-game-as-host', async (req, res) => {
//     const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt }] });
//     const player = await User.findByPk(req.body.userId);

//     await player.update({ gameId: game.id, isHost: true });
//     await player.save();

//     return res.json({ player, game });
// });

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

    const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt }] });
    return res.json(game);
});

// END GAME
router.delete('/end-game', async (req, res) => {
    const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt }] });

    for (let player of game.Users) {
        await player.update({ gameId: null, isHost: false });
        await player.save();
    };

    await game.destroy();
});

// START GAME
router.post('/start-game', async (req, res) => {
    const players = await User.findAll({ where: { gameId: req.body.gameId } });

    for (let player of players) {
        await Prompt.create({ gameId: player.gameId, userId: player.id });
    };

    const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt }] });
    await game.update({ stage: 'Prompt' });
    await game.save();

    return res.json(game);
});

module.exports = router;
