-- Seed: test order for development
INSERT INTO orders (config, price, allegro_units, utm_source)
VALUES (
  '{"fabric": "standard", "color": "biel", "mounting": "inwazyjny", "width": 600, "height": 1500, "rail": "bialy"}'::jsonb,
  137.75,
  138,
  'test'
);
