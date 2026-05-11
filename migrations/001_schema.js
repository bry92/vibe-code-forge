exports.up = (pgm) => {
  pgm.createTable('items', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', default: '' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('items');
};