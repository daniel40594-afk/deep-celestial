const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createAdmin() {
    const email = 'test@test.com';
    const password = 'Test123@123';

    try {
        console.log(`Creating admin account: ${email}`);
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
      INSERT INTO users (email, password_hash, role, status)
      VALUES ($1, $2, 'admin', 'approved')
      ON CONFLICT (email) 
      DO UPDATE SET role = 'admin', status = 'approved', password_hash = $2
      RETURNING id, email, role, status;
    `;

        const res = await pool.query(query, [email, hashedPassword]);
        console.log('Success! Admin account details:', res.rows[0]);
        console.log('Password:', password);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await pool.end();
    }
}

createAdmin();
