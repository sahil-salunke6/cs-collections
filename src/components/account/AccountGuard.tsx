"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors";

/** Client-side UI guard. Auth state rehydrates from redux-persist on mount. */
export function AccountGuard({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return null;

  if (!isAuth) {
    return (
      <EmptyState
        icon={Lock}
        title="Please sign in"
        description="Sign in to view your account, orders and saved jerseys."
        className="py-20"
        action={
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        }
      />
    );
  }

  return <>{children}</>;
}
