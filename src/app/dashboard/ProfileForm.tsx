"use client";

import { useState } from "react";

export function ProfileForm({
  name,
  bio,
  location,
  emailNotifications,
}: {
  name: string;
  bio: string;
  location: string;
  emailNotifications: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/jobseeker/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          bio: formData.get("bio"),
          location: formData.get("location"),
          emailNotifications: formData.get("emailNotifications") === "on",
        }),
      });

      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-forest mb-1">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={name}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-forest mb-1">Location</label>
        <input
          id="location"
          name="location"
          defaultValue={location}
          placeholder="e.g. Sydney, NSW"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-forest mb-1">Brief bio</label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="emailNotifications"
          defaultChecked={emailNotifications}
          className="rounded border-gray-300 text-teal focus:ring-teal"
        />
        Email me about new listings
      </label>
      {status === "error" && (
        <p className="text-sm text-red-500">Failed to update profile.</p>
      )}
      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full bg-teal hover:bg-teal-dark text-white py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Update profile"}
      </button>
    </form>
  );
}
