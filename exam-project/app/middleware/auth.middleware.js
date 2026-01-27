const jwt = require('jsonwebtoken');
const JWT_SECRET = "exam-project"

// Reads Bearer token, sets req.user
const authenticate = (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = hdr.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });

    req.user = { username: payload.username };
    next();
  } catch {
    return res.sendStatus(401);
  }
};

module.exports = authenticate;