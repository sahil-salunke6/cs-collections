import type { Metadata } from "next";
import * as api from "@/lib/api";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CollectionTiles } from "@/components/home/CollectionTiles";
import { FeaturedTeams } from "@/components/home/FeaturedTeams";
import { ProductRailSection } from "@/components/product/ProductRailSection";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const [collections, national, clubs, trending] = await Promise.all([
    api.getCollections(),
    api.getTeams("national"),
    api.getTeams("club"),
    api.getTrending(10),
  ]);

  return (
    <>
      <PageHeader
        title="Collections"
        description="Explore curated edits across nations, clubs, eras and the latest drops."
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />

      <Container className="py-10">
        <CollectionTiles collections={collections} />
      </Container>

      <Section muted>
        <ProductRailSection eyebrow="Trending now" title="Most Wanted" href="/best-sellers" products={trending} />
      </Section>

      <Section>
        <SectionHeader title="All National Teams" href="/national-teams" />
        <div className="mt-8">
          <FeaturedTeams teams={national} />
        </div>
      </Section>

      <Section muted>
        <SectionHeader title="All Clubs" href="/club-teams" />
        <div className="mt-8">
          <FeaturedTeams teams={clubs} />
        </div>
      </Section>
    </>
  );
}
