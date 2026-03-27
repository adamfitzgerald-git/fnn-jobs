"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function EnquiryForm({
  employerId,
  employerName,
}: {
  employerId: string;
  employerName: string;
}) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!session) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-600 mb-3">
          Sign in to send an enquiry to {employerName}.
        </p>
        <Link
          href="/login"
          className="inline-block bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="text-center py-4">
        <p className="text-teal font-medium">Enquiry sent!</p>
        <p className="text-sm text-gray-500 mt-1">
          {employerName} will receive your message.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const message = new FormData(form).get("message") as string;

    try {
      const res = await fetch("/api/employers/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId, message }),
      });
      if (res.ok) {
        setStatus("sent");
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
        <label htmlFor="message" className="block text-sm font-medium text-forest mb-1">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={`I'm interested in opportunities at ${employerName}...`}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-teal hover:bg-teal-dark text-white py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
