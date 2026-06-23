import { getCmsData, saveCmsData } from "@/lib/cms";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(getCmsData());
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const current = getCmsData();
    const updated = {
      ...current,
      announcement: body.announcement ?? current.announcement,
      hero: body.hero ?? current.hero,
    };
    saveCmsData(updated);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
