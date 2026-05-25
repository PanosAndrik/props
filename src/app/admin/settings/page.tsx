import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <h2 className="text-2xl font-bold text-zinc-900">Homepage settings</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Stats row and exclusive offers section on the public homepage.
      </p>
      <div className="mt-8">
        <SiteSettingsForm initial={settings} />
      </div>
    </>
  );
}
