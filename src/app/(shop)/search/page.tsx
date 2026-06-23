import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <>
      <PageHeader
        title={q ? `Results for “${q}”` : "Search"}
        description={q ? undefined : "Find your team, your kit, your moment."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
      <Container className="py-10">
        <ProductListing key={q} search={q} />
      </Container>
    </>
  );
}
