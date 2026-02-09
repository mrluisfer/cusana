import { allowedPlatformsArray } from "@/constants/allowed-platforms";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionsByUser,
  updateSubscription,
} from "@/lib/queries/subscriptions";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/[userid]/subscription">,
) {
  const { userid } = await ctx.params;

  const rawSubscriptions = await getSubscriptionsByUser(userid);

  const subscriptions = rawSubscriptions
    .filter((sub) =>
      allowedPlatformsArray.includes(
        sub.platform as (typeof allowedPlatformsArray)[number],
      ),
    )
    .map((sub) => ({
      ...sub,
      platform: sub.platform as (typeof allowedPlatformsArray)[number],
    }));

  return Response.json({ subscriptions }, { status: 200 });
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/[userid]/subscription">,
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
      { message: "Error al crear la suscripción" },
      { status: 500 },
    );
  }

  return Response.json(
    { message: "Suscripción creada exitosamente", subscription: res[0] },
    { status: 201 },
  );
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/[userid]/subscription">,
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

  const res = await updateSubscription(id, userid, data);

  if (!res || res.length === 0) {
    return Response.json(
      { message: "Suscripción no encontrada" },
      { status: 404 },
    );
  }

  return Response.json(
    { message: "Suscripción actualizada exitosamente", subscription: res[0] },
    { status: 200 },
  );
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/[userid]/subscription">,
) {
  const { userid } = await ctx.params;

  if (!userid) {
    return Response.json({ message: "User ID is required" }, { status: 400 });
  }

  const { searchParams } = req.nextUrl;
  const subscriptionId = searchParams.get("id");

  if (!subscriptionId) {
    return Response.json(
      { message: "Subscription ID is required" },
      { status: 400 },
    );
  }

  await deleteSubscription(subscriptionId, userid);

  return Response.json(
    { message: "Suscripción eliminada exitosamente" },
    { status: 200 },
  );
}
