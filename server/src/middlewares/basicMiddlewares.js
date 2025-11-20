const bd = require('../models');
const RightsError = require('../errors/RightsError');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const CONSTANTS = require('../constants');

module.exports.parseBody = (req, res, next) => {
  try {
    if (typeof req.body.contests === 'string') {
      req.body.contests = JSON.parse(req.body.contests);
    }
  } catch (e) {
    return next(new ServerError('cannot parse contests body'));
  }

  if (!Array.isArray(req.body.contests)) {
    return next(new ServerError('contests should be an array'));
  }

  req.files = Array.isArray(req.files) ? req.files : [];

  for (let i = 0; i < req.body.contests.length; i++) {
    if (req.body.contests[i].haveFile) {
      const file = req.files.splice(0, 1);
      if (file && file[0]) {
        req.body.contests[i].fileName = file[0].filename;
        req.body.contests[i].originalFileName = file[0].originalname;
      } else {
        return next(new ServerError('missing contest file'));
      }
    }
  }
  next();
};

module.exports.canGetContest = async (req, res, next) => {
  const {
    params: { contestId },
    tokenData: { userId, role },
  } = req;

  let result = null;
  try {
    if (role === CONSTANTS.CUSTOMER) {
      result = await bd.Contests.findOne({
        where: { id: contestId, userId },
      });
    } else if (role === CONSTANTS.CREATOR) {
      result = await bd.Contests.findOne({
        where: {
          id: contestId,
          status: {
            [bd.Sequelize.Op.or]: [
              CONSTANTS.CONTEST_STATUS_ACTIVE,
              CONSTANTS.CONTEST_STATUS_FINISHED,
            ],
          },
        },
      });
    }
    result ? next() : next(new RightsError());
  } catch (e) {
    next(new ServerError(e));
  }
};

module.exports.onlyForCreative = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    next(new RightsError());
  } else {
    next();
  }
};

module.exports.onlyForCustomer = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CREATOR) {
    return next(new RightsError('this page only for customers'));
  } else {
    next();
  }
};

module.exports.canSendOffer = async (req, res, next) => {
  try {
    if (!req.tokenData || req.tokenData.role === CONSTANTS.CUSTOMER) {
      return next(new RightsError());
    }

    const contestIdRaw = req.params?.contestId ?? req.body?.contestId;
    if (
      contestIdRaw === undefined ||
      contestIdRaw === null ||
      String(contestIdRaw).toLowerCase() === 'undefined' ||
      Number.isNaN(Number(contestIdRaw))
    ) {
      return next(new BadRequestError('contestId is required'));
    }

    const contestId = Number.parseInt(contestIdRaw, 10);
    const result = await bd.Contests.findOne({
      where: {
        id: contestId,
      },
      attributes: ['status'],
    });
    if (!result) {
      return next(new RightsError());
    }

    const { status } = result.get({ plain: true });
    if (status === CONSTANTS.CONTEST_STATUS_ACTIVE) {
      next();
    } else {
      return next(new RightsError());
    }
  } catch (e) {
    next(new ServerError(e));
  }
};

module.exports.onlyForCustomerWhoCreateContest = async (req, res, next) => {
  try {
    if (!req.tokenData) return next(new RightsError());
    let contestId = req.body?.contestId;
    if (!contestId) {
      const offerId = req.params?.offerId || req.body?.offerId;
      if (!offerId) {
        return next(new RightsError());
      }
      const offer = await bd.Offers.findByPk(offerId, {
        attributes: ['contestId'],
      });
      if (!offer) return next(new RightsError());
      contestId = offer.get('contestId');
      req.body.contestId = contestId;
    }

    const result = await bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: contestId,
        status: CONSTANTS.CONTEST_STATUS_ACTIVE,
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError(e));
  }
};

module.exports.canUpdateContest = async (req, res, next) => {
  try {
    const result = await bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: { [bd.Sequelize.Op.not]: CONSTANTS.CONTEST_STATUS_FINISHED },
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};
