import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "New Arrivals" };

export default function NewArrivalsPage() {
  return (
    <>
      <PageHeader
        title="New Arrivals"
        description="The latest drops, fresh off the pitch. Be first to wear this season's kits."
        crumbs={[{ label: "Home", href: "/" }, { label: "New Arrivals" }]}
      />
      <Container className="py-10">
        <ProductListing lockBadge="new" />
      </Container>
    </>
  );
}
