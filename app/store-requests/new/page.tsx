import { AppShell } from "@/components/app-shell";
import { StoreRequestForm } from "@/app/store-requests/new/store-request-form";

export default function NewStoreRequestPage() {
  return (
    <AppShell>
      <StoreRequestForm />
    </AppShell>
  );
}
