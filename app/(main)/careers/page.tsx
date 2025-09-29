"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function CareersPage() {
  const jobs = [
    {
      id: "sr-frontend-engineer",
      title: "Senior Frontend Engineer",
      location: "Remote (Global)",
      type: "Full-time",
      description:
        "Own end-to-end UX for trading flows, build performant interfaces, and collaborate with design.",
      requirements: [
        "5+ years with React/Next.js and TypeScript",
        "Experience with complex data-heavy UI",
        "Strong understanding of performance and accessibility",
      ],
    },
    {
      id: "sr-backend-engineer",
      title: "Senior Backend Engineer",
      location: "Hybrid – Bengaluru, IN",
      type: "Full-time",
      description:
        "Design scalable services for matching engine, wallets, and market data ingestion.",
      requirements: [
        "5+ years with Node.js/Go/Rust or similar",
        "Experience with databases and distributed systems",
        "Knowledge of security and compliance best practices",
      ],
    },
    {
      id: "product-designer",
      title: "Product Designer",
      location: "Remote (EMEA/ASIA)",
      type: "Contract or Full-time",
      description:
        "Craft delightful experiences for onboarding, KYC, and trading workflows.",
      requirements: [
        "Portfolio showcasing shipped fintech/crypto products",
        "Proficiency with Figma and design systems",
        "Strong interaction and visual design skills",
      ],
    },
  ];

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeJobId) || null,
    [activeJobId]
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    resumeUrl: "",
    note: "",
  });
  const isFormValid =
    form.name.trim().length > 1 &&
    /.+@.+\..+/.test(form.email) &&
    form.resumeUrl.trim().length > 5;

  function resetForm() {
    setForm({ name: "", email: "", resumeUrl: "", note: "" });
  }

  async function handleApplySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: submit to API later
    toast.success(
      `Application submitted for ${activeJob?.title}. We will get back to you soon.`
    );
    setActiveJobId(null);
    resetForm();
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Careers</h1>
      <p className="text-muted-foreground max-w-2xl mb-8">
        Join us in building a secure, fast, and user-first crypto exchange. We
        value ownership, curiosity, and craftsmanship. Competitive comp,
        flexible work, and meaningful impact.
      </p>
      <div className="space-y-6">
        {jobs.map((job) => (
          <section
            key={job.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {job.location} • {job.type}
                </p>
                <p className="text-muted-foreground mt-3">{job.description}</p>
              </div>
              <button
                onClick={() => setActiveJobId(job.id)}
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Apply now
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Requirements</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setActiveJobId(null)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-lg border bg-card text-card-foreground shadow-xl">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Apply: {activeJob.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activeJob.location} • {activeJob.type}
                </p>
              </div>
              <button
                onClick={() => setActiveJobId(null)}
                className="rounded-md px-3 py-1 text-sm hover:bg-accent"
              >
                Close
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleApplySubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Resume link
                </label>
                <input
                  value={form.resumeUrl}
                  onChange={(e) =>
                    setForm({ ...form, resumeUrl: e.target.value })
                  }
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 min-h-[90px]"
                  placeholder="Anything else you'd like us to know"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveJobId(null)}
                  className="rounded-md px-4 py-2 text-sm hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  Submit application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
