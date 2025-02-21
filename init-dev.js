#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;

// Configuration template
const envTemplate = `DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
SESSION_SECRET=development-secret-key
NODE_ENV=development
PORT=5000
VITE_API_URL=http://localhost:5000/api
`;

async function initializeProject() {
  console.log('🚀 Initializing Web Portfolio Creator development environment...\n');

  // Create .env file if it doesn't exist
  if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file...');
    fs.writeFileSync('.env', envTemplate);
    console.log('✅ Created .env file');
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error);
    process.exit(1);
  }

  // Load environment variables
  console.log('\n🔧 Loading environment variables...');
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch (error) {
    console.error('❌ Failed to load environment variables:', error);
    process.exit(1);
  }

  // Create database if it doesn't exist
  console.log('\n🔍 Setting up database...');
  try {
    // Connect to postgres database to create our app database
    const mainPool = new Pool({
      connectionString: 'postgresql://user:password@localhost:5432/postgres'
    });

    // Check if database exists
    const { rows } = await mainPool.query(`
      SELECT datname FROM pg_database WHERE datname = 'portfolio_db'
    `);

    // Create database if it doesn't exist
    if (rows.length === 0) {
      console.log('Creating database...');
      await mainPool.query('CREATE DATABASE portfolio_db');
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }

    await mainPool.end();

    // Now connect to our app database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/portfolio_db',
    });

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Run migrations
    console.log('\n🔄 Running database migrations...');
    execSync('npm run migrate:up', { stdio: 'inherit' });
    console.log('✅ Migrations completed');

    // Ask if user wants to seed demo data
    const readline = (await import('readline')).createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('\n❓ Would you like to seed demo data? (y/N) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('\n🌱 Seeding demo data...');
        try {
          execSync('npm run db:seed', { stdio: 'inherit' });
          console.log('✅ Demo data seeded');
        } catch (error) {
          console.error('❌ Failed to seed demo data:', error);
        }
      }

      console.log('\n🎉 Development environment setup complete!');
      console.log('\nNext steps:');
      console.log('1. Review and update .env file with your database credentials');
      console.log('2. Start the development server: npm run dev');
      console.log('3. Start the API server: npm start');
      console.log('\nHappy coding! 🚀');

      readline.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('\n⚠️ Please check your database configuration in .env file');
    process.exit(1);
  }
}

// Check if running as script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeProject().catch(error => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
}

export default initializeProject;
