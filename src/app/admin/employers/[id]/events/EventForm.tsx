"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
  registrationUrl: string | null;
};

export function EventForm({
  event,
  employerId,
}: {
  event?: Event;
  employerId: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dateStr = event?.date
    ? new Date(event.date).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title"),
      description: form.get("description") || null,
      date: form.get("date"),
      registrationUrl: form.get("registrationUrl") || null,
    };

    try {
      const url = event
        ? `/api/admin/employers/${employerId}/events/${event.id}`
        : `/api/admin/employers/${employerId}/events`;
      const res = await fetch(url, {
        method: event ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/admin/employers/${employerId}/events`);
        router.refresh();
      } else {
        const result = await res.json();
        setError(result.error || "Failed to save");
        setSaving(false);
      }
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!event || !confirm("Are you sure you want to delete this event?")) return;
    const res = await fetch(
      `/api/admin/employers/${employerId}/events/${event.id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      router.push(`/admin/employers/${employerId}/events`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Event details</h2>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Title *</label>
          <input
            name="title"
            required
            defaultValue={event?.title}
            placeholder="Event title"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={event?.description || ""}
            placeholder="Event description..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Date *</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={dateStr}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Registration URL</label>
            <input
              name="registrationUrl"
              type="url"
              defaultValue={event?.registrationUrl || ""}
              placeholder="https://..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        <div>
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline"
            >
              Delete event
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : event ? "Update event" : "Create event"}
        </button>
      </div>
    </form>
  );
}
