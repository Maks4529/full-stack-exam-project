const db = require('../models');
const mailer = require('../utils/mailer');
const controller = require('../socketInit');

const _notifyCreator = async (offer, status) => {
  const statusPastTense = status === 'approved' ? 'approved' : 'rejected';

  const creatorName = offer.User?.firstName || 'Creator';
  const contestTitle = offer.Contest?.title || 'your contest';

  const message = `Your offer for the contest "${contestTitle}" (ID: #${offer.id}) was ${statusPastTense}.`;

  try {
    await db.Notification.create({
      userId: offer.userId,
      message: message,
    });
  } catch (e) {
    console.error(
      `Failed to create DB notification for offer ${offer.id}:`,
      e.message || e
    );
  }

  try {
    controller
      .getNotificationController()
      .emitChangeOfferStatus(String(offer.userId), message, offer.contestId);
  } catch (e) {
    console.error(
      `Failed to emit socket notification for offer ${offer.id}:`,
      e.message || e
    );
  }

  const creatorEmail = offer.User && offer.User.email;

  if (creatorEmail) {
    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Hello, ${creatorName}!</h2>
          <p>We have an update regarding your offer for the contest: <strong>"${contestTitle}"</strong>.</p>
          <p>Your offer (ID: #${offer.id}) has been <strong>${statusPastTense}</strong> by the moderator.</p>
          ${
            status === 'approved'
              ? '<p style="color: green;">Congratulations! Your offer is now active.</p>'
              : '<p style="color: red;">You can review the offer in your account and resubmit it if you wish.</p>'
          }
          <br>
          <p>Thank you,</p>
          <p>The Team</p>
        </div>
      `;

      const textBody = `
        Hello, ${creatorName}!
        We have an update regarding your offer for the contest: "${contestTitle}".
        Your offer (ID: #${offer.id}) has been ${statusPastTense} by the moderator.
        ${status === 'approved' ? 'Congratulations! Your offer is now active.' : 'You can review the offer in your account and resubmit it if you wish.'}
        Thank you,
        The Team
      `;

      await mailer.sendMail({
        to: creatorEmail,
        subject: `Your offer for "${contestTitle}" was ${statusPastTense}`,
        text: textBody,
        html: htmlBody,
      });
    } catch (e) {
      console.error(
        `[Notify] ПОМИЛКА відправки ${statusPastTense} email для оферу ${offer.id}:`,
        e.message || e
      );
    }
  } else {
    console.warn(
      `[Notify] Email не буде відправлено. 'creatorEmail' не знайдено для оферу #${offer.id}.`
    );
  }
};

module.exports.updateOfferStatus = async (req, res, next) => {
  try {
    const { offerId, status } = req.body;

    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).send({ error: 'Invalid status provided.' });
    }

    const offer = await db.Offers.findByPk(offerId, {
      include: [
        {
          model: db.Users,
          attributes: ['email', 'firstName'],
        },
        {
          model: db.Contests,
          attributes: ['title'],
        },
      ],
    });

    if (!offer) {
      return res.status(404).send({ error: 'Offer not found' });
    }

    offer.status = status;
    await offer.save();

    res.send({ success: true, newStatus: offer.status });

    _notifyCreator(offer, status);
  } catch (err) {
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
  let transaction;
  if (req.body.command === 'reject') {
    try {
      const offer = await rejectOffer(
        req.body.offerId,
        req.body.creatorId,
        req.body.contestId
      );
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (req.body.command === 'resolve') {
    try {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(
        req.body.contestId,
        req.body.creatorId,
        req.body.orderId,
        req.body.offerId,
        req.body.priority,
        transaction
      );
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
  }
};
