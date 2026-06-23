import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Star } from "lucide-react";
import { Logo, LogoMark } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden brand-gradient p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <Logo href="/" className="relative [&_*]:!text-white" />
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            The home of authentic football jerseys.
          </h2>
          <p className="mt-4 text-white/80">
            Join thousands of fans worldwide. Track orders, save favourites and check out faster.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              { icon: ShieldCheck, t: "100% authentic, officially sourced" },
              { icon: Truck, t: "Fast, tracked worldwide shipping" },
              { icon: Star, t: "Rated 4.9/5 by our community" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3">
                <f.icon className="size-5 shrink-0" /> {f.t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} CS Collections</p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to store
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <LogoMark className="size-12" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
