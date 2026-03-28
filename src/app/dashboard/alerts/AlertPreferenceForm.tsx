"use client";

import { useState } from "react";

const SECTORS = ["Resources", "Finance", "Health", "Government", "Construction", "Education", "Technology", "Other"];

export function AlertPreferenceForm({ sectors, locations }: { sectors: string[]; locations: string[] }) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>(sectors);
  const [locationText, setLocationText] = useState(locations.join(", "));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const locs = locationText.split(",").map(l => l.trim()).filter(Boolean);

    const res = await fetch("/api/jobseeker/alerts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectors: selectedSectors, locations: locs }),
    });

    if (res.ok) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
    }
  }

  function toggleSector(sector: string) {
    setSelectedSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="font-heading text-lg font-semibold text-forest mb-4">Sectors</h2>
        <p className="text-sm text-gray-500 mb-3">Select the sectors you&apos;re interested in.</p>
        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map(sector => (
            <label key={sector} className="flex items-center gap-2 text-sm text-forest">
              <input
                type="checkbox"
                checked={selectedSectors.includes(sector)}
                onChange={() => toggleSector(sector)}
                className="rounded border-gray-300 text-teal focus:ring-teal"
              />
              {sector}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="font-heading text-lg font-semibold text-forest mb-4">Locations</h2>
        <p className="text-sm text-gray-500 mb-3">Enter locations separated by commas.</p>
        <input
          type="text"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          placeholder="e.g. Sydney, Melbourne, Perth"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-teal hover:bg-teal-dark text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save preferences"}
      </button>
      {status === "error" && <p className="text-sm text-red-500">Failed to save. Please try again.</p>}
    </form>
  );
}
