import { FirmForm } from "@/components/admin/firm-form";

export default function NewFirmPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-zinc-900">Add prop firm</h2>
      <div className="mt-8">
        <FirmForm />
      </div>
    </>
  );
}
