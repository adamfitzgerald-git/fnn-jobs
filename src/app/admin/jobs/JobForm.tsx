"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "CASUAL", label: "Casual" },
];

const WORK_MODES = [
  { value: "ON_SITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
];

type Job = {
  id: string;
  title: string;
  employerId: string;
  location: string;
  workMode: string;
  employmentType: string;
  salaryRange: string | null;
  identifiedRole: boolean;
  featured: boolean;
  description: string;
  applyMethod: string;
  applyValue: string;
  closingDate: Date | string | null;
  status: string;
};

export function JobForm({
  job,
  employers,
  isSuperAdmin,
}: {
  job?: Job;
  employers: { id: string; name: string }[];
  isSuperAdmin: boolean;
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
      title: form.get("title"),
      employerId: form.get("employerId"),
      location: form.get("location"),
      workMode: form.get("workMode"),
      employmentType: form.get("employmentType"),
      salaryRange: form.get("salaryRange") || null,
      identifiedRole: form.get("identifiedRole") === "on",
      featured: form.get("featured") === "on",
      description: form.get("description"),
      applyMethod: form.get("applyMethod"),
      applyValue: form.get("applyValue"),
      closingDate: form.get("closingDate") || null,
      status: form.get("status"),
    };

    try {
      const url = job ? `/api/admin/jobs/${job.id}` : "/api/admin/jobs";
      const res = await fetch(url, {
        method: job ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/jobs");
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
    if (!job || !confirm("Are you sure you want to delete this job?")) return;
    const res = await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/jobs");
      router.refresh();
    }
  }

  const closingDateStr = job?.closingDate
    ? new Date(job.closingDate).toISOString().split("T")[0]
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Job details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-forest mb-1">Job title *</label>
            <input name="title" required defaultValue={job?.title} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          {(isSuperAdmin || !job) && (
            <div>
              <label className="block text-sm font-medium text-forest mb-1">Employer *</label>
              <select name="employerId" required defaultValue={job?.employerId || ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
                <option value="" disabled>Select employer</option>
                {employers.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Location *</label>
            <input name="location" required defaultValue={job?.location} placeholder="e.g. Sydney, NSW" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Work mode</label>
            <select name="workMode" defaultValue={job?.workMode || "ON_SITE"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              {WORK_MODES.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Employment type</label>
            <select name="employmentType" defaultValue={job?.employmentType || "FULL_TIME"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              {EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Salary range</label>
            <input name="salaryRange" defaultValue={job?.salaryRange || ""} placeholder="e.g. $80,000–$95,000 + super" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Closing date</label>
            <input name="closingDate" type="date" defaultValue={closingDateStr} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Status</label>
            <select name="status" defaultValue={job?.status || "DRAFT"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-forest">
          <input type="checkbox" name="identifiedRole" defaultChecked={job?.identifiedRole} className="rounded border-gray-300 text-amber focus:ring-amber" />
          Identified Role — open to Aboriginal and Torres Strait Islander applicants
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-forest">
          <input type="checkbox" name="featured" defaultChecked={job?.featured} className="rounded border-gray-300 text-teal focus:ring-teal" />
          Featured listing — pinned to top of job listings
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">Description</h2>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Job description (HTML supported) *</label>
          <textarea name="description" required rows={12} defaultValue={job?.description} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal font-mono" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-forest">How to apply</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Apply method *</label>
            <select name="applyMethod" defaultValue={job?.applyMethod || "EMAIL"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal">
              <option value="EMAIL">Email</option>
              <option value="URL">External URL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Apply email / URL *</label>
            <input name="applyValue" required defaultValue={job?.applyValue} placeholder="email@example.com or https://..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal" />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        <div>
          {job && (
            <button type="button" onClick={handleDelete} className="text-sm text-red-600 hover:underline">
              Delete job
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : job ? "Update job" : "Create job"}
        </button>
      </div>
    </form>
  );
}
