-- ============================================================
-- CHURROVERSE — Full Product Catalog
-- Replaces old seed data with real menu items.
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Clear old seed data (order_items reference products, so delete first)
DELETE FROM public.order_items;
DELETE FROM public.cart_items;
DELETE FROM public.wishlists;
DELETE FROM public.reviews;
DELETE FROM public.reward_transactions;
DELETE FROM public.tracking_events;
DELETE FROM public.orders;
DELETE FROM public.products;

INSERT INTO public.products (slug, name, description, long_desc, price, compare_price, category, emoji, stock, rating, review_count, tag, featured, metadata)
VALUES

-- ============================================================
-- MILKY WAY SHAKES (₹120 / ₹200 for Matcha)
-- ============================================================
('sunset-mango-shake',     'Sunset Mango',     'Creamy mango shake blended with tropical sunshine.',                    NULL, 12000, NULL, 'shake', '🥭', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"shake"}'),
('mocha-mambo-shake',      'Mocha Mambo',      'Espresso meets chocolate in a cosmic dance of flavour.',                 NULL, 12000, NULL, 'shake', '☕', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"shake"}'),
('tempting-chocolate-shake','Tempting Chocolate','Rich chocolate shake that hits every craving.',                           NULL, 12000, NULL, 'shake', '🍫', 100, 4.5, 0, NULL, FALSE, '{"planet":"chocolate","subcategory":"shake"}'),
('smooth-banana-shake',    'Smooth Banana',    'Silky banana shake with a hint of vanilla.',                              NULL, 12000, NULL, 'shake', '🍌', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"shake"}'),
('brownie-heaven-shake',   'Brownie Heaven',   'Fudge brownie chunks swirled into creamy chocolate shake.',               NULL, 12000, NULL, 'shake', '🤎', 100, 4.5, 0, NULL, FALSE, '{"planet":"chocolate","subcategory":"shake"}'),
('oreo-cookie-shake',      'Oreo Cookie',      'Crushed Oreo cookies blended into a dreamy shake.',                       NULL, 12000, NULL, 'shake', '🍪', 100, 4.5, 0, 'Best Seller', TRUE, '{"planet":"nebula","subcategory":"shake"}'),
('nutella-chocolate-shake','Nutella Chocolate','Hazelnut-chocolate bliss in every sip.',                                  NULL, 12000, NULL, 'shake', '🌰', 100, 4.5, 0, NULL, FALSE, '{"planet":"chocolate","subcategory":"shake"}'),
('kitkat-munch-shake',     'Kitkat Munch',     'Crunchy Kitkat pieces in a silky chocolate base.',                        NULL, 12000, NULL, 'shake', '🍫', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"shake"}'),
('galactic-matcha-shake',  'Galactic Matcha',  'Premium Japanese matcha whisked into a creamy signature shake.',          NULL, 20000, NULL, 'shake', '🍵', 100, 4.5, 0, 'Premium', FALSE, '{"planet":"matcha","subcategory":"shake"}'),

-- ============================================================
-- ICED TEA NEBULA (₹100 / ₹120 for premium)
-- ============================================================
('lychee-nebula-tea',      'Lychee Nebula',    'Floral lychee iced tea with a hint of rose.',                             NULL, 10000, NULL, 'iced-tea', '🫐', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('peachy-planet-tea',      'Peachy Planet',    'Sun-ripened peach iced tea, refreshingly sweet.',                         NULL, 10000, NULL, 'iced-tea', '🍑', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('orange-meteor-tea',       'Orange Meteor',    'Zesty orange iced tea with a citrus meteor kick.',                        NULL, 10000, NULL, 'iced-tea', '🍊', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('lemon-orbit-tea',        'Lemon Orbit',      'Classic lemon iced tea, refreshing and bright.',                          NULL, 10000, NULL, 'iced-tea', '🍋', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('passion-comet-tea',      'Passion Comet',    'Tropical passion fruit iced tea with a tangy comet tail.',                NULL, 10000, NULL, 'iced-tea', '💜', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('green-apple-galaxy-tea', 'Green Apple Galaxy','Crisp green apple iced tea with a galaxy of flavour.',                   NULL, 10000, NULL, 'iced-tea', '🍏', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('mango-sunset-tea',       'Mango Sunset',     'Sweet mango iced tea that tastes like a sunset.',                         NULL, 10000, NULL, 'iced-tea', '🥭', 100, 4.5, 0, NULL, FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('strawberry-stardust-tea','Strawberry Stardust','Strawberry iced tea sprinkled with stardust sweetness.',                NULL, 10000, NULL, 'iced-tea', '🍓', 100, 4.5, 0, NULL, FALSE, '{"planet":"berry","subcategory":"iced-tea"}'),
('guava-spice-tea',        'Guava Spice',      'Guava iced tea with a warm spice finish.',                               NULL, 12000, NULL, 'iced-tea', '🫒', 100, 4.5, 0, 'Premium', FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),
('pineapple-spice-tea',    'Pineapple Spice',  'Pineapple iced tea kissed with aromatic spices.',                        NULL, 12000, NULL, 'iced-tea', '🍍', 100, 4.5, 0, 'Premium', FALSE, '{"planet":"nebula","subcategory":"iced-tea"}'),

-- ============================================================
-- CHURRO GALAXY
-- ============================================================
('churros-for-one',  'Churros For One',  '3 crispy churros + 1 dip of your choice. Solo adventure.',        NULL, 15000, NULL, 'churro', '🌀', 100, 4.5, 0, NULL, FALSE, '{"planet":"churro","subcategory":"churro"}'),
('churros-for-two',  'Churros For Two',  '6 crispy churros + 2 dips. Perfect duo mission.',                  NULL, 25000, NULL, 'churro', '🌀', 100, 4.5, 0, NULL, FALSE, '{"planet":"churro","subcategory":"churro"}'),
('churro-fiesta',    'Churro Fiesta',    '12 crispy churros + 3 dips. Family space trip!',                   NULL, 40000, NULL, 'churro', '🎉', 100, 4.5, 0, 'Best Seller', TRUE, '{"planet":"churro","subcategory":"churro"}'),
('project-kids',     'Project Kids',     '3 churros + marshmallows + white chocolate sauce. Kids'' collection.',NULL, 15000, NULL, 'churro', '🧒', 100, 4.5, 0, NULL, FALSE, '{"planet":"churro","subcategory":"churro"}'),

-- Churro Fillers (₹140)
('oreo-luscious',    'Oreo-Luscious',    'Churro loaded with crushed Oreo and creamy filling.',              NULL, 14000, NULL, 'churro', '🪐', 100, 4.5, 0, NULL, FALSE, '{"planet":"churro","subcategory":"filler"}'),
('gems-filler',      'Gems',             'Colourful Gems-studded churro with chocolate drizzle.',            NULL, 14000, NULL, 'churro', '💎', 100, 4.5, 0, NULL, FALSE, '{"planet":"churro","subcategory":"filler"}'),
('lux-biscoff',      'Lux Biscoff',      'Belgian Biscoff cream stuffed churro, dusted with crumble.',       NULL, 14000, NULL, 'churro', '⭐', 100, 4.5, 0, 'Fan Fav', FALSE, '{"planet":"biscoff","subcategory":"filler"}'),
('nutty-delight',    'Nutty Delight',    'Nutella and hazelnut chunks in a warm churro shell.',              NULL, 14000, NULL, 'churro', '🥜', 100, 4.5, 0, NULL, FALSE, '{"planet":"churro","subcategory":"filler"}'),

-- Cupid Churros (₹160)
('cupid-churros',    'Cupid Churros',    '2 heart-shaped churros + chocolate dip. Valentine''s special.',    NULL, 16000, NULL, 'churro', '💘', 100, 4.5, 0, 'Limited', FALSE, '{"planet":"churro","subcategory":"cupid"}'),

-- Galactic Churro Box (₹499)
('galactic-churro-box','Galactic Churro Box','Chunks of churros topped with seasonal fruits and Nutella.',     NULL, 49900, NULL, 'churro', '🎁', 100, 4.5, 0, 'Signature', TRUE, '{"planet":"churro","subcategory":"box"}'),

-- ============================================================
-- INTERSTELLAR WAFFLES
-- ============================================================
('dark-matter-waffle',       'Dark Matter',       'Dark chocolate waffle with a rich cocoa kick.',              NULL, 13000, NULL, 'waffle', '🖤', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"classic"}'),
('white-dream-waffle',       'White Dream',       'White chocolate waffle, smooth and dreamy.',                 NULL, 13000, NULL, 'waffle', '🤍', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"classic"}'),
('milk-chocolate-waffle',    'Milk Chocolate',    'Classic milk chocolate waffle, pure comfort.',               NULL, 13000, NULL, 'waffle', '🍫', 100, 4.5, 0, NULL, FALSE, '{"planet":"chocolate","subcategory":"classic"}'),
('kids-gems-waffle',         'Kids'' Gems',       'Colourful Gems-topped waffle for little astronauts.',        NULL, 13000, NULL, 'waffle', '🌈', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"classic"}'),
('oreo-meteor-waffle',       'Oreo Meteor',       'Crushed Oreo meteor shower on a crispy waffle.',             NULL, 13000, NULL, 'waffle', '🌑', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"classic"}'),
('nutella-swirl-waffle',     'Nutella Swirl',     'Warm Nutella swirl on a golden waffle.',                     NULL, 15000, NULL, 'waffle', '🌰', 100, 4.5, 0, 'Best Seller', TRUE, '{"planet":"chocolate","subcategory":"classic"}'),
('intra-red-velvet-waffle',  'Intra-Red Velvet',  'Red velvet waffle with cream cheese glaze.',                 NULL, 15000, NULL, 'waffle', '❤️', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"classic"}'),
('planet-3x-layer-waffle',   'Planet-3X Layer',   'Triple-layer waffle stacked with decadent toppings.',        NULL, 16000, NULL, 'waffle', '🌍', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"premium"}'),
('matcha-mist-waffle',       'Matcha Mist',       'Japanese matcha waffle dusted with powdered stardust.',      NULL, 16000, NULL, 'waffle', '🍵', 100, 4.5, 0, NULL, FALSE, '{"planet":"matcha","subcategory":"premium"}'),
('almond-crunch-waffle',     'Almond Crunch',     'Crispy almond-studded waffle with honey drizzle.',           NULL, 18000, NULL, 'waffle', '🥜', 100, 4.5, 0, 'Premium', FALSE, '{"planet":"waffle","subcategory":"premium"}'),
('kunafa-krust-waffle',      'Kunafa Krust',      'Kunafa-inspired waffle with shredded phyllo and cheese.',    NULL, 18000, NULL, 'waffle', '🧀', 100, 4.5, 0, 'Premium', FALSE, '{"planet":"waffle","subcategory":"premium"}'),

-- Cheesecake Waffles (₹160)
('original-cheesecake-waffle',  'Original Cheesecake',  'Classic cheesecake waffle with creamy tang.',           NULL, 16000, NULL, 'waffle', '🧁', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"cheesecake"}'),
('mango-cheesecake-waffle',     'Mango Cheesecake',     'Mango-infused cheesecake waffle, tropical bliss.',      NULL, 16000, NULL, 'waffle', '🥭', 100, 4.5, 0, NULL, FALSE, '{"planet":"waffle","subcategory":"cheesecake"}'),
('biscoff-cheesecake-waffle',   'Biscoff Cheesecake',   'Biscoff cookie butter meets cheesecake waffle.',        NULL, 16000, NULL, 'waffle', '⭐', 100, 4.5, 0, NULL, FALSE, '{"planet":"biscoff","subcategory":"cheesecake"}'),
('nutella-cheesecake-waffle',   'Nutella Cheesecake',   'Hazelnut chocolate bliss meets cheesecake waffle.',     NULL, 16000, NULL, 'waffle', '🌰', 100, 4.5, 0, NULL, FALSE, '{"planet":"chocolate","subcategory":"cheesecake"}'),
('strawberry-cheesecake-waffle','Strawberry Cheesecake', 'Fresh strawberry cheesecake waffle, berrylicious.',     NULL, 16000, NULL, 'waffle', '🍓', 100, 4.5, 0, NULL, FALSE, '{"planet":"berry","subcategory":"cheesecake"}'),
('blueberry-cheesecake-waffle', 'Blueberry Cheesecake',  'Blueberry-swirled cheesecake waffle, bursting.',       NULL, 16000, NULL, 'waffle', '🫐', 100, 4.5, 0, NULL, FALSE, '{"planet":"berry","subcategory":"cheesecake"}'),

-- ============================================================
-- INTERGALACTIC MUNCHIES
-- ============================================================
('galactic-fries',        'Galactic Fries',        'Crispy golden fries seasoned with cosmic salt.',            NULL, 10000, NULL, 'munchies', '🍟', 100, 4.5, 0, NULL, FALSE, '{"planet":"munchies","subcategory":"fries"}'),
('peri-spice-fries',      'Peri-Spice Fries',      'Peri-peri spiced fries with a fiery kick.',                 NULL, 10000, NULL, 'munchies', '🌶️', 100, 4.5, 0, NULL, FALSE, '{"planet":"munchies","subcategory":"fries"}'),
('chilli-cheese-fries',   'Chilli Cheese Fries',   'Loaded fries with chilli and molten cheese.',               NULL, 12000, NULL, 'munchies', '🧀', 100, 4.5, 0, NULL, FALSE, '{"planet":"munchies","subcategory":"fries"}'),
('loaded-fuel-fries',     'Loaded Fuel Fries',     'Fries piled high with toppings — fuel for your mission.',   NULL, 12000, NULL, 'munchies', '⚡', 100, 4.5, 0, NULL, FALSE, '{"planet":"munchies","subcategory":"fries"}'),
('greasy-cheese-fries',   'Greasy Cheese Fries',   'Extra cheesy, extra greasy, extra good.',                   NULL, 12000, NULL, 'munchies', '🧈', 100, 4.5, 0, NULL, FALSE, '{"planet":"munchies","subcategory":"fries"}')
ON CONFLICT (slug) DO NOTHING;
