const { Router } = require('express');
const userRouter = require('./userRouter');
const contestsRouter = require('./contestsRouter');
const chatRouter = require('./chatRouter');
const offerRouter = require('./offerRouter');

const router = Router();

router.use('/users', userRouter);
router.use('/contests', contestsRouter);
router.use('/chat', chatRouter);
router.use('/offers', offerRouter);

module.exports = router;
