import { decrementStock, type StockLine } from "@/lib/cms";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lines: StockLine[] = Array.isArray(body?.items)
      ? body.items.map((i: StockLine) => ({
          productId: String(i.productId),
          size: String(i.size),
          quantity: Number(i.quantity) || 0,
        }))
      : [];

    decrementStock(lines);

    const orderNumber = `CS-${100400 + Math.floor(Math.random() * 600)}`;
    return NextResponse.json({ ok: true, orderNumber });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
