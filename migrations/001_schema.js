exports.up = (pgm) => {
  pgm.createTable('messages', {
    id: 'id',
    content: { type: 'text', notNull: true },
    room: { type: 'varchar(100)', default: '' },
    username: { type: 'varchar(100)', default: '' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('messages');
};