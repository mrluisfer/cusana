// lib/get-session.ts

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });
  return session;
}

export async function getSessionOrRedirect() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
