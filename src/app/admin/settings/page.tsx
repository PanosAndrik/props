import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <h2 className="page-title">Homepage settings</h2>
      <p className="mt-1 text-body-sm">
        Stats row and exclusive offers section on the public homepage.
      </p>
      <div className="mt-8">
        <SiteSettingsForm initial={settings} />
      </div>
    </>
  );
}
