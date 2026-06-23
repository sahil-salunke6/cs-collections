"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { selectUser, selectWishlistCount } from "@/store/selectors";

const LINKS = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const wishCount = useAppSelector(selectWishlistCount);

  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <Avatar className="size-11">
          <AvatarFallback>{user ? `${user.firstName[0]}${user.lastName[0]}` : "CS"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</p>
        </div>
      </div>

      <nav className="mt-3 flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-2 lg:flex-col lg:gap-0.5">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
              )}
            >
              <l.icon className="size-4" /> {l.label}
              {l.label === "Wishlist" && wishCount > 0 && (
                <span className={cn("ml-auto rounded-full px-1.5 text-xs", active ? "bg-white/20" : "bg-secondary")}>
                  {wishCount}
                </span>
              )}
            </Link>
          );
        })}
        <button
          onClick={() => {
            dispatch(logout());
            router.push("/");
          }}
          className="flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 lg:mt-1"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </nav>
    </aside>
  );
}
