const {Router} = require('express');
const checkModerator = require('../middlewares/checkModerator');
const {checkAuth} = require('../middlewares/checkToken');
const {checkToken} = require('../middlewares/checkToken');
const offerController = require('../controllers/offerController');

const offerRouter = Router();

offerRouter.post('/moderator-list', checkToken, checkModerator, offerController.getAllOffersForModeration);
offerRouter.post('/approve', checkToken, checkModerator, offerController.approveOffer);
offerRouter.post('/reject', checkToken, checkModerator, offerController.rejectOffer);
offerRouter.post('/my', checkAuth, offerController.getMyOffers);
offerRouter.post('/customer-visible', checkAuth, offerController.getApprovedOffers);

module.exports = offerRouter;