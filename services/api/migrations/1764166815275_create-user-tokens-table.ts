import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('user_tokens', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    type: {
      type: 'text',
      notNull: true,
    },
    token: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    expired_at: {
      type: 'timestamp',
      notNull: false,
    },
    used_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('user_tokens', 'user_id');
  pgm.createIndex('user_tokens', 'token');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('user_tokens');
}
