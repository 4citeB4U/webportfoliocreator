import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
const { Pool } = pg;

// ES module dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration(direction = 'up') {
  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query('BEGIN');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations ORDER BY id ASC'
    );
    const executedMigrationNames = executedMigrations.map(row => row.name);

    // Get all migration files
    const migrationFiles = await fs.readdir(__dirname);
    const migrations = migrationFiles
      .filter(file => file.endsWith(`_${direction}.sql`))
      .sort();

    if (direction === 'down') {
      migrations.reverse();
    }

    for (const migrationFile of migrations) {
      const baseName = migrationFile.replace(`_${direction}.sql`, '');

      // Skip if migration already executed (for 'up') or not executed (for 'down')
      if (direction === 'up' && executedMigrationNames.includes(baseName)) {
        console.log(`Migration ${baseName} already executed, skipping...`);
        continue;
      }
      if (direction === 'down' && !executedMigrationNames.includes(baseName)) {
        console.log(`Migration ${baseName} not executed, skipping...`);
        continue;
      }

      // Read and execute migration
      console.log(`Running ${direction} migration: ${migrationFile}`);
      const sql = await fs.readFile(
        path.join(__dirname, migrationFile),
        'utf-8'
      );

      await client.query(sql);

      // Record migration execution or removal
      if (direction === 'up') {
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [baseName]
        );
      } else {
        await client.query(
          'DELETE FROM migrations WHERE name = $1',
          [baseName]
        );
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Migrations completed successfully');
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Get migration direction from command line argument
const direction = process.argv[2];
if (!['up', 'down'].includes(direction)) {
  console.error('Please specify migration direction: up or down');
  process.exit(1);
}

runMigration(direction).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
