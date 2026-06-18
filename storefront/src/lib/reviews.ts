import { supabase } from './supabase';
import type { Review } from './types';

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  return (data ?? []) as Review[];
}

export async function createReview(input: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Review;
}

export async function getUserReview(productId: string, userId: string): Promise<Review | null> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .maybeSingle();
  return data as Review | null;
}
