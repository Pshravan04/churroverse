const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:aQKG7SSJxWAtWRvf@db.obnnapaveybgsrzyozmv.supabase.co:5432/postgres'
});

async function main() {
  await client.connect();
  const updates = [
    { slug: 'cosmic-churro', img: '/products/classic.png' },
    { slug: 'dark-matter', img: '/products/dark-matter.png' },
    { slug: 'stardust-biscoff', img: '/products/biscoff.png' },
    { slug: 'supernova-matcha', img: '/products/matcha.png' },
    { slug: 'nebula-nutella', img: '/products/nutella.png' },
    { slug: 'solar-strawberry', img: '/products/strawberry.png' },
    { slug: 'orion-oreo', img: '/products/oreo.png' },
    { slug: 'galaxy-caramel', img: '/products/caramel.png' },
  ];

  for (const u of updates) {
    const res = await client.query('UPDATE products SET images = $1 WHERE slug = $2 RETURNING id;', [JSON.stringify([u.img]), u.slug]);
    console.log(`Updated ${u.slug}:`, res.rowCount);
  }
  await client.end();
}
main().catch(console.error);
