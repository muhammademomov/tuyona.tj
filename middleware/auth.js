const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
             || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Нет токена авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};
