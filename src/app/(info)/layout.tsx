import { SiteChrome } from "@/components/layout/SiteChrome";

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
