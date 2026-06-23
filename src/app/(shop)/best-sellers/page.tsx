import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "Best Sellers" };

export default function BestSellersPage() {
  return (
    <>
      <PageHeader
        title="Best Sellers"
        description="The jerseys our community can't get enough of. Tried, tested and top-rated."
        crumbs={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]}
      />
      <Container className="py-10">
        <ProductListing lockBadge="bestseller" />
      </Container>
    </>
  );
}
