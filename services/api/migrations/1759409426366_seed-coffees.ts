import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `insert into coffees (name, price, description, image) values 
    ('Americano', 18000, 'Espresso diluted with hot water, resulting in a lighter body while keeping the bold espresso flavor.', 'https://example.com/americano.webdl'),
    ('Espresso', 15000, 'A concentrated coffee brewed under high pressure, usually served in a small cup.', 'https://example.com/espresso.webdl'),
    ('Cappuccino', 22000, 'A balanced mix of espresso, steamed milk, and milk foam, creating a creamy and smooth taste.', 'https://example.com/cappuccino.webdl'),
    ('Latte', 25000, 'Espresso combined with more steamed milk and a thin layer of foam, creamier than cappuccino.', 'https://example.com/latte.webdl'),
    ('Mocha', 28000, 'A blend of espresso, chocolate, steamed milk, and topped with whipped cream — perfect for sweet coffee lovers.', 'https://example.com/mocha.webdl'),
    ('Flat White', 25000, 'Similar to a latte but with a smoother milk texture and thin microfoam on top.', 'https://example.com/flat-white.wwebdl'),
    ('Macchiato', 20000, 'Espresso topped with a small amount of milk foam, stronger than cappuccino.', 'https://example.com/macchiato.webdl'),
    ('Cortado', 22000, 'Equal parts of espresso and warm milk, allowing the coffee flavor to remain dominant.', 'https://example.com/cortado.webdl'),
    ('Affogato', 28000, 'A scoop of vanilla ice cream topped with a shot of hot espresso — a sweet and bitter contrast.', 'https://example.com/affogato.webdl'),
    ('Cold Brew', 25000, 'Coffee brewed with cold water for 12–24 hours, resulting in a smooth, refreshing, and less acidic taste.', 'https://example.com/cold-brew.webdl');`
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `delete from coffees where name in 
    ('Americano', 'Espresso', 'Cappuccino', 'Latte' 'Mocha', 'Flat White', 'Macchiato', 'Cortado', 'Affogato', 'Cold Brew');`
  );
}
