"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectIsAdmin } from "@/store/selectors";

/** Client-side admin guard. NOTE: this is UI-only gating for the mock app —
 *  real authorization must be enforced server-side on every admin API. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return null;

  if (!isAuth || !isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <EmptyState
          icon={ShieldAlert}
          title="Admin access required"
          description="This area is restricted to store administrators. Sign in with the admin account to continue."
          action={
            <div className="flex flex-col items-center gap-3">
              <Button asChild>
                <Link href="/login">Sign in as admin</Link>
              </Button>
              <p className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                Demo admin → email <span className="font-semibold text-foreground">admin@cscollections.com</span> (any password)
              </p>
            </div>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
