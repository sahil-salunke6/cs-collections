import Link from "next/link";
import { Instagram, MessageCircle, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Container } from "@/components/common/Container";
import { Newsletter } from "@/components/common/Newsletter";
import { Separator } from "@/components/ui/separator";
import { footerNav } from "@/lib/nav";

const TRUST = [
  { icon: ShieldCheck, label: "100% Authentic", sub: "Quality checked" },
  { icon: Truck, label: "Fast Shipping", sub: "Across India" },
  { icon: CreditCard, label: "Secure Payments", sub: "UPI · Cards · Net Banking" },
];

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com/_cs_collections_", label: "Instagram @_cs_collections_" },
  { Icon: MessageCircle, href: "https://wa.me/918657973913", label: "WhatsApp +91 86579 73913" },
  { Icon: MessageCircle, href: "https://wa.me/917219060279", label: "WhatsApp +91 72190 60279" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card theme-transition">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-3 rounded-xl border border-border p-4">
              <t.icon className="size-6 text-primary" />
              <div>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Premium, authentic football jerseys for national teams and clubs worldwide. Built for matchday.
            </p>
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Join the squad</p>
              <Newsletter variant="compact" />
            </div>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <s.Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CS Collections. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((m) => (
              <span key={m} className="rounded-md border border-border px-2 py-1 font-semibold tracking-wide">
                {m}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
