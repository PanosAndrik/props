import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-caption mb-4">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-zinc-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-zinc-800">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-zinc-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
