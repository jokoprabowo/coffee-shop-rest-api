import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('cart_items', {
    id: 'id',
    cart_id: {
      type: 'integer',
      notNull: true,
      references: 'carts',
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

  pgm.createIndex('cart_items', 'cart_id');
  pgm.createIndex('cart_items', 'coffee_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('cart_items', 'cart_id');
  pgm.dropIndex('cart_items', 'coffee_id');
  pgm.dropTable('cart_items');
}
