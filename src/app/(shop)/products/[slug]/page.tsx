import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as api from "@/lib/api";
import { products } from "@/data/products";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { ProductRailSection } from "@/components/product/ProductRailSection";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await api.getProductBySlug(slug);
  if (!product) notFound();

  const related = await api.getRelatedProducts(product);

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: product.type === "club" ? "Club Teams" : product.type === "national" ? "National Teams" : "Retro", href: product.type === "retro" ? "/retro" : `/${product.type}-teams` },
            { label: product.team, href: `/products?team=${product.teamId}` },
            { label: product.name },
          ]}
        />
      </Container>

      <Container className="grid gap-10 py-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery product={product} />
        <ProductPurchase product={product} />
      </Container>

      {/* Details */}
      <Container className="py-4">
        <div className="mx-auto max-w-3xl">
          <Accordion type="multiple" defaultValue={["description"]}>
            <AccordionItem value="description">
              <AccordionTrigger>Product Description</AccordionTrigger>
              <AccordionContent>{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="team">
              <AccordionTrigger>Team Information</AccordionTrigger>
              <AccordionContent>{product.teamInfo}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="season">
              <AccordionTrigger>Season Information</AccordionTrigger>
              <AccordionContent>{product.seasonInfo}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-2 gap-y-2">
                  <dt className="text-foreground">Brand</dt>
                  <dd>{product.brand}</dd>
                  <dt className="text-foreground">Season</dt>
                  <dd>{product.season}</dd>
                  <dt className="text-foreground">Kit</dt>
                  <dd className="capitalize">{product.kit}</dd>
                  <dt className="text-foreground">Type</dt>
                  <dd className="capitalize">{product.type}</dd>
                  {product.league && (
                    <>
                      <dt className="text-foreground">League</dt>
                      <dd>{product.league}</dd>
                    </>
                  )}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping &amp; Payment</AccordionTrigger>
              <AccordionContent>
                Flat ₹100 standard shipping across India (express available at checkout). Pay securely via UPI,
                credit/debit cards or net banking. Every jersey is 100% authentic and quality-checked before dispatch.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Container>

      {/* Reviews */}
      <Section muted>
        <SectionHeader title="Customer Reviews" />
        <div className="mt-8">
          <ReviewsSection product={product} />
        </div>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section>
          <ProductRailSection title="You May Also Like" href="/products" products={related} />
        </Section>
      )}
    </>
  );
}
