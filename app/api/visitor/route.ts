import { NextResponse } from "next/server";

const VISITOR_KEY = "portfolio:visitors:total";

export async function POST() {
  // Increment and return visitor count
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    // Local dev: return mock count
    return NextResponse.json({ count: 1024 });
  }

  try {
    const { kv } = await import("@vercel/kv");
    const count = await kv.incr(VISITOR_KEY);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function GET() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ count: 1024 });
  }

  try {
    const { kv } = await import("@vercel/kv");
    const count = (await kv.get<number>(VISITOR_KEY)) ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
