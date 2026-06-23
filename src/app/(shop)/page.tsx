import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as api from "@/lib/api";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/home/Hero";
import { FeaturedTeams } from "@/components/home/FeaturedTeams";
import { CollectionTiles } from "@/components/home/CollectionTiles";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { ProductRailSection } from "@/components/product/ProductRailSection";
import { Newsletter } from "@/components/common/Newsletter";

export default async function HomePage() {
  const [nationalTeams, clubTeams, newArrivals, trending, limited, retro, collections, instagram] =
    await Promise.all([
      api.getFeaturedTeams("national"),
      api.getFeaturedTeams("club"),
      api.getNewArrivals(10),
      api.getTrending(10),
      api.getLimitedEdition(6),
      api.getRetro(10),
      api.getCollections(),
      api.getInstagram(),
    ]);

  return (
    <>
      <Hero />

      <Section>
        <SectionHeader
          eyebrow="Curated for you"
          title="Shop by Collection"
          description="From international glory to club legends and timeless retro classics."
        />
        <div className="mt-8">
          <CollectionTiles collections={collections} />
        </div>
      </Section>

      <Section muted>
        <SectionHeader eyebrow="International" title="Featured National Teams" href="/national-teams" />
        <div className="mt-8">
          <FeaturedTeams teams={nationalTeams} />
        </div>
      </Section>

      <Section>
        <ProductRailSection eyebrow="Latest drops" title="New Arrivals" href="/new-arrivals" products={newArrivals} />
      </Section>

      <Section muted>
        <SectionHeader eyebrow="Clubs" title="Featured Clubs" href="/club-teams" />
        <div className="mt-8">
          <FeaturedTeams teams={clubTeams} />
        </div>
      </Section>

      <Section>
        <ProductRailSection eyebrow="What's hot" title="Trending Jerseys" href="/best-sellers" products={trending} />
      </Section>

      {/* Limited edition banner */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl brand-gradient px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Limited Edition</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Rare kits. Limited runs. Gone fast.</h2>
            <p className="mt-3 text-white/80">
              Special-edition and limited drops you won't find anywhere else. Secure yours before they sell out.
            </p>
            <Button asChild size="lg" variant="accent" className="mt-6">
              <Link href="/products?badge=limited">
                Shop Limited Edition <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10">
            <ProductRailSection products={limited} controlVariant="light" />
          </div>
        </div>
      </Section>

      <Section muted>
        <ProductRailSection eyebrow="Heritage" title="Retro Collection" href="/retro" products={retro} />
      </Section>

      <Section>
        <SectionHeader align="center" eyebrow="Loved worldwide" title="What Our Customers Say" />
        <div className="mt-10">
          <ReviewsCarousel />
        </div>
      </Section>

      <Section muted>
        <SectionHeader eyebrow="@_cs_collections_" title="Follow the Movement" href="https://instagram.com/_cs_collections_" hrefLabel="Follow us" />
        <div className="mt-8">
          <InstagramGallery posts={instagram} />
        </div>
      </Section>

      <Container className="pb-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card px-6 py-12 text-center">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Join the Squad</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
              Get early access to new drops, exclusive offers and restock alerts — straight to your inbox.
            </p>
          </div>
          <Newsletter className="mx-auto" />
        </div>
      </Container>
    </>
  );
}
