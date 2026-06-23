"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, LogOut, LayoutDashboard, FileText, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { selectIsAdmin } from "@/store/selectors";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Logo href="/admin" withWordmark={false} />
          <span className="font-display text-lg font-bold">Admin</span>
          <Badge variant="accent" className="hidden sm:inline-flex">Console</Badge>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Store className="size-4" /> <span className="hidden sm:inline">View store</span>
              </Link>
            </Button>
            <ThemeToggle />
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  dispatch(logout());
                  router.push("/");
                }}
              >
                <LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-0 px-4 sm:px-6">
        <nav className="hidden w-52 shrink-0 py-8 pr-6 md:block">
          <ul className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile top nav */}
        <div className="flex w-full gap-1 overflow-x-auto py-4 md:hidden">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" /> {label}
              </Link>
            );
          })}
        </div>

        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}
