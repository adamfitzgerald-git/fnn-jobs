"use client";

import { useEffect } from "react";

export function TrackPageView({ employerId, jobId }: { employerId?: string; jobId?: string }) {
  useEffect(() => {
    fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerId, jobId }),
    }).catch(() => {}); // fire and forget
  }, [employerId, jobId]);

  return null;
}
