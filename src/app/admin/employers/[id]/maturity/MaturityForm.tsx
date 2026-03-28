"use client";

import { useState } from "react";

const DIMENSIONS = [
  { key: "EMPLOYMENT", label: "Employment", description: "Current % of First Nations employees, hiring targets, recruitment process adaptations, Identified roles offered" },
  { key: "LEADERSHIP", label: "Leadership", description: "Senior leaders with cultural competency training, Indigenous advisory representation at board/exec level" },
  { key: "CULTURAL_SAFETY", label: "Cultural Safety", description: "Cultural leave policy, NAIDOC week observance, cultural protocols, First Nations employee network" },
  { key: "SUPPLIER_DIVERSITY", label: "Supplier Diversity", description: "% of spend with Indigenous suppliers, active supplier relationships, procurement targets" },
  { key: "COMMUNITY_ENGAGEMENT", label: "Community Engagement", description: "Paid partnerships, community investment, pro-bono support, engagement beyond the workplace" },
  { key: "RAP_ACCOUNTABILITY", label: "RAP Accountability", description: "RAP tier, reporting history, whether targets were met, Reconciliation Australia relationship" },
  { key: "MEASUREMENT", label: "Measurement", description: "Whether employment and engagement data is formally tracked, reported, and publicly disclosed" },
];

interface DimensionData {
  dimension: string;
  summary: string | null;
  initiatives: string | null;
  evidence: string | null;
  status: string | null;
}

interface MaturityFormProps {
  employerId: string;
  dimensions: DimensionData[];
}

export function MaturityForm({ employerId, dimensions }: MaturityFormProps) {
  const initialData: Record<string, { summary: string; initiatives: string; evidence: string; status: string }> = {};
  for (const dim of DIMENSIONS) {
    const existing = dimensions.find((d) => d.dimension === dim.key);
    initialData[dim.key] = {
      summary: existing?.summary ?? "",
      initiatives: existing?.initiatives ?? "",
      evidence: existing?.evidence ?? "",
      status: existing?.status ?? "",
    };
  }

  const [formData, setFormData] = useState(initialData);
  const [openKey, setOpenKey] = useState<string | null>(DIMENSIONS[0].key);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(
    new Set(dimensions.map((d) => d.dimension))
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (dimensionKey: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [dimensionKey]: { ...prev[dimensionKey], [field]: value },
    }));
  };

  const handleSave = async (dimensionKey: string) => {
    setSaving(dimensionKey);
    setError(null);

    try {
      const res = await fetch(`/api/admin/employers/${employerId}/maturity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dimension: dimensionKey,
          ...formData[dimensionKey],
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save");
      }

      setSavedKeys((prev) => new Set([...prev, dimensionKey]));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(null);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {DIMENSIONS.map((dim) => {
        const isOpen = openKey === dim.key;
        const isSaved = savedKeys.has(dim.key);
        const isSaving = saving === dim.key;

        return (
          <div
            key={dim.key}
            className="bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <button
              type="button"
              onClick={() => toggleAccordion(dim.key)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                {isSaved ? (
                  <svg
                    className="h-5 w-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
                <div>
                  <span className="font-heading font-semibold text-forest">
                    {dim.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dim.description}
                  </p>
                </div>
              </div>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary
                  </label>
                  <textarea
                    rows={3}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                    placeholder="Describe your organisation's current position in this area..."
                    value={formData[dim.key].summary}
                    onChange={(e) => handleChange(dim.key, "summary", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Initiatives
                  </label>
                  <textarea
                    rows={3}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                    placeholder="List active programs, policies, or commitments..."
                    value={formData[dim.key].initiatives}
                    onChange={(e) => handleChange(dim.key, "initiatives", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evidence
                  </label>
                  <textarea
                    rows={2}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                    placeholder="Links to reports, public data, or third-party verification..."
                    value={formData[dim.key].evidence}
                    onChange={(e) => handleChange(dim.key, "evidence", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                    value={formData[dim.key].status}
                    onChange={(e) => handleChange(dim.key, "status", e.target.value)}
                  >
                    <option value="">Select status...</option>
                    <option value="strong">Strong</option>
                    <option value="developing">Developing</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleSave(dim.key)}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-teal text-white text-sm font-medium rounded-md hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Dimension"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
