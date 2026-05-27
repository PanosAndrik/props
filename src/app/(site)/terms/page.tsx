import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = {
  title: "Terms of Use | PropCompare",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <h1 className="page-title">Terms of Use</h1>
      <div className="prose-page mt-6">
        <p>
          PropCompare provides informational comparisons and user-submitted reviews. Content
          is not financial advice. Prop firm rules, fees, and offers change — verify details
          on each firm&apos;s official site before purchasing.
        </p>
        <p>
          By using this site you agree not to post spam, fake reviews, or abusive content.
          We may remove content or suspend accounts at our discretion.
        </p>
        <p className="text-caption">Last updated: May 2026</p>
      </div>
    </main>
  );
}
