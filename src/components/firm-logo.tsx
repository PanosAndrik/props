import Image from "next/image";

export function FirmLogo({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-2xl",
  };
  const cls = sizes[size];

  if (logoUrl) {
    return (
      <div className={`relative ${cls} shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white`}>
        <Image
          src={logoUrl}
          alt={name}
          fill
          className="object-contain p-1"
          unoptimized={logoUrl.startsWith("/uploads/")}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex ${cls} shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 font-bold text-zinc-600`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
