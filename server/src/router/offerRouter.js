const {Router} = require('express');
const checkModerator = require('../middlewares/checkModerator');
const {checkAuth} = require('../middlewares/checkToken');
const {checkToken} = require('../middlewares/checkToken');
const offerController = require('../controllers/offerController');

const offerRouter = Router();

const setStatus = (status) => (req, res, next) => {
  req.body.status = status;
  next();
};

offerRouter.post('/moderator-list', checkToken, checkModerator, offerController.getAllOffersForModeration);
offerRouter.post('/approve', checkToken, checkModerator, setStatus('approved'), offerController.updateOfferStatus);
offerRouter.post('/reject', checkToken, checkModerator, setStatus('rejected'), offerController.updateOfferStatus);
offerRouter.post('/my', checkAuth, offerController.getMyOffers);
offerRouter.post('/customer-visible', checkAuth, offerController.getApprovedOffers);

module.exports = offerRouter;