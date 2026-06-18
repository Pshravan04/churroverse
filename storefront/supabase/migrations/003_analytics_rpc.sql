-- ============================================================
-- CHURROVERSE — Analytics RPC (runs in-database, fast)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  WITH revenue_stats AS (
    SELECT
      COALESCE(SUM(total), 0) AS total_revenue,
      COUNT(*)                AS total_orders,
      COALESCE(AVG(total), 0)::INTEGER AS avg_order_value
    FROM public.orders
  ),
  order_counts AS (
    SELECT
      COUNT(*) AS total
    FROM public.orders
  ),
  product_counts AS (
    SELECT
      COUNT(*) AS total
    FROM public.products
  ),
  user_counts AS (
    SELECT
      COUNT(DISTINCT user_id) AS total
    FROM public.orders
  ),
  revenue_by_day AS (
    SELECT
      created_at::DATE AS date,
      SUM(total)       AS revenue
    FROM public.orders
    GROUP BY created_at::DATE
    ORDER BY date DESC
    LIMIT 14
  ),
  orders_by_status AS (
    SELECT
      status,
      COUNT(*) AS count
    FROM public.orders
    GROUP BY status
  ),
  top_products AS (
    SELECT
      oi.product_id,
      p.name,
      p.emoji,
      p.price,
      SUM(oi.quantity)::INTEGER AS total_sold
    FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    GROUP BY oi.product_id, p.name, p.emoji, p.price
    ORDER BY total_sold DESC
    LIMIT 10
  )
  SELECT json_build_object(
    'totalRevenue',    (SELECT total_revenue FROM revenue_stats),
    'totalOrders',     (SELECT total_orders FROM revenue_stats),
    'totalProducts',   (SELECT total FROM product_counts),
    'totalUsers',      (SELECT total FROM user_counts),
    'averageOrderValue', (SELECT avg_order_value FROM revenue_stats),
    'revenueByDay',    (SELECT json_agg(json_build_object('date', date::TEXT, 'revenue', revenue)) FROM revenue_by_day),
    'ordersByStatus',  (SELECT json_agg(json_build_object('status', status, 'count', count)) FROM orders_by_status),
    'topProducts',     (SELECT json_agg(json_build_object('product_id', product_id, 'name', name, 'emoji', emoji, 'price', price, 'total_sold', total_sold)) FROM top_products)
  ) INTO result;

  -- Handle null aggregates when there's no data
  IF result IS NULL THEN
    result := json_build_object(
      'totalRevenue', 0,
      'totalOrders', 0,
      'totalProducts', (SELECT total FROM product_counts),
      'totalUsers', 0,
      'averageOrderValue', 0,
      'revenueByDay', '[]'::JSON,
      'ordersByStatus', '[]'::JSON,
      'topProducts', '[]'::JSON
    );
  END IF;

  RETURN result;
END;
$$;
