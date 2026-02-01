import { Subscription, subscriptionsColumns } from "./columns";
import { DataTable } from "./data-table";

export const subscriptionsExample: Subscription[] = [
  {
    id: "sub_1",
    name: "Youtube Premium",
    platform: "youtube",
    price: 139,
    currency: "MXN",
    billingCycle: "monthly",
    billingDay: 15,
  },
  {
    id: "sub_2",
    name: "Netflix Standard",
    platform: "netflix",
    price: 199,
    currency: "MXN",
    billingCycle: "monthly",
    billingDay: 20,
  },
  {
    id: "sub_3",
    name: "Spotify Premium",
    platform: "spotify",
    price: 129,
    currency: "MXN",
    billingCycle: "monthly",
    billingDay: 5,
  },
  {
    id: "sub_4",
    name: "Disney+ Premium",
    platform: "disney",
    price: 219,
    currency: "MXN",
    billingCycle: "monthly",
    billingDay: 10,
  },
  {
    id: "sub_5",
    name: "iCloud 200GB",
    platform: "claude",
    price: 49,
    currency: "MXN",
    billingCycle: "monthly",
    billingDay: 1,
  },
] as const;

export default async function SubscriptionTable() {
  // const data = await getSubscriptions();

  return (
    <section className="space-y-6 mt-8">
      {/* Tabla */}
      <DataTable columns={subscriptionsColumns} data={subscriptionsExample} />
    </section>
  );
}
