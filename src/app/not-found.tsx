import Link from "next/link";
import { Home, Search } from "lucide-react";
import { LogoMark } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <LogoMark className="size-16" />
      <p className="mt-8 font-display text-7xl font-extrabold tracking-tight text-primary sm:text-8xl">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Off the pitch</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you’re looking for has been subbed off. Let’s get you back in the game.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="size-4" /> Back home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/products">
            <Search className="size-4" /> Browse jerseys
          </Link>
        </Button>
      </div>
    </div>
  );
}
