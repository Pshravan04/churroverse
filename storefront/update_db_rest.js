const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://obnnapaveybgsrzyozmv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibm5hcGF2ZXliZ3Nyenlvem12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzIyNTAsImV4cCI6MjA5NzI0ODI1MH0.z-fqLKNFdWCJF4QE4hs_JBHdjUp7AcXgHd4aJ9NWYw8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
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
    const { data, error } = await supabase
      .from('products')
      .update({ images: [u.img] })
      .eq('slug', u.slug);

    if (error) {
      console.error(`Error updating ${u.slug}:`, error.message);
    } else {
      console.log(`Updated ${u.slug}`);
    }
  }
}
main().catch(console.error);
