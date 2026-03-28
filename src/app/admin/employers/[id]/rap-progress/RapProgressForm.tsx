"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TARGET_MET_OPTIONS = [
  { value: "MET", label: "Met" },
  { value: "PARTIALLY_MET", label: "Partially met" },
  { value: "NOT_MET", label: "Not met" },
  { value: "IN_PROGRESS", label: "In progress" },
];

type RapProgressEntry = {
  id: string;
  year: number;
  targetSet: string | null;
  achieved: string | null;
  initiatives: string | null;
  targetMet: string;
  externalLink: string | null;
  nextYearTarget: string | null;
};

export function RapProgressForm({
  employerId,
  entry,
}: {
  employerId: string;
  entry?: RapProgressEntry;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      year: form.get("year"),
      targetSet: form.get("targetSet") || null,
      achieved: form.get("achieved") || null,
      initiatives: form.get("initiatives") || null,
      targetMet: form.get("targetMet"),
      externalLink: form.get("externalLink") || null,
      nextYearTarget: form.get("nextYearTarget") || null,
    };

    try {
      const url = entry
        ? `/api/admin/employers/${employerId}/rap-progress/${entry.id}`
        : `/api/admin/employers/${employerId}/rap-progress`;
      const res = await fetch(url, {
        method: entry ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/admin/employers/${employerId}/rap-progress`);
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
    if (!entry || !confirm("Are you sure you want to delete this progress entry?")) return;
    const res = await fetch(
      `/api/admin/employers/${employerId}/rap-progress/${entry.id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      router.push(`/admin/employers/${employerId}/rap-progress`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Progress Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Year *</label>
            <input
              name="year"
              type="number"
              required
              min={2000}
              max={2100}
              defaultValue={entry?.year}
              placeholder="e.g. 2025"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Target status</label>
            <select
              name="targetMet"
              defaultValue={entry?.targetMet || "IN_PROGRESS"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            >
              {TARGET_MET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-forest mb-1">What targets were set?</label>
          <textarea
            name="targetSet"
            rows={3}
            defaultValue={entry?.targetSet || ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest mb-1">What was achieved?</label>
          <textarea
            name="achieved"
            rows={3}
            defaultValue={entry?.achieved || ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest mb-1">Key initiatives delivered (up to 3)</label>
          <textarea
            name="initiatives"
            rows={3}
            defaultValue={entry?.initiatives || ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest mb-1">Link to annual report or evidence</label>
          <input
            name="externalLink"
            type="url"
            defaultValue={entry?.externalLink || ""}
            placeholder="https://..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest mb-1">Next year target</label>
          <textarea
            name="nextYearTarget"
            rows={3}
            defaultValue={entry?.nextYearTarget || ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        <div>
          {entry && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline"
            >
              Delete entry
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : entry ? "Update entry" : "Create entry"}
        </button>
      </div>
    </form>
  );
}
