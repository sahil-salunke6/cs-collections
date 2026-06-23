import { getCmsData, saveCmsData, getCmsProductCatalog } from "@/lib/cms";
import { products as baseProducts } from "@/data/products";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = getCmsProductCatalog(baseProducts);
  const product = catalog.find((p) => p.id === id || p.slug === id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const patch = await req.json();
    const current = getCmsData();

    // Is it a new product or a base override?
    const isNew = current.newProducts.some((p) => p.id === id);
    if (isNew) {
      const updated = {
        ...current,
        newProducts: current.newProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      };
      saveCmsData(updated);
    } else {
      const updated = {
        ...current,
        productOverrides: {
          ...current.productOverrides,
          [id]: { ...(current.productOverrides[id] ?? {}), ...patch },
        },
      };
      saveCmsData(updated);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const current = getCmsData();
    const updated = {
      ...current,
      newProducts: current.newProducts.filter((p) => p.id !== id),
      productOverrides: Object.fromEntries(
        Object.entries(current.productOverrides).filter(([k]) => k !== id),
      ),
    };
    saveCmsData(updated);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
