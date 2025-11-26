import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('coffees', {
    id: 'id',
    name: {
      type: 'varchar(50)',
      notNull: true,
    },
    price: {
      type: 'integer',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    image: {
      type: 'varchar(50)',
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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('coffees');
}
