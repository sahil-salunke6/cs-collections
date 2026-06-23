"use client";

import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/Logo";
import { primaryNav } from "@/lib/nav";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNav } from "@/store/slices/uiSlice";
import { selectIsAuthenticated } from "@/store/selectors";

export function MobileNav() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.mobileNavOpen);
  const isAuth = useAppSelector(selectIsAuthenticated);

  return (
    <Sheet open={open} onOpenChange={(o) => dispatch(setMobileNav(o))}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
        >
          <Menu className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm p-0" aria-describedby={undefined}>
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-left">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-2">
          {primaryNav.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between rounded-lg px-4 py-3.5 text-base font-medium transition-colors hover:bg-secondary"
              >
                {link.label}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-border p-2">
          {[
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "FAQ", href: "/faq" },
            { label: isAuth ? "My Account" : "Sign In", href: isAuth ? "/account/profile" : "/login" },
          ].map((l) => (
            <SheetClose asChild key={l.href + l.label}>
              <Link href={l.href} className="block rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {l.label}
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
