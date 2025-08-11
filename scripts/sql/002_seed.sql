-- Optional demo seed
insert into categories (id, name, "order")
values
  (uuid_generate_v4(), '{"ar":"أحذية","en":"Shoes"}', 0),
  (uuid_generate_v4(), '{"ar":"حقائب","en":"Bags"}', 1)
on conflict do nothing;

-- You can seed products similarly if needed.
