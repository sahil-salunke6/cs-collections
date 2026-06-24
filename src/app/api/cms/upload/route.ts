import { ensureUploadsDir, UPLOADS_DIR } from "@/lib/cms";
import { writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    ensureUploadsDir();
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOADS_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
