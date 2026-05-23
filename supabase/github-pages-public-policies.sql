-- Use this only for the current GitHub Pages version that has no login screen yet.
-- It lets the static frontend read/write operational demo data through the anon key.
-- For production, replace these policies with authenticated user policies.

drop policy if exists "anon can read stores" on public.stores;
create policy "anon can read stores"
on public.stores for select
to anon
using (true);

drop policy if exists "anon can read locations" on public.locations;
create policy "anon can read locations"
on public.locations for select
to anon
using (true);

drop policy if exists "anon can read customers" on public.customers;
create policy "anon can read customers"
on public.customers for select
to anon
using (true);

drop policy if exists "anon can create customers" on public.customers;
create policy "anon can create customers"
on public.customers for insert
to anon
with check (true);

drop policy if exists "anon can read service orders" on public.service_orders;
create policy "anon can read service orders"
on public.service_orders for select
to anon
using (true);

drop policy if exists "anon can create service orders" on public.service_orders;
create policy "anon can create service orders"
on public.service_orders for insert
to anon
with check (true);

drop policy if exists "anon can read products" on public.products;
create policy "anon can read products"
on public.products for select
to anon
using (true);

drop policy if exists "anon can create products" on public.products;
create policy "anon can create products"
on public.products for insert
to anon
with check (true);

drop policy if exists "anon can update products" on public.products;
create policy "anon can update products"
on public.products for update
to anon
using (true)
with check (true);

drop policy if exists "anon can read inventory" on public.inventory;
create policy "anon can read inventory"
on public.inventory for select
to anon
using (true);

drop policy if exists "anon can manage inventory" on public.inventory;
create policy "anon can manage inventory"
on public.inventory for all
to anon
using (true)
with check (true);

drop policy if exists "anon can read stock movements" on public.stock_movements;
create policy "anon can read stock movements"
on public.stock_movements for select
to anon
using (true);

drop policy if exists "anon can create stock movements" on public.stock_movements;
create policy "anon can create stock movements"
on public.stock_movements for insert
to anon
with check (true);

drop policy if exists "anon can read store requests" on public.store_requests;
create policy "anon can read store requests"
on public.store_requests for select
to anon
using (true);

drop policy if exists "anon can create store requests" on public.store_requests;
create policy "anon can create store requests"
on public.store_requests for insert
to anon
with check (true);

drop policy if exists "anon can read store request items" on public.store_request_items;
create policy "anon can read store request items"
on public.store_request_items for select
to anon
using (true);

drop policy if exists "anon can create store request items" on public.store_request_items;
create policy "anon can create store request items"
on public.store_request_items for insert
to anon
with check (true);

grant usage on schema public to anon;
grant select, insert, update on public.customers to anon;
grant select, insert, update on public.service_orders to anon;
grant select on public.stores to anon;
grant select on public.locations to anon;
grant select, insert, update on public.products to anon;
grant select, insert, update on public.inventory to anon;
grant select, insert on public.stock_movements to anon;
grant select, insert on public.store_requests to anon;
grant select, insert on public.store_request_items to anon;

grant execute on function public.apply_stock_in(uuid, uuid, integer, text, text) to anon;
grant execute on function public.apply_stock_transfer(uuid, uuid, uuid, integer, text, text) to anon;
grant execute on function public.apply_stock_adjustment(uuid, uuid, integer, text, text, text) to anon;
