const db = require('../models');
const mailer = require('../utils/mailer');
const controller = require('../socketInit');

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await db.Offers.update(
    { status: 'rejected' },
    { where: { id: offerId } }
  );
  return rejectedOffer;
};

const resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
  await db.Contests.update(
    { status: 'finished' },
    { where: { id: contestId }, transaction }
  );

  await db.Offers.update(
    { status: 'won' },
    { where: { id: offerId }, transaction }
  );

  const contest = await db.Contests.findByPk(contestId, { transaction });
  await db.Users.increment(
    { balance: contest.prize }, 
    { where: { id: creatorId }, transaction }
  );

  return await db.Offers.findByPk(offerId, { transaction });
};

const _notifyCreator = async (offerId, status, userId, contestId) => {
  const statusPastTense = status === 'approved' ? 'approved' : 'rejected';
  
  try {
    const fullOffer = await db.Offers.findByPk(offerId, {
      include: [
        { model: db.Users, attributes: ['email', 'firstName'] },
        { model: db.Contests, attributes: ['title'] },
      ],
    });

    if (!fullOffer) return;

    const creatorName = fullOffer.User?.firstName || 'Creator';
    const contestTitle = fullOffer.Contest?.title || 'your contest';
    const message = `Your offer for the contest "${contestTitle}" (ID: #${offerId}) was ${statusPastTense}.`;

    try {
      await db.Notification.create({ userId: userId, message: message });
    } catch (e) {
      console.error(`[Notify] DB Notification failed:`, e.message);
    }

    try {
      controller
        .getNotificationController()
        .emitChangeOfferStatus(String(userId), message, contestId);
    } catch (e) {
      console.error(`[Notify] Socket Notification failed:`, e.message);
    }

    const creatorEmail = fullOffer.User && fullOffer.User.email;
    if (creatorEmail) {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Hello, ${creatorName}!</h2>
          <p>We have an update regarding your offer for the contest: <strong>"${contestTitle}"</strong>.</p>
          <p>Your offer (ID: #${offerId}) has been <strong>${statusPastTense}</strong> by the moderator.</p>
          ${status === 'approved' 
            ? '<p style="color: green;">Congratulations! Your offer is now active.</p>' 
            : '<p style="color: red;">You can review the offer in your account and resubmit it if you wish.</p>'}
          <br><p>The Team</p>
        </div>`;
      
      const textBody = `Hello, ${creatorName}!\nYour offer (ID: #${offerId}) for "${contestTitle}" has been ${statusPastTense}.`;

      await mailer.sendMail({
        to: creatorEmail,
        subject: `Your offer for "${contestTitle}" was ${statusPastTense}`,
        text: textBody,
        html: htmlBody,
      });
    }
  } catch (e) {
    console.error(`[Notify] General error in _notifyCreator:`, e);
  }
};

// --- CONTROLLER METHODS ---

module.exports.updateOfferStatus = async (req, res, next) => {
  console.log('[updateOfferStatus] Request body:', req.body);

  try {
    const { status } = req.body;
    const targetId = req.body.offerId || req.body.id || req.params.offerId || req.params.id;

    if (!targetId) {
      return res.status(400).send({ error: 'Offer ID is missing.' });
    }

    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).send({ error: 'Invalid status provided.' });
    }

    const offer = await db.Offers.findByPk(targetId);
    if (!offer) {
      return res.status(404).send({ error: 'Offer not found' });
    }

    offer.status = status;
    await offer.save();

    res.send(offer);
    _notifyCreator(targetId, status, offer.userId, offer.contestId);
  } catch (err) {
    console.error('[updateOfferStatus] ERROR:', err);
    next(err);
  }
};

module.exports.getAllOffersForModeration = async (req, res, next) => {
  try {
    const limit = 6;
    const page = req.body.page || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Offers.findAndCountAll({
      limit,
      offset,
      where: { status: 'pending' },
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Contests,
          attributes: ['title', 'contestType', 'styleName', 'brandStyle'],
        },
      ],
    });

    res.send({
      offers: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getMyOffers = async (req, res, next) => {
  try {
    const offers = await db.Offers.findAll({
      where: { userId: req.tokenData.userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'text', 'status', 'contestId'],
    });
    res.send({ offers });
  } catch (err) {
    next(err);
  }
};

module.exports.getApprovedOffers = async (req, res, next) => {
  try {
    const offers = await db.Offers.findAll({
      where: { status: 'approved' },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'text', 'contestId'],
    });
    res.send({ offers });
  } catch (err) {
    next(err);
  }
};

module.exports.setOfferStatus = async (req, res, next) => {
  console.log('[setOfferStatus] Received body:', req.body); // LOGGING ADDED
  
  const { command, contestId, creatorId, orderId, priority } = req.body;
  
  // FIX: Extract offerId safely from either 'offerId' or 'id'
  const offerId = req.body.offerId || req.body.id;

  if (!offerId) {
    console.error('[setOfferStatus] Error: offerId is undefined!');
    return res.status(400).send({ error: 'Offer ID is missing (checked both offerId and id)' });
  }

  let transaction;

  if (command === 'reject') {
    try {
      const offer = await rejectOffer(offerId, creatorId, contestId);
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (command === 'resolve') {
    try {
      transaction = await db.sequelize.transaction();
      
      const winningOffer = await resolveOffer(
        contestId,
        creatorId,
        orderId,
        offerId, // Passing the safely extracted ID
        priority,
        transaction
      );
      
      // Commit transaction
      await transaction.commit();
      
      res.send(winningOffer);
    } catch (err) {
      try {
        if (transaction && !transaction.finished) {
          await transaction.rollback();
        }
      } catch (rbErr) {
        console.error('Rollback failed in setOfferStatus', rbErr);
      }
      next(err);
    }
  } else {
    res.status(400).send({ error: 'Invalid command' });
  }
};