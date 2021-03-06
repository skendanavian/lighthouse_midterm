DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE
);
