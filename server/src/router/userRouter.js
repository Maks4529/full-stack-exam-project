const { Router } = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const upload = require('../utils/fileUpload');

const userRouter = Router();

userRouter.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

userRouter.post('/login', validators.validateLogin, userController.login);

userRouter
  .route('/me')
  .get(checkToken.checkAuth)
  .patch(checkToken.checkToken, upload.uploadAvatar, userController.updateUser);

userRouter.post(
  '/marks',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

userRouter.post(
  '/cashout',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);

module.exports = userRouter;
