const db = require('../models');
const mailer = require('../utils/mailer');
const controller = require('../socketInit');

module.exports.approveOffer = async (req, res, next) => {
  try {
    const offer = await db.Offers.findByPk(req.body.offerId, {
      include: [{ model: db.Users, attributes: ['email'] }],
    });
    if (!offer) return res.status(404).send({ error: 'Offer not found' });
    offer.status = 'approved';
    await offer.save();
    await db.Notification.create({
      userId: offer.userId,
      message: `Your offer #${offer.id} was approved.`,
    });

    try {
      controller
        .getNotificationController()
        .emitChangeOfferStatus(
          String(offer.userId),
          `Your offer #${offer.id} was approved.`,
          offer.contestId
        );
    } catch (e) {
      console.error(
        'Failed to emit socket notification for approval',
        e.message || e
      );
    }

    const creatorEmail = offer.User && offer.User.email;
    if (creatorEmail) {
      try {
        await mailer.sendMail({
          to: creatorEmail,
          subject: 'Your offer was approved',
          text: `Hello, your offer #${offer.id} has been approved by moderator.`,
        });
      } catch (e) {
        console.error('Failed to send approval email', e.message || e);
      }
    }

    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.rejectOffer = async (req, res, next) => {
  try {
    const offer = await db.Offers.findByPk(req.body.offerId, {
      include: [{ model: db.Users, attributes: ['email'] }],
    });
    if (!offer) return res.status(404).send({ error: 'Offer not found' });

    offer.status = 'rejected';
    await offer.save();

    await db.Notification.create({
      userId: offer.userId,
      message: `Your offer #${offer.id} was rejected.`,
    });

    try {
      controller
        .getNotificationController()
        .emitChangeOfferStatus(
          String(offer.userId),
          `Your offer #${offer.id} was rejected.`,
          offer.contestId
        );
    } catch (e) {
      console.error(
        'Failed to emit socket notification for rejection',
        e.message || e
      );
    }

    const creatorEmail = offer.User && offer.User.email;
    if (creatorEmail) {
      try {
        await mailer.sendMail({
          to: creatorEmail,
          subject: 'Your offer was rejected',
          text: `Hello, your offer #${offer.id} has been rejected by moderator.`,
        });
      } catch (e) {
        console.error('Failed to send rejection email', e.message || e);
      }
    }

    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllOffersForModeration = async (req, res, next) => {
  try {
    const limit = 10;
    const page = req.body.page || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Offers.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']],
      attributes: ['id', 'text', 'status', 'contestId', 'userId'],
    });

    res.send({
      offers: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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