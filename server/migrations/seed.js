import { pool } from '../db.js';

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Seeding demo portfolio data...');

    // Insert a demo portfolio
    const result = await client.query(`
      INSERT INTO portfolios (
        user_id,
        title,
        content,
        is_published,
        settings
      ) VALUES (
        1,
        'Demo Portfolio',
        '{"description": "A showcase of my work"}',
        true,
        '{"theme": "light", "layout": "modern"}'
      ) RETURNING id
    `);

    const demoPortfolioId = result.rows[0].id;

    // Insert some demo components
    const components = [
      {
        type: 'text',
        content: JSON.stringify({
          text: 'Welcome to my portfolio',
          style: {
            fontSize: '24px',
            color: '#333333',
            fontWeight: 'bold'
          }
        }),
        position: JSON.stringify({ x: 20, y: 20 })
      },
      {
        type: 'image',
        content: JSON.stringify({
          src: '/placeholder.jpg',
          alt: 'Project Preview',
          style: {
            width: '300px',
            height: 'auto'
          }
        }),
        position: JSON.stringify({ x: 20, y: 100 })
      },
      {
        type: 'button',
        content: JSON.stringify({
          text: 'Contact Me',
          style: {
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }
        }),
        position: JSON.stringify({ x: 20, y: 400 })
      }
    ];

    // Insert each component
    for (const component of components) {
      await client.query(
        `
        INSERT INTO portfolio_components (
          portfolio_id,
          type,
          content,
          position
        ) VALUES (
          $1, $2, $3, $4
        )
      `,
        [demoPortfolioId, component.type, component.content, component.position]
      );
    }

    await client.query('COMMIT');
    console.log('Seed data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
