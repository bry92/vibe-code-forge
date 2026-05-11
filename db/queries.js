// Parameterized SQL queries — all database access goes through this module

module.exports = function(pool) {
  return {
    async getAll() {
      const { rows } = await pool.query('SELECT * FROM bookmarks ORDER BY created_at DESC');
      return rows;
    },
    async create(title, url, tag) {
      const { rows } = await pool.query(
        'INSERT INTO bookmarks (title, url, tag) VALUES ($1, $2, $3) RETURNING *',
        [title, url, (tag || '').trim()]
      );
      return rows[0];
    },
    async deleteById(id) {
      await pool.query('DELETE FROM bookmarks WHERE id = $1', [id]);
    }
  };
};