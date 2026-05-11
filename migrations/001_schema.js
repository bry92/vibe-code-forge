exports.up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    url: { type: 'text', notNull: true },
    tag: { type: 'varchar(50)', default: '' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('bookmarks');
};