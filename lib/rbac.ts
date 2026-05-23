import type { Permission, Role } from "@/lib/types";

export const rolePermissions: Record<Role, Permission[]> = {
  store_staff: [
    "service:create",
    "store_request:create",
    "inventory:view"
  ],
  store_manager: [
    "service:create",
    "service:update_status",
    "store_request:create",
    "store_request:approve",
    "inventory:view"
  ],
  service_admin: [
    "service:create",
    "service:review",
    "service:quote",
    "service:update_status",
    "service:view_all",
    "store_request:approve",
    "store_request:fulfill",
    "inventory:view"
  ],
  inventory_admin: [
    "store_request:approve",
    "store_request:fulfill",
    "inventory:view",
    "inventory:update",
    "inventory:stock_in",
    "inventory:stock_out",
    "inventory:adjust"
  ],
  super_admin: [
    "service:create",
    "service:review",
    "service:quote",
    "service:update_status",
    "service:view_all",
    "store_request:create",
    "store_request:approve",
    "store_request:fulfill",
    "inventory:view",
    "inventory:update",
    "inventory:stock_in",
    "inventory:stock_out",
    "inventory:adjust",
    "admin:manage_users"
  ]
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!can(role, permission)) {
    throw new Error(`Role ${role} cannot perform ${permission}`);
  }
}
