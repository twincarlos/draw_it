const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const gamesRouter = require('./games.js');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/games', gamesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
