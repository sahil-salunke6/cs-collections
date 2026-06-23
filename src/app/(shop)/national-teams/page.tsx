import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "National Teams" };

export default function NationalTeamsPage() {
  return (
    <>
      <PageHeader
        variant="brand"
        title="National Teams"
        description="Represent your nation. Authentic international jerseys from football's biggest stages."
        crumbs={[{ label: "Home", href: "/" }, { label: "National Teams" }]}
      />
      <Container className="py-10">
        <ProductListing lockType="national" />
      </Container>
    </>
  );
}
