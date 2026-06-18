import { supabase } from './supabase';
import type { TrackingEvent } from './types';

export async function getTrackingEvents(orderId: string): Promise<TrackingEvent[]> {
  const { data } = await supabase
    .from('tracking_events')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  return (data ?? []) as TrackingEvent[];
}

export async function addTrackingEvent(input: Partial<TrackingEvent>) {
  const { error } = await supabase.from('tracking_events').insert(input);
  if (error) throw new Error(error.message);
}
