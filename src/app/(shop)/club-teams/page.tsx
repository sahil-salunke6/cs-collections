import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "Club Teams" };

export default function ClubTeamsPage() {
  return (
    <>
      <PageHeader
        variant="brand"
        title="Club Teams"
        description="Club colours from the world's elite leagues — LaLiga, Premier League, Serie A, Bundesliga and more."
        crumbs={[{ label: "Home", href: "/" }, { label: "Club Teams" }]}
      />
      <Container className="py-10">
        <ProductListing lockType="club" />
      </Container>
    </>
  );
}
