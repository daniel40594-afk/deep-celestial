const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

const seedAdminQuery = `
  INSERT INTO users (email, password_hash, role, status)
  VALUES ('admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin', 'approved')
  ON CONFLICT (email) DO NOTHING;
`;

async function setup() {
    try {
        console.log('Creating users table...');
        await pool.query(createTableQuery);
        console.log('Table created successfully.');

        // Optional: Seed admin (would need a real hash)
        // await pool.query(seedAdminQuery);

    } catch (error) {
        console.error('Error setup database:', error);
    } finally {
        await pool.end();
    }
}

setup();
