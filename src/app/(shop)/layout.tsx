import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCmsData } from "@/lib/cms";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const cms = getCmsData();
  return <SiteChrome announcement={cms.announcement}>{children}</SiteChrome>;
}
