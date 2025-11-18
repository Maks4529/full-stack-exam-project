const db = require('../models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

module.exports.dataForContest = async (req, res, next) => {
  const response = {};
  try {
    const {
      query: { characteristic1, characteristic2 },
    } = req;
    const types = [characteristic1, characteristic2, 'industry'].filter(
      Boolean
    );

    const characteristics = await db.Selects.findAll({
      where: {
        type: {
          [db.Sequelize.Op.or]: types,
        },
      },
    });
    if (!characteristics) {
      return next(new ServerError());
    }
    characteristics.forEach((characteristic) => {
      if (!response[characteristic.type]) {
        response[characteristic.type] = [];
      }
      response[characteristic.type].push(characteristic.describe);
    });
    res.send(response);
  } catch (err) {
    next(new ServerError('cannot get contest preferences'));
  }
};

module.exports.getContestById = async (req, res, next) => {
  const {
    params: { contestId },
    tokenData: { userId, role },
  } = req;

  try {
    const offerWhere = {};
    if (role === CONSTANTS.CREATOR) {
      offerWhere.userId = userId;
    } else if (role === CONSTANTS.CUSTOMER) {
      offerWhere.status = 'approved';
    } else if (role === CONSTANTS.MODERATOR) {
    }

    let contestInfo = await db.Contests.findOne({
      where: { id: contestId },
      order: [[db.Offers, 'id', 'asc']],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: {
            exclude: ['password', 'role', 'balance', 'accessToken'],
          },
        },
        {
          model: db.Offers,
          required: false,
          where: offerWhere,
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: {
                exclude: ['password', 'role', 'balance', 'accessToken'],
              },
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });
    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach((offer) => {
      if (offer.Rating) {
        offer.mark = offer.Rating.mark;
      }
      delete offer.Rating;
    });
    res.send(contestInfo);
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
  if (req.file) {
    req.body.fileName = req.file.filename;
    req.body.originalFileName = req.file.originalname;
  }

  const contestId = req.params.contestId;

  try {
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId: req.tokenData.userId,
    });
    res.send(updatedContest);
  } catch (e) {
    next(e);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const obj = {};
  if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
    obj.fileName = req.file.filename;
    obj.originalFileName = req.file.originalname;
  } else {
    obj.text = req.body.offerData;
  }
  obj.userId = req.tokenData.userId;

  obj.contestId = req.params.contestId;

  try {
    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    controller
      .getNotificationController()
      .emitEntryCreated(req.body.customerId);
    const User = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.send(Object.assign({}, result, { User }));
  } catch (e) {
    return next(new ServerError());
  }
};

module.exports.getCustomersContests = (req, res, next) => {
  const {
    query: { contestStatus: status, limit, offset },
    tokenData: { userId },
  } = req;

  const requiredOfferStatus = 'approved';

  db.Contests.findAll({
    where: { status, userId },
    limit,
    offset: offset ? offset : 0,
    order: [['id', 'DESC']],

    attributes: [
      ...Object.keys(db.Contests.rawAttributes),
      [
        db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM "Offers" AS "o"
            WHERE
              "o"."contestId" = "Contests"."id" AND
              "o"."status" = '${requiredOfferStatus}'
          )`),
        'count',
      ],
    ],
  })
    .then((contests) => {
      let haveMore = true;
      if (contests.length === 0 || contests.length < limit) {
        haveMore = false;
      }

      res.send({ contests, haveMore });
    })
    .catch((err) => next(new ServerError(err)));
};

module.exports.getContests = (req, res, next) => {
  const predicates = UtilFunctions.createWhereForAllContests(
    req.query.typeIndex,
    req.query.contestId,
    req.query.industry,
    req.query.awardSort
  );
  db.Contests.findAll({
    where: predicates.where,
    order: predicates.order,
    limit: Number(req.query.limit) || 10,
    offset: Number(req.query.offset) || 0,
    include: [
      {
        model: db.Offers,
        required: req.query.ownEntries === 'true',
        where:
          req.query.ownEntries === 'true'
            ? { userId: req.tokenData.userId }
            : {},
        attributes: ['id'],
      },
    ],
  })
    .then((contests) => {
      contests.forEach(
        (contest) =>
          (contest.dataValues.count = contest.dataValues.Offers.length)
      );
      let haveMore = true;
      if (contests.length === 0) {
        haveMore = false;
      }
      res.send({ contests, haveMore });
    })
    .catch((err) => {
      console.error(err);
      next(new ServerError());
    });
};
