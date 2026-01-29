import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('payment_events', {
    id: 'id',
    order_id: {
      type: 'integer',
      notNull: true,
      references: 'orders',
      onDelete: 'CASCADE',
    },
    transaction_status: {
      type: 'varchar(50)',
      notNull: true,
    },
    transaction_id: {
      type: 'varchar(100)',
      notNull: true,
    },
    payload_hash: {
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

  pgm.createIndex('payment_events', 'order_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('payment_events', 'order_id');
  pgm.dropTable('payment_events');
}
