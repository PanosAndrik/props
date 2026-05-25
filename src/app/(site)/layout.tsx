import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteProviders } from "@/components/site-providers";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteProviders>
      <div className="flex min-h-screen min-w-0 flex-col pb-16 md:pb-0">
        <SiteHeader />
        <div className="min-w-0 flex-1">{children}</div>
        <SiteFooter />
      </div>
    </SiteProviders>
  );
}
