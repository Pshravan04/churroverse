import { supabase } from './supabase';
import type { Address } from './types';

export async function getAddresses(userId: string): Promise<Address[]> {
  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  return (data ?? []) as Address[];
}

export async function createAddress(input: Partial<Address>) {
  const { data, error } = await supabase
    .from('addresses')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Address;
}

export async function updateAddress(id: string, input: Partial<Address>) {
  const { data, error } = await supabase
    .from('addresses')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Address;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function setDefaultAddress(userId: string, id: string) {
  await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  await supabase.from('addresses').update({ is_default: true }).eq('id', id);
}
