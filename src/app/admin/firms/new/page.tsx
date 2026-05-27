import Link from "next/link";
import { FirmForm } from "@/components/admin/firm-form";

export default function NewFirmPage() {
  return (
    <>
      <Link href="/admin/firms" className="text-caption hover:text-zinc-800">
        ← Firms
      </Link>
      <h2 className="mt-2 page-title">Add prop firm</h2>
      <div className="mt-8">
        <FirmForm />
      </div>
    </>
  );
}
