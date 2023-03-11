const express = require('express');
const { Game, User, Prompt, Task } = require('../../db/models');

const router = express.Router();

// GET GAME
router.get('/:gameId/:userId', async (req, res) => {
    const game = await Game.findByPk(req.params.gameId, { include: [{ model: User }, { model: Prompt, include: [{ model: Task, include: { model: User } }, { model: User }] }] });
    const player = await User.findByPk(req.params.userId);

    if (!player.gameId) {
        return res.json(null);
    };

    return res.json(game);
});

// CREATE NEW GAME
router.post('/new-game', async (req, res) => {
    const pin = Math.floor((Math.random() * 8999) + 1000); // Random number from 1000 to 9999
    const game = await Game.create({ pin, stage: 'Lobby', round: 1 });

    const player = await User.findByPk(req.body.userId);
    await player.update({ gameId: game.id, isHost: true });
    await player.save();

    const newGame = await Game.findByPk(game.id, { include: [{ model: User }] });
    return res.json(newGame);
});

// JOIN GAME AS GUEST
router.put('/join-game', async (req, res) => {
    const game = await Game.findOne({ where: { pin: req.body.pin }, include: [{ model: User }, { model: Prompt, include: [{ model: Task, include: { model: User } }, { model: User }] }] });
    const player = await User.findByPk(req.body.userId);

    if (game && game.stage === 'Lobby') {
        await player.update({ gameId: game.id });
        await player.save();

        const io = req.app.get('socketio');
        io.emit('game-update', game.id);

        return res.json({ game, player });
    };

    return res.json({ game: null, player });
});

// LEAVE GAME
router.put('/leave-game', async (req, res) => {
    const player = await User.findByPk(req.body.userId);
    const gameId = player.gameId;

    await player.update({ gameId: null });
    await player.save();

    const io = req.app.get('socketio');
    io.emit('game-update', gameId);
});

// KICK PLAYER OUT
router.put('/kick-out', async (req, res) => {
    const player = await User.findByPk(req.body.userId);
    await player.update({ gameId: null });
    await player.save();

    const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt, include: [{ model: Task, include: { model: User } }, { model: User }] }] });

    const io = req.app.get('socketio');
    io.emit('game-update', game.id);

    return res.json(game);
});

// END GAME
router.delete('/end-game', async (req, res) => {
    const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt, include: { model: Task } }] });

    for (let prompt of game.Prompts) {
        for (let task of prompt.Tasks) {
            await task.destroy();
        };
        await prompt.destroy();
    };

    for (let player of game.Users) {
        await player.update({ gameId: null, isHost: false });
        await player.save();
    };

    await game.destroy();

    const io = req.app.get('socketio');
    io.emit('game-update', req.body.gameId);
});

// START GAME
router.post('/start-game', async (req, res) => {
    const players = await User.findAll({ where: { gameId: req.body.gameId } });

    for (let player of players) {
        await Prompt.create({ gameId: player.gameId, userId: player.id });
    };

    const game = await Game.findByPk(req.body.gameId, { include: [{ model: User }, { model: Prompt, include: [{ model: Task, include: { model: User } }, { model: User }] }] });
    await game.update({ stage: 'Prompt' });
    await game.save();

    const io = req.app.get('socketio');
    io.emit('game-update', req.body.gameId);

    return res.json(game);
});

module.exports = router;
