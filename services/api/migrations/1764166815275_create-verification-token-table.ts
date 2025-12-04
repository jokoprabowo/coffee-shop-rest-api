import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('verification_tokens', {
    id: {
      type: 'id',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
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
    is_used: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('verification_tokens', 'user_id');
  pgm.createIndex('verification_tokens', 'token');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('verification_tokens');
}
