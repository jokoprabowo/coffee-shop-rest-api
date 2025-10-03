import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('order_items', {
    id: 'id',
    order_id: {
      type: 'integer',
      notNull: true,
      references: 'orders',
      onDelete: 'CASCADE',
    },
    coffee_id: {
      type: 'integer',
      notNull: true,
      references: 'coffees',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: 'integer',
      notNull: true,
    },
    unit_price: {
      type:'integer',
      notNull: true,
    },
    total_price: {
      type: 'integer',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('order_items', 'order_id');
  pgm.createIndex('order_items', 'coffee_id');  
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('order_items', 'order_id');
  pgm.dropIndex('order_items', 'coffee_id');
  pgm.dropTable('order_items');
}
