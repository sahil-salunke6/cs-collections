import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "Retro Jerseys" };

export default function RetroPage() {
  return (
    <>
      <PageHeader
        title="Retro Jerseys"
        description="Heritage classics, faithfully reissued. Own a piece of football history."
        crumbs={[{ label: "Home", href: "/" }, { label: "Retro" }]}
      />
      <Container className="py-10">
        <ProductListing lockType="retro" />
      </Container>
    </>
  );
}
