import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('payments', {
    id: 'id',
    order_id: {
      type: 'integer',
      notNull: true,
      references: 'orders',
      onDelete: 'CASCADE',
    },
    provider: {
      type: 'varchar(50)',
      notNull: true,
      default: 'Midtrans',
    },
    payment_type: {
      type: 'varchar(50)',
      notNull: false,
    },
    token: {
      type: 'varchar(100)',
      notNull: true,
      unique: true,
    },
    transaction_status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'pending',
    },
    amount: {
      type: 'integer',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('payments', 'order_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('payments', 'order_id');
  pgm.dropTable('payments');
}
