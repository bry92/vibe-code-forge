const { Router } = require('express');

module.exports = function(pool) {
  const router = Router();

  router.get('/messages', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
      res.json({ success: true, messages: rows });
    } catch (err) {
      console.error('GET /messages error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.post('/messages', async (req, res) => {
    try {
      const { content, room, username } = req.body;
      if (!content || !content.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }
      const { rows } = await pool.query(
        'INSERT INTO messages (content, room, username) VALUES ($1, $2, $3) RETURNING *',
        [content.trim(), (room || '').trim(), (username || '').trim()]
      );
      res.status(201).json({ success: true, message: rows[0] });
    } catch (err) {
      console.error('POST /messages error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.delete('/messages/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  return router;
};