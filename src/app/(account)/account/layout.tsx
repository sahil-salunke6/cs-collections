import { SiteChrome } from "@/components/layout/SiteChrome";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountGuard } from "@/components/account/AccountGuard";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteChrome>
      <PageHeader title="My Account" crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <AccountSidebar />
          <div className="min-w-0">
            <AccountGuard>{children}</AccountGuard>
          </div>
        </div>
      </Container>
    </SiteChrome>
  );
}
