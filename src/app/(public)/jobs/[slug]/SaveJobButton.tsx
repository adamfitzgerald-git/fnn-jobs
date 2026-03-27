"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetch(`/api/jobs/saved?jobId=${jobId}`)
        .then((r) => r.json())
        .then((data) => setSaved(data.saved))
        .catch(() => {});
    }
  }, [session, jobId]);

  if (!session) {
    return (
      <Link
        href="/login"
        className="block w-full text-center border-2 border-forest text-forest py-2.5 rounded-md text-sm font-medium hover:bg-forest hover:text-white transition-colors"
      >
        Sign in to save job
      </Link>
    );
  }

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/saved", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) setSaved(!saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors border-2 ${
        saved
          ? "bg-forest text-white border-forest"
          : "border-forest text-forest hover:bg-forest hover:text-white"
      } disabled:opacity-50`}
    >
      {saved ? "★ Saved" : "☆ Save this job"}
    </button>
  );
}
