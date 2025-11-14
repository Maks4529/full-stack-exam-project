const {Router} = require('express');
const checkModerator = require('../middlewares/checkModerator');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const {checkAuth} = require('../middlewares/checkToken');
const {checkToken} = require('../middlewares/checkToken');
const offerController = require('../controllers/offerController');

const offerRouter = Router();

offerRouter.get('/my', checkAuth, offerController.getMyOffers);
offerRouter.get('/customer-visible', checkAuth, offerController.getApprovedOffers);


offerRouter.use(checkToken);

offerRouter.get('/moderation', checkModerator, offerController.getAllOffersForModeration);
offerRouter.patch('/moderation/:offerId', checkModerator, offerController.updateOfferStatus);
offerRouter.patch(
  '/:offerId/status', 
  basicMiddlewares.onlyForCustomerWhoCreateContest, 
  offerController.setOfferStatus
);

module.exports = offerRouter;