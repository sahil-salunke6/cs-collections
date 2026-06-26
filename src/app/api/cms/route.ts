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
      heroTiles: body.heroTiles ?? current.heroTiles,
      limitedBanner: body.limitedBanner ?? current.limitedBanner,
      collections: body.collections ?? current.collections,
      featuredTeams: body.featuredTeams ?? current.featuredTeams,
      customTeams: body.customTeams ?? current.customTeams,
      teamOverrides: body.teamOverrides ?? current.teamOverrides,
      removedTeamIds: body.removedTeamIds ?? current.removedTeamIds,
      reviews: body.reviews ?? current.reviews,
      instagramPosts: body.instagramPosts ?? current.instagramPosts,
    };
    saveCmsData(updated);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
