// Parameterized SQL queries — all database access goes through this module

module.exports = function(pool) {
  return {
    async getAll() {
      const { rows } = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
      return rows;
    },
    async create(name, description) {
      const { rows } = await pool.query(
        'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
        [name, (description || '').trim()]
      );
      return rows[0];
    },
    async deleteById(id) {
      await pool.query('DELETE FROM items WHERE id = $1', [id]);
    }
  };
};