import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getSessionOrRedirect } from "@/lib/get-session";
import { getSubscriptionsByUser } from "@/lib/queries/subscriptions";
import { CalendarFoldIcon } from "lucide-react";

export async function SubscriptionsActive() {
  const session = await getSessionOrRedirect();

  if (!session.user.id) {
    throw new Error("User ID is required");
  }

  const subscriptions = await getSubscriptionsByUser(session.user.id);

  return (
    <Item>
      <ItemMedia variant={"icon"}>
        <CalendarFoldIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Suscripciones activas</ItemTitle>
        <ItemDescription>
          {subscriptions.length} suscripciones activas
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
