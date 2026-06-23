"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, LogOut } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { selectIsAdmin } from "@/store/selectors";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
