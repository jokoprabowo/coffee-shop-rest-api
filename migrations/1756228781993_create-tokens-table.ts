import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('refresh_tokens', {
    id: 'id',
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
    device_info: {
      type: 'text',
      notNull: false,
    },
    ip_address: {
      type: 'varchar(45)',
      notNull: false,
    },
    is_revoked: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    expires_at: {
      type: 'timestamp',
      notNull: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });
  pgm.createIndex('refresh_tokens', 'user_id');
  pgm.createIndex('refresh_tokens', 'token');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('refresh_tokens');
}
