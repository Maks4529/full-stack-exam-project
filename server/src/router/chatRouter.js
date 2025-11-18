const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const chatController = require('../controllers/chatController');

const chatRouter = Router();

chatRouter.use(checkToken.checkToken);

chatRouter.get('/preview', chatController.getPreview);

chatRouter.route('/dialogs/:id').get(chatController.getChat);

chatRouter.patch('/dialogs/:id/blackList', chatController.blackList);
chatRouter.patch('/dialogs/:id/favorite', chatController.favoriteChat);
chatRouter.post('/dialogs/:id/messages', chatController.addMessage);

chatRouter
  .route('/catalogs')
  .post(chatController.createCatalog)
  .get(chatController.getCatalogs);

chatRouter
  .route('/catalogs/:id')
  .patch(chatController.updateNameCatalog)
  .delete(chatController.deleteCatalog);

chatRouter.post('/catalogs/:id/chats', chatController.addNewChatToCatalog);

chatRouter.delete(
  '/catalogs/:catalogId/chats/:chatId',
  chatController.removeChatFromCatalog
);

module.exports = chatRouter;
