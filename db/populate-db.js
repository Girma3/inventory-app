import pkg from "pg";
import dotenv from "dotenv";
const { Client } = pkg;
dotenv.config();

const CATEGORY = `
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO categories (category_name) 
VALUES 
    ('Strength Equipment'),
    ('Yoga'),
    ('Sport Nutrition')
ON CONFLICT DO NOTHING;
`;

const ITEMS = `
CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    item_price DECIMAL(10, 2),
    item_image_url TEXT,
    item_category_id INTEGER,
    CONSTRAINT fk_category
        FOREIGN KEY(item_category_id) REFERENCES categories(category_id)
);

INSERT INTO items (item_name, item_description, item_price, item_image_url, item_category_id) 
VALUES 
    ('Barbell', 'Standard 20kg barbell', 150.00, '/images/barbell.jpg', 1)
ON CONFLICT DO NOTHING;
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Seeding...");
    await client.connect();
    await client.query(CATEGORY);
    await client.query(ITEMS);
    console.log("Done");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

main();
