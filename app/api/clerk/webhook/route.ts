// ./app/api/clerk/webhook/route.ts
export const runtime = "nodejs";

import type { NextRequest } from "next/server";

export async function POST(_request: NextRequest) {
  // Mark _request as used to prevent ESLint unused variable error.
  void _request;

  try {
    // Your webhook handling logic goes here.
    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
