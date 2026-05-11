const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function(pool) {
  const router = Router();
  const SECRET = process.env.JWT_SECRET || 'dev-secret';

  router.post('/signup', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
      const hash = await bcrypt.hash(password, 10);
      const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hash]
      );
      const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: rows[0] });
    } catch (err) { next(err); }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, rows[0].password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: rows[0].id, email: rows[0].email } });
    } catch (err) { next(err); }
  });

  return router;
};