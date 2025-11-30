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
    expires_at: {
      type: 'timestamp',
      notNull: false,
    },
  });
  pgm.createIndex('verification_tokens', 'user_id');
  pgm.createIndex('verification_tokens', 'token');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('verification_tokens');
}
