module.exports = (req, res, next) => {
  if (!req.tokenData || req.tokenData.role !== 'moderator') {
    return res.status(403).send({ error: 'Access denied' });
  }
  next();
};
