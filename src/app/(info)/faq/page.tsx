"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useFaqs } from "@/lib/hooks/queries";

export default function FaqPage() {
  const { data: faqs, isLoading } = useFaqs();
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    if (!faqs) return [];
    const filtered = faqs.filter(
      (f) =>
        !q ||
        f.question.toLowerCase().includes(q.toLowerCase()) ||
        f.answer.toLowerCase().includes(q.toLowerCase()),
    );
    const map = new Map<string, typeof filtered>();
    for (const f of filtered) {
      map.set(f.category, [...(map.get(f.category) ?? []), f]);
    }
    return Array.from(map.entries());
  }, [faqs, q]);

  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        description="Everything you need to know about orders, sizing, shipping and returns."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <Container className="py-12">
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-8">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions…"
              className="h-12 pl-10"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <EmptyState icon={HelpCircle} title="No matching questions" description="Try a different search term." />
          ) : (
            <div className="space-y-8">
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{category}</h2>
                  <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
                    {items.map((f) => (
                      <AccordionItem key={f.id} value={f.id} className="last:border-b-0">
                        <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                        <AccordionContent>{f.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center">
            <MessageSquare className="size-8 text-primary" />
            <div>
              <h3 className="font-display text-lg font-semibold">Still have questions?</h3>
              <p className="text-sm text-muted-foreground">Our team is happy to help.</p>
            </div>
            <Button asChild>
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
