"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Container } from "@/components/common/Container";
import { primaryNav } from "@/lib/nav";
import { MegaPanel } from "./MegaPanel";
import { MobileNav } from "./MobileNav";
import { AccountMenu } from "./AccountMenu";
import { SearchCommand } from "./SearchCommand";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartDrawer } from "@/store/slices/uiSlice";
import { selectCartCount, selectWishlistCount } from "@/store/selectors";

const MEGA: Record<string, "national" | "club"> = {
  "/national-teams": "national",
  "/club-teams": "club",
};

export function Navbar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useAppSelector(selectCartCount);
  const wishCount = useAppSelector(selectWishlistCount);

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <Container className="flex h-9 items-center justify-center gap-2 text-center text-[12.5px] font-medium">
          <span>100% Authentic Football Jerseys · Shipping across India · Pay via UPI, Cards &amp; Net Banking</span>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl theme-transition">
        <Container className="flex h-16 items-center gap-3 lg:h-[68px]">
          <MobileNav />
          <Logo className="shrink-0" />

          <nav className="ml-4 hidden items-center lg:flex">
            {primaryNav.map((link) => {
              const mega = MEGA[link.href];
              const active = pathname === link.href;
              return (
                <div key={link.href} className="group/nav relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative inline-flex h-[68px] items-center px-3.5 text-sm font-medium transition-colors hover:text-primary",
                      active ? "text-primary" : "text-foreground",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform group-hover/nav:scale-x-100",
                        active && "scale-x-100",
                      )}
                    />
                  </Link>
                  {mega && (
                    <div className="invisible absolute left-0 top-full z-50 translate-y-1 opacity-0 transition-all duration-200 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                      <div className="overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
                        <MegaPanel type={mega} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Search className="size-5" />
            </button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="relative hidden size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary sm:flex"
            >
              <Heart className="size-5" />
              {wishCount > 0 && <CountBadge n={wishCount} accent />}
            </Link>
            <AccountMenu />
            <button
              aria-label="Open bag"
              onClick={() => dispatch(setCartDrawer(true))}
              className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && <CountBadge n={cartCount} />}
            </button>
          </div>
        </Container>
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function CountBadge({ n, accent }: { n: number; accent?: boolean }) {
  return (
    <span
      className={cn(
        "absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none",
        accent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
      )}
      style={{ height: 18, minWidth: 18 }}
    >
      {n > 9 ? "9+" : n}
    </span>
  );
}
