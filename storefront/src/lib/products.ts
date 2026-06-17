import { supabase } from './supabase';
import type { Product, ProductCategory, SortOption } from './types';

// ── Fetch all products with optional filters ─────────────────
export async function getProducts({
  category,
  search,
  sort = 'featured',
}: {
  category?: ProductCategory;
  search?: string;
  sort?: SortOption;
} = {}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default:
      // featured first, then by created_at
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

// ── Fetch single product by ID ───────────────────────────────
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

// ── Fetch single product by slug ─────────────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Product;
}

// ── Featured products (homepage) ─────────────────────────────
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(3);

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

// ── Best sellers ─────────────────────────────────────────────
export async function getBestSellers(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('review_count', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}
