import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import type { CmsAnnouncement } from "@/lib/cms";

export function SiteChrome({
  children,
  announcement,
}: {
  children: React.ReactNode;
  announcement?: CmsAnnouncement;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar announcement={announcement} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
