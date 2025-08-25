import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: 'id',
    email: {
      type: 'varchar(100)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'varchar(100)',
      notNull: true,
    },
    fullname: {
      type: 'varchar(100)',
      notNull: true,
    },
    phone: {
      type: 'varchar(100)',
      notNull: true,
    },
    address: {
      type: 'varchar(500)',
      notNull: true,
    },
    role: {
      type: 'varchar(50)',
      notNull: true,
      default: 'customer',
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
  pgm.dropTable('users');
}
