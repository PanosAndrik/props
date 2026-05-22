"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions/update-profile";

export function ProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        await updateProfile(name);
        setMessage("Profile updated.");
      } catch {
        setMessage("Could not update profile.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label className="block text-sm font-medium text-zinc-700">Display name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          placeholder="Your name"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {message && <p className="w-full text-sm text-zinc-600">{message}</p>}
    </form>
  );
}
