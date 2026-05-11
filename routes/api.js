const { Router } = require('express');

module.exports = function(pool) {
  const router = Router();

  router.get('/items', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
      res.json({ success: true, items: rows });
    } catch (err) {
      console.error('GET /items error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.post('/items', async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name || !name.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }
      const { rows } = await pool.query(
        'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
        [name.trim(), (description || '').trim()]
      );
      res.status(201).json({ success: true, item: rows[0] });
    } catch (err) {
      console.error('POST /items error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.delete('/items/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  return router;
};