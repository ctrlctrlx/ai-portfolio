import { NextResponse } from "next/server";

const VISITOR_KEY = "portfolio:visitors:total";
const unavailableResponse = () =>
  NextResponse.json(
    { available: false as const },
    { headers: { "Cache-Control": "no-store" } }
  );

export async function POST() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return unavailableResponse();
  }

  try {
    const { kv } = await import("@vercel/kv");
    const count = await kv.incr(VISITOR_KEY);
    return NextResponse.json(
      { available: true as const, count },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return unavailableResponse();
  }
}

export async function GET() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return unavailableResponse();
  }

  try {
    const { kv } = await import("@vercel/kv");
    const count = await kv.get<number>(VISITOR_KEY);
    if (typeof count !== "number") return unavailableResponse();

    return NextResponse.json(
      { available: true as const, count },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return unavailableResponse();
  }
}
