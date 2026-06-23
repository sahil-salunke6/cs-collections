import type { Metadata } from "next";
import type { ProductBadge } from "@/types";
import teamsData from "@/data/teams.json";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "Shop All Jerseys" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; badge?: string }>;
}) {
  const { team, badge } = await searchParams;
  const teamObj = team ? teamsData.find((t) => t.slug === team) : undefined;
  const title = teamObj ? `${teamObj.name} Jerseys` : badge ? `${cap(badge)} Jerseys` : "All Jerseys";

  return (
    <>
      <PageHeader
        title={title}
        description={
          teamObj
            ? `Official ${teamObj.name} home, away and retro kits.`
            : "Browse our full range of authentic national and club football jerseys."
        }
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/products" }, { label: title }]}
      />
      <Container className="py-10">
        <ProductListing teamSlug={team} lockBadge={badge as ProductBadge | undefined} />
      </Container>
    </>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
