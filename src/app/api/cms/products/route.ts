import { getCmsData, saveCmsData, getCmsProductCatalog } from "@/lib/cms";
import { products as baseProducts } from "@/data/products";
import { NextResponse } from "next/server";
import type { Product } from "@/types";

export async function GET() {
  const catalog = getCmsProductCatalog(baseProducts);
  return NextResponse.json(catalog);
}

export async function POST(req: Request) {
  try {
    const product: Product = await req.json();
    const current = getCmsData();
    const updated = {
      ...current,
      newProducts: [...current.newProducts.filter((p) => p.id !== product.id), product],
    };
    saveCmsData(updated);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
