const schems = require('../validationSchemes/schems');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.validateRegistrationData = async (req, res, next) => {
  const validationResult = await schems.registrationSchem.isValid(req.body);
  if (!validationResult) {
    return next(new BadRequestError('Invalid data for registration'));
  } else {
    next();
  }
};

module.exports.validateLogin = async (req, res, next) => {
  const validationResult = await schems.loginSchem.isValid(req.body);
  if (validationResult) {
    next();
  } else {
    return next(new BadRequestError('Invalid data for login'));
  }
};

module.exports.validateContestCreation = (req, res, next) => {
  const contests = req?.body?.contests;
  if (!Array.isArray(contests)) {
    return next(
      new BadRequestError('Invalid request: contests must be an array')
    );
  }
  if (contests.length === 0) {
    return next(
      new BadRequestError('Invalid request: contests array must not be empty')
    );
  }

  const validations = contests.map((el) =>
    schems.contestSchem.validate(el, { abortEarly: false }).then(
      () => ({ ok: true }),
      (err) => ({ ok: false, errors: err.errors || [err.message] })
    )
  );

  return Promise.all(validations)
    .then((results) => {
      const failed = results
        .map((r, i) => ({ r, i }))
        .filter((x) => !x.r.ok)
        .map((x) => ({ index: x.i, errors: x.r.errors }));

      if (failed.length > 0) {
        const details = failed
          .map((f) => `index ${f.index}: ${f.errors.join('; ')}`)
          .join(' | ');
        return next(
          new BadRequestError(`Invalid contest data in payload: ${details}`)
        );
      }
      next();
    })
    .catch((err) => next(err));
};
