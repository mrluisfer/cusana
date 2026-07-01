import { allowedPlatformsArray } from "@/constants/allowed-platforms";
import {
  createSubscription,
  deleteSubscription,
  getInactiveSubscriptionsByUser,
  getSubscriptionsByUser,
  hardDeleteSubscription,
  reactivateSubscription,
  updateSubscription,
} from "@/lib/queries/subscriptions";
import type { RouteContext } from "@/types/route-context";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<{ userid: string }>,
) {
  const { userid } = await ctx.params;

  // `?status=inactive` devuelve las suscripciones desactivadas (soft-deleted),
  // usadas solo como ayuda visual; por defecto se devuelven las activas.
  const status = _req.nextUrl.searchParams.get("status");

  const rawSubscriptions =
    status === "inactive"
      ? await getInactiveSubscriptionsByUser(userid)
      : await getSubscriptionsByUser(userid);

  const subscriptions = rawSubscriptions.reduce<
    Array<
      Omit<(typeof rawSubscriptions)[number], "platform"> & {
        platform: (typeof allowedPlatformsArray)[number];
      }
    >
  >((acc, sub) => {
    const platform = sub.platform as (typeof allowedPlatformsArray)[number];
    if (allowedPlatformsArray.includes(platform)) {
      acc.push({ ...sub, platform });
    }
    return acc;
  }, []);

  return Response.json({ subscriptions }, { status: 200 });
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<{ userid: string }>,
) {
  const { userid } = await ctx.params;

  if (!userid) {
    return Response.json({ message: "User ID is required" }, { status: 400 });
  }

  const body = await req.json();

  const res = await createSubscription({
    name: body.name,
    platform: body.platform,
    price: body.price,
    currency: body.currency,
    billingCycle: body.billingCycle,
    billingDay: body.billingDay,
    billingMonth: body.billingMonth ?? null,
    userId: userid,
  });

  if (!res || res.length === 0) {
    return Response.json(
      { message: "Failed to create the subscription" },
      { status: 500 },
    );
  }

  return Response.json(
    { message: "Subscription created successfully", subscription: res[0] },
    { status: 201 },
  );
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<{ userid: string }>,
) {
  const { userid } = await ctx.params;

  if (!userid) {
    return Response.json({ message: "User ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return Response.json(
      { message: "Subscription ID is required" },
      { status: 400 },
    );
  }

  // Reactivación: cuando el único cambio es activar la suscripción,
  // registramos un evento dedicado de "reactivated".
  const res =
    data.active === true && Object.keys(data).length === 1
      ? await reactivateSubscription(id, userid)
      : await updateSubscription(id, userid, data);

  if (!res || res.length === 0) {
    return Response.json(
      { message: "Subscription not found" },
      { status: 404 },
    );
  }

  return Response.json(
    { message: "Subscription updated successfully", subscription: res[0] },
    { status: 200 },
  );
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<{ userid: string }>,
) {
  const { userid } = await ctx.params;

  if (!userid) {
    return Response.json({ message: "User ID is required" }, { status: 400 });
  }

  const { searchParams } = req.nextUrl;
  const subscriptionId = searchParams.get("id");
  // `?permanent=true` borra el registro de la base de datos (hard delete);
  // por defecto se hace soft delete (marcar como inactiva).
  const permanent = searchParams.get("permanent") === "true";

  if (!subscriptionId) {
    return Response.json(
      { message: "Subscription ID is required" },
      { status: 400 },
    );
  }

  if (permanent) {
    const res = await hardDeleteSubscription(subscriptionId, userid);

    if (!res || res.length === 0) {
      return Response.json(
        { message: "Subscription not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "Subscription permanently deleted" },
      { status: 200 },
    );
  }

  await deleteSubscription(subscriptionId, userid);

  return Response.json(
    { message: "Subscription deleted successfully" },
    { status: 200 },
  );
}
