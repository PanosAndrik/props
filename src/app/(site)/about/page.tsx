import Link from "next/link";

export const metadata = {
  title: "About | PropCompare",
  description: "Learn about PropCompare — independent prop firm reviews and comparisons.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="page-title">About PropCompare</h1>
      <div className="prose-page mt-6">
        <p>
          PropCompare helps traders find and compare proprietary trading firms using
          real community reviews, transparent rules, and exclusive coupon codes.
        </p>
        <p>
          Every review is submitted by a registered user and approved by our team
          before it appears on a firm&apos;s page — so you get honest feedback, not
          marketing copy.
        </p>
        <h2 className="subsection-title pt-4">What you can do</h2>
        <ul className="list-inside list-disc space-y-2 text-zinc-700">
          <li>Browse and filter prop firms by assets, fees, and ratings</li>
          <li>Compare up to 3 firms side by side</li>
          <li>Read verified reviews and submit your own experience</li>
          <li>Use exclusive discount codes shared on each firm page</li>
        </ul>
        <p>
          Ready to start?{" "}
          <Link href="/firms" className="font-medium text-amber-700 hover:underline">
            Browse firms
          </Link>{" "}
          or{" "}
          <Link href="/auth/signup" className="font-medium text-amber-700 hover:underline">
            create a free account
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
