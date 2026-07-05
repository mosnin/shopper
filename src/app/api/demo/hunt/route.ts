import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { runDemoHunt } from "@/lib/demo-hunt";

// Public "five second moment" endpoint for the marketing hero. No auth, no
// credits: it is a taste of a hunt. Hard IP rate limit keeps provider spend and
// abuse bounded. Runs a real search when a provider is configured, otherwise
// returns an honestly-labelled sample.
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  const rate = await checkRateLimit(`demo-hunt:${ip}`, 10, 10 * 60_000);
  if (!rate.success) {
    return NextResponse.json(
      { error: "You have run a few hunts. Sign up free to keep going with your own agent." },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => null)) as { query?: string } | null;
  const query = body?.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "Type what you are hunting for." }, { status: 400 });
  }

  try {
    const hunt = await runDemoHunt(query);
    return NextResponse.json(hunt);
  } catch (e) {
    console.error("POST /api/demo/hunt", e);
    return NextResponse.json({ error: "The hunt failed. Try again." }, { status: 500 });
  }
}
