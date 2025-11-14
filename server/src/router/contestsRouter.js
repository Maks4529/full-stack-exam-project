const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');

const contestsRouter = Router();

contestsRouter.use(checkToken.checkToken);

contestsRouter.route('/')
.post(
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment,
)
.get(
  basicMiddlewares.onlyForCreative,
  contestController.getContests,
);

contestsRouter.get(
  '/byCustomer',
  contestController.getCustomersContests,
);

contestsRouter.get(
  '/data',
  contestController.dataForContest,
);

contestsRouter.get(
  '/download/:fileName',
  contestController.downloadFile,
);

contestsRouter.route('/:contestId')
.get(
  basicMiddlewares.canGetContest,
  contestController.getContestById,
)
.patch(
  upload.updateContestFile,
  contestController.updateContest,
);

contestsRouter.post(
  '/:contestId/offers',
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer,
);

module.exports = contestsRouter;