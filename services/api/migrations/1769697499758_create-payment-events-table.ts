import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('payment_events', {
    id: 'id',
    payment_id: {
      type: 'integer',
      notNull: true,
      references: 'payments',
      onDelete: 'CASCADE',
    },
    event_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    payload: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('payment_events', 'payment_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('payment_events', 'payment_id');
  pgm.dropTable('payment_events');
}
