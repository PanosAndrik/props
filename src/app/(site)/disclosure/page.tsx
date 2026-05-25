import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = {
  title: "Affiliate Disclosure | PropCompare",
};

export default function DisclosurePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Affiliate disclosure" }]}
      />
      <h1 className="text-3xl font-bold">Affiliate disclosure</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-700">
        <p>
          PropCompare may earn commissions when you sign up with a prop firm through links or
          coupon codes on this site. This helps keep the platform free for traders.
        </p>
        <p>
          Affiliate relationships do not change our editorial rankings, but they may influence
          which deals we highlight. We aim to show accurate discount codes and link to official
          partner pages where possible.
        </p>
        <p className="text-xs text-zinc-500">Last updated: May 2026</p>
      </div>
    </main>
  );
}
