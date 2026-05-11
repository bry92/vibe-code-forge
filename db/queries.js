// Parameterized SQL queries — all database access goes through this module

module.exports = function(pool) {
  return {
    async getAll() {
      const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
      return rows;
    },
    async create(content, room, username) {
      const { rows } = await pool.query(
        'INSERT INTO messages (content, room, username) VALUES ($1, $2, $3) RETURNING *',
        [content, (room || '').trim(), (username || '').trim()]
      );
      return rows[0];
    },
    async deleteById(id) {
      await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    }
  };
};