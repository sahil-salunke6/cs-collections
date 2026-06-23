"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, Package, Heart, LogOut, LayoutGrid, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { selectIsAuthenticated, selectIsAdmin, selectUser } from "@/store/selectors";

export function AccountMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const user = useAppSelector(selectUser);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isAuth && user ? (
            <Avatar className="size-10">
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserIcon className="size-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAuth && user ? (
          <>
            <DropdownMenuLabel>
              <span className="block normal-case text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="block truncate text-[11px] font-normal normal-case text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="font-semibold text-primary">
                  <ShieldCheck /> Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/account/profile">
                <LayoutGrid /> Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/orders">
                <Package /> Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/wishlist">
                <Heart /> Wishlist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(logout());
                router.push("/");
              }}
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            <p className="px-1 text-sm text-muted-foreground">Welcome to CS Collections</p>
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
