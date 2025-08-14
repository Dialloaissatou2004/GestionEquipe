module.exports = (schema) => (req, res, next) => {
  const payload = Object.assign({}, req.body);
  const { error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
