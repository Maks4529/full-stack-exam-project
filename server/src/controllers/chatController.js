const moment = require('moment');
const _ = require('lodash');
const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');

function checkModelsPresent (req, res, next, required = []) {
  const missing = [];
  for (const name of required) {
    const singular = name.endsWith('s') ? name.slice(0, -1) : name;
    const plural = singular + 's';
    if (!db[singular] && !db[plural]) missing.push(name);
  }
  if (missing.length) {
    const available = Object.keys(db).slice(0, 100);
    return res
      .status(500)
      .json({ error: 'Missing required chat models', missing, available });
  }
  return null;
}

async function findConversationByParticipants (participants) {
  const sql = `SELECT conversation_id FROM user_conversations WHERE user_id IN (:a, :b) GROUP BY conversation_id HAVING COUNT(*) = 2 LIMIT 1`;
  const rows = await db.sequelize.query(sql, {
    replacements: { a: participants[0], b: participants[1] },
    type: db.Sequelize.QueryTypes.SELECT,
  });
  if (rows && rows.length > 0 && rows[0].conversation_id) {
    return db.Conversations.findByPk(rows[0].conversation_id);
  }
  return null;
}

async function createConversationWithParticipants (participants) {
  const conv = await db.Conversations.create({});
  await db.UserConversation.bulkCreate([
    {
      user_id: participants[0],
      conversation_id: conv.id,
      black_list: false,
      favorite: false,
    },
    {
      user_id: participants[1],
      conversation_id: conv.id,
      black_list: false,
      favorite: false,
    },
  ]);
  return conv;
}

async function getParticipantsFlags (conversationId, participants) {
  const rows = await db.UserConversation.findAll({
    where: { conversation_id: conversationId },
  });
  const ordered = participants.map(p => {
    const r = rows.find(rr => Number(rr.user_id) === Number(p));
    return { black: !!(r && r.black_list), fav: !!(r && r.favorite) };
  });
  return {
    blackList: ordered.map(o => o.black),
    favoriteList: ordered.map(o => o.fav),
  };
}

module.exports.addMessage = async (req, res, next) => {
  const participants = [
    Number(req.tokenData.userId),
    Number(req.body.recipient),
  ];
  participants.sort((a, b) => a - b);
  try {
    let conv = await findConversationByParticipants(participants);
    if (!conv) conv = await createConversationWithParticipants(participants);

    const saved = await db.Messages.create({
      sender_id: req.tokenData.userId,
      body: req.body.messageBody,
      conversation_id: conv.id,
    });

    const { blackList, favoriteList } = await getParticipantsFlags(
      conv.id,
      participants
    );

    const interlocutorId = participants.find(
      p => p !== Number(req.tokenData.userId)
    );

    const message = {
      _id: saved.id,
      sender: saved.sender_id,
      body: saved.body,
      conversation: saved.conversation_id,
      createdAt: saved.created_at || new Date(),
      updatedAt: saved.updated_at || new Date(),
      participants,
    };

    const preview = {
      _id: conv.id,
      sender: message.sender,
      text: message.body,
      createAt: message.createdAt,
      participants,
      blackList,
      favoriteList,
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: Object.assign({}, preview, {
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      }),
    });

    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const participants = [
    Number(req.tokenData.userId),
    Number(req.body.interlocutorId),
  ];
  participants.sort((a, b) => a - b);
  try {
    let conv = await findConversationByParticipants(participants);
    if (!conv) conv = await createConversationWithParticipants(participants);
    const rows = await db.Messages.findAll({
      where: { conversation_id: conv.id },
      order: [['created_at', 'ASC']],
    });
    const messages = rows.map(m => ({
      _id: m.id,
      sender: m.sender_id,
      body: m.body,
      conversation: m.conversation_id,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));
    const interlocutor = await userQueries.findUser({
      id: req.body.interlocutorId,
    });
    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const modelCheck = checkModelsPresent(req, res, next, [
      'UserConversation',
      'Message',
      'User',
    ]);
    if (modelCheck) return modelCheck;
    const userConvs = await db.UserConversation.findAll({
      where: { user_id: req.tokenData.userId },
    });
    const convIds = userConvs.map(uc => uc.conversation_id);
    const previews = [];
    for (const convId of convIds) {
      const lastMsg = await db.Messages.findOne({
        where: { conversation_id: convId },
        order: [['created_at', 'DESC']],
      });
      const participantsRows = await db.UserConversation.findAll({
        where: { conversation_id: convId },
      });
      const participants = participantsRows
        .map(r => r.user_id)
        .sort((a, b) => a - b);
      const blackList = participantsRows.map(r => !!r.black_list);
      const favoriteList = participantsRows.map(r => !!r.favorite);
      previews.push({
        _id: convId,
        sender: lastMsg ? lastMsg.sender_id : null,
        text: lastMsg ? lastMsg.body : '',
        createAt: lastMsg ? lastMsg.created_at : null,
        participants,
        blackList,
        favoriteList,
      });
    }
    const interlocutors = previews.map(p =>
      p.participants.find(pid => pid !== req.tokenData.userId)
    );
    let senders = [];
    if (interlocutors.length > 0) {
      senders = await db.Users.findAll({
        where: { id: interlocutors },
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
      });
    }
    previews.forEach(preview => {
      const sender = senders.find(
        s =>
          s.id ===
          preview.participants.find(pid => pid !== req.tokenData.userId)
      );
      if (sender) {
        preview.interlocutor = {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
          displayName: sender.displayName,
          avatar: sender.avatar,
        };
      }
    });
    previews.sort((a, b) => (b.createAt || 0) - (a.createAt || 0));
    res.send(previews);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  try {
    const modelCheck = checkModelsPresent(req, res, next, ['UserConversation']);
    if (modelCheck) return modelCheck;
    const convId = req.body.participantsConversationId;
    if (!convId)
      return res
        .status(400)
        .json({ error: 'participantsConversationId is required' });

    let participants = req.body.participants;
    if (!Array.isArray(participants) || participants.length === 0) {
      const rows = await db.UserConversation.findAll({
        where: { conversation_id: convId },
      });
      participants = rows.map(r => r.user_id).sort((a, b) => a - b);
    }

    await db.UserConversation.update(
      { black_list: req.body.blackListFlag },
      {
        where: {
          conversation_id: req.body.participantsConversationId,
          user_id: req.tokenData.userId,
        },
      }
    );
    const { blackList, favoriteList } = await getParticipantsFlags(
      convId,
      participants
    );
    const interlocutorId = participants.find(
      p => p !== Number(req.tokenData.userId)
    );
    const chat = {
      participants,
      blackList,
      favoriteList,
      _id: req.body.participantsConversationId,
    };
    res.send(chat);
    try {
      const chatCtrl = controller.getChatController();
      if (
        chatCtrl &&
        typeof chatCtrl.emitChangeBlockStatus === 'function' &&
        interlocutorId
      ) {
        chatCtrl.emitChangeBlockStatus(interlocutorId, chat);
      }
    } catch (emitErr) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Socket emit error', emitErr);
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  try {
    const modelCheck = checkModelsPresent(req, res, next, ['UserConversation']);
    if (modelCheck) return modelCheck;

    const convId = req.body.participantsConversationId;
    if (!convId)
      return res
        .status(400)
        .json({ error: 'participantsConversationId is required' });

    let participants = req.body.participants;
    if (!Array.isArray(participants) || participants.length === 0) {
      const rows = await db.UserConversation.findAll({
        where: { conversation_id: convId },
      });
      participants = rows.map(r => r.user_id).sort((a, b) => a - b);
    }

    await db.UserConversation.update(
      { favorite: req.body.favoriteFlag },
      {
        where: {
          conversation_id: convId,
          user_id: req.tokenData.userId,
        },
      }
    );

    const { blackList, favoriteList } = await getParticipantsFlags(
      convId,
      participants
    );
    const interlocutorId = participants.find(
      p => p !== Number(req.tokenData.userId)
    );
    const chat = {
      participants,
      blackList,
      favoriteList,
      _id: convId,
    };
    res.send(chat);
    try {
      const chatCtrl = controller.getChatController();
      if (
        chatCtrl &&
        typeof chatCtrl.emitChangeBlockStatus === 'function' &&
        interlocutorId
      ) {
        chatCtrl.emitChangeBlockStatus(interlocutorId, chat);
      }
    } catch (emitErr) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Socket emit error', emitErr);
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const catalog = await db.Catalog.create({
      user_id: req.tokenData.userId,
      catalog_name: req.body.catalogName,
    });
    if (req.body.chatId) {
      await db.CatalogConversation.create({
        catalog_id: catalog.id,
        conversation_id: req.body.chatId,
      });
    }

    const rows = await db.CatalogConversation.findAll({
      where: { catalog_id: catalog.id },
    });
    const result = {
      _id: catalog.id,
      catalogName: catalog.catalog_name,
      chats: rows.map(r => r.conversation_id),
    };
    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const [updated] = await db.Catalog.update(
      { catalog_name: req.body.catalogName },
      { where: { id: req.body.catalogId, user_id: req.tokenData.userId } }
    );
    if (!updated)
      return res.status(404).send({ error: 'Catalog not found or not yours' });
    const catalog = await db.Catalog.findByPk(req.body.catalogId);
    const rows = await db.CatalogConversation.findAll({
      where: { catalog_id: catalog.id },
    });
    const result = {
      _id: catalog.id,
      catalogName: catalog.catalog_name,
      chats: rows.map(r => r.conversation_id),
    };
    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await db.Catalog.findOne({
      where: { id: req.body.catalogId, user_id: req.tokenData.userId },
    });
    if (!catalog)
      return res.status(404).send({ error: 'Catalog not found or not yours' });
    await db.CatalogConversation.findOrCreate({
      where: {
        catalog_id: req.body.catalogId,
        conversation_id: req.body.chatId,
      },
    });
    
    const rows = await db.CatalogConversation.findAll({
      where: { catalog_id: catalog.id },
    });
    const result = {
      _id: catalog.id,
      catalogName: catalog.catalog_name,
      chats: rows.map(r => r.conversation_id),
    };
    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await db.Catalog.findOne({
      where: { id: req.body.catalogId, user_id: req.tokenData.userId },
    });
    if (!catalog)
      return res.status(404).send({ error: 'Catalog not found or not yours' });
    await db.CatalogConversation.destroy({
      where: {
        catalog_id: req.body.catalogId,
        conversation_id: req.body.chatId,
      },
    });

    const rows = await db.CatalogConversation.findAll({
      where: { catalog_id: catalog.id },
    });
    const result = {
      _id: catalog.id,
      catalogName: catalog.catalog_name,
      chats: rows.map(r => r.conversation_id),
    };
    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const deleted = await db.Catalog.destroy({
      where: { id: req.body.catalogId, user_id: req.tokenData.userId },
    });
    if (!deleted)
      return res.status(404).json({ error: 'Catalog not found or not yours' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const modelCheck = checkModelsPresent(req, res, next, [
      'Catalog',
      'CatalogConversation',
    ]);
    if (modelCheck) return modelCheck;

    const catalogs = await db.Catalog.findAll({
      where: { user_id: req.tokenData.userId },
    });
    const result = [];
    for (const c of catalogs) {
      const rows = await db.CatalogConversation.findAll({
        where: { catalog_id: c.id },
      });
      result.push({
        _id: c.id,
        catalogName: c.catalog_name,
        chats: rows.map(r => r.conversation_id),
      });
    }
    res.send(result);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    next(err);
  }
};
