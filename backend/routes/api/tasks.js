const express = require('express');
const { Game, User, Prompt, Task } = require('../../db/models');

const router = express.Router();

router.post('/create-task', async (req, res) => {
    const task = await Task.create({
        promptId: req.body.promptId,
        userId: req.body.userId,
        task: req.body.task,
        type: req.body.type,
        round: req.body.round
    });
    return res.json(task);
});

module.exports = router;
