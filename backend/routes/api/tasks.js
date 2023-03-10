const express = require('express');
const { Game, User, Prompt, Task } = require('../../db/models');

const router = express.Router();

router.get('/:gameId/:userId/:round', async (req, res) => {
    const { gameId, userId, round } = req.params;
    const prompts = await Prompt.findAll({ where: { gameId } });
    const players = await User.findAll({ where: { gameId } });

    const playerIndex = players.findIndex(player => player.id === Number(userId));
    let promptIndex = playerIndex + Number(round) - 1;

    if (playerIndex + Number(round) - 1 >= players.length) {
        promptIndex -= players.length;
    };

    const prompt = prompts[promptIndex];

    const task = await Task.findOne({ where: { promptId: prompt.id, round: Number(round) - 1 } });
    return res.json(task);
});

router.post('/submit-task', async (req, res) => {
    let prompt;

    if (req.body.promptId) {
        prompt = await Prompt.findByPk(req.body.promptId);
    } else {
        prompt = await Prompt.findOne({ where: { gameId: req.body.gameId, userId: req.body.userId } });
    };

    await Task.create({
        promptId: prompt.id,
        userId: req.body.userId,
        task: req.body.task,
        type: req.body.type,
        round: req.body.round
    });

    const game = await Game.findByPk(req.body.gameId);
    const taskCount = await Task.count({ where: { round: req.body.round } });
    const promptCount = await Prompt.count({ where: { gameId: req.body.gameId } });
    let stage = game.stage;

    if (taskCount === promptCount) {
        if (game.round === promptCount) {
            stage = 'Final';
        }
        else {
            switch(stage) {
                case 'Prompt':
                case 'Guess':
                    stage = 'Draw';
                    break;
                case 'Draw':
                    stage = 'Guess'
                    break;
            };
            await game.increment({ round: 1 });
            await game.save();
        };

        await game.update({ stage });
        await game.save();
    };

    return res.json(game);
});

module.exports = router;
