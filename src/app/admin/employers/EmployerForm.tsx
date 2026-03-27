"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTORS = ["Resources", "Finance", "Health", "Government", "Construction", "Education", "Technology", "Other"];
const RAP_TIERS = [
  { value: "NONE", label: "No RAP" },
  { value: "REFLECT", label: "Reflect" },
  { value: "INNOVATE", label: "Innovate" },
  { value: "STRETCH", label: "Stretch" },
  { value: "ELEVATE", label: "Elevate" },
];

type Employer = {
  id: string;
  name: string;
  sector: string;
  headquarters: string | null;
  websiteUrl: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  rapTier: string;
  videoUrl: string | null;
  logo: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  xUrl: string | null;
  contactName: string | null;
  contactEmail: string | null;
  status: string;
  photoGallery: string[];
};

export function EmployerForm({ employer }: { employer?: Employer }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      sector: form.get("sector"),
      headquarters: form.get("headquarters") || null,
      websiteUrl: form.get("websiteUrl") || null,
      shortDescription: form.get("shortDescription") || null,
      fullDescription: form.get("fullDescription") || null,
      rapTier: form.get("rapTier"),
      videoUrl: form.get("videoUrl") || null,
      logo: form.get("logo") || null,
      linkedinUrl: form.get("linkedinUrl") || null,
      facebookUrl: form.get("facebookUrl") || null,
      instagramUrl: form.get("instagramUrl") || null,
      xUrl: form.get("xUrl") || null,
      contactName: form.get("contactName") || null,
      contactEmail: form.get("contactEmail") || null,
      status: form.get("status"),
    };

    try {
      const url = employer
        ? `/api/admin/employers/${employer.id}`
        : "/api/admin/employers";
      const res = await fetch(url, {
        method: employer ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/employers");
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
    if (!employer || !confirm("Are you sure you want to delete this employer?")) return;
    const res = await fetch(`/api/admin/employers/${employer.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/employers");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Basic information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Company name *</label>
            <input name="name" required defaultValue={employer?.name} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Sector *</label>
            <select name="sector" required defaultValue={employer?.sector || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              <option value="" disabled>Select sector</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Headquarters</label>
            <input name="headquarters" defaultValue={employer?.headquarters || ""} placeholder="e.g. Sydney, NSW" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Website URL</label>
            <input name="websiteUrl" type="url" defaultValue={employer?.websiteUrl || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">RAP tier</label>
            <select name="rapTier" defaultValue={employer?.rapTier || "NONE"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              {RAP_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Status</label>
            <select name="status" defaultValue={employer?.status || "DRAFT"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Logo URL</label>
          <input name="logo" defaultValue={employer?.logo || ""} placeholder="https://..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Short description (~100 words)</label>
          <textarea name="shortDescription" rows={3} defaultValue={employer?.shortDescription || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Full description (HTML supported)</label>
          <textarea name="fullDescription" rows={8} defaultValue={employer?.fullDescription || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal font-mono" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Media</h2>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Video URL (YouTube / Vimeo)</label>
          <input name="videoUrl" defaultValue={employer?.videoUrl || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Social links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">LinkedIn</label>
            <input name="linkedinUrl" defaultValue={employer?.linkedinUrl || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Facebook</label>
            <input name="facebookUrl" defaultValue={employer?.facebookUrl || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Instagram</label>
            <input name="instagramUrl" defaultValue={employer?.instagramUrl || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">X (Twitter)</label>
            <input name="xUrl" defaultValue={employer?.xUrl || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Contact name</label>
            <input name="contactName" defaultValue={employer?.contactName || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Contact email</label>
            <input name="contactEmail" type="email" defaultValue={employer?.contactEmail || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        <div>
          {employer && (
            <button type="button" onClick={handleDelete} className="text-sm text-red-600 hover:underline">
              Delete employer
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : employer ? "Update employer" : "Create employer"}
        </button>
      </div>
    </form>
  );
}
