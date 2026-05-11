const { Router } = require('express');

module.exports = function(pool) {
  const router = Router();

  router.get('/bookmarks', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM bookmarks ORDER BY created_at DESC');
      res.json({ success: true, bookmarks: rows });
    } catch (err) {
      console.error('GET /bookmarks error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.post('/bookmarks', async (req, res) => {
    try {
      const { title, url, tag } = req.body;
      if (!title || !title.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Title is required' });
      }
      if (!url || !url.toString().trim()) {
        return res.status(400).json({ success: false, message: 'URL is required' });
      }
      const { rows } = await pool.query(
        'INSERT INTO bookmarks (title, url, tag) VALUES ($1, $2, $3) RETURNING *',
        [title.trim(), url.trim(), (tag || '').trim()]
      );
      res.status(201).json({ success: true, bookmark: rows[0] });
    } catch (err) {
      console.error('POST /bookmarks error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.delete('/bookmarks/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM bookmarks WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  return router;
};