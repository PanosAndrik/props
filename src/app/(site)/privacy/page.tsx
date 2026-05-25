import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = {
  title: "Privacy Policy | PropCompare",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-700">
        <p>
          PropCompare collects account information (email, name) when you register, and
          reviews you submit. We use this data to operate the comparison platform and
          moderate user content.
        </p>
        <p>
          We do not sell your personal data. Cookies and session tokens are used for
          authentication. Contact us to request account deletion or data export.
        </p>
        <p className="text-xs text-zinc-500">Last updated: May 2026</p>
      </div>
    </main>
  );
}
