# API Routes

## Service Orders
- `GET /api/service-orders`: List service orders visible to the current role.
- `POST /api/service-orders`: Create customer and service order.
- `GET /api/service-orders/[id]`: Fetch detail, photos, customer, and timeline.
- `PATCH /api/service-orders/[id]`: Update quotation, payment status, assignment, or repair status.
- `POST /api/service-orders/[id]/photos`: Upload service photos to Supabase Storage.

## Store Requests
- `GET /api/store-requests`: List replenishment, transfer, new product, backorder, and special product requests.
- `POST /api/store-requests`: Create request and item rows.
- `GET /api/store-requests/[id]`: Fetch request detail and approval state.
- `PATCH /api/store-requests/[id]`: Approve, reject, process, send out, or mark received.

## Inventory
- `GET /api/inventory/products`: List SKUs and product master data.
- `POST /api/inventory/products`: Create SKU with category, color, size, price, image, and status.
- `POST /api/inventory/stock-in`: Add quantity to a location and automatically record `stock_in`.
- `POST /api/inventory/stock-out`: Transfer quantity from one location to another and automatically record `transfer`.
- `POST /api/inventory/adjustment`: Apply manual quantity correction and automatically record `adjustment`.
- `GET /api/inventory/movements`: List stock movement history.
- `GET /api/inventory/low-stock`: List rows where `quantity <= reorder_level`.

## Admin
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/[id]`
- `GET /api/admin/stores`
