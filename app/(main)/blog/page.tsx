"use client";

import { useMemo, useState } from "react";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Blockechange";

export default function BlogPage() {
  const posts = [
    {
      id: "launch-announcement",
      title: `${appName} Beta Launch`,
      date: "2025-08-15",
      excerpt:
        `We are excited to announce the beta launch of ${appName} — a fast, secure, and user-first crypto exchange.`,
      content:
        "Today we are opening our beta to early users. Expect low-latency order placement, robust security, and a clean UX. Sign up, give us feedback, and help shape the roadmap!",
    },
    {
      id: "security-update",
      title: `Security at ${appName}`,
      date: "2025-09-01",
      excerpt:
        "An overview of our multi-layer security model, custody practices, and continuous monitoring.",
      content:
        "Security is fundamental. We use hardware-backed keys, segregated wallets, real-time monitoring, and independent audits. Learn how our defense-in-depth approach protects your assets.",
    },
    {
      id: "roadmap-q4",
      title: "Q4 Roadmap Highlights",
      date: "2025-09-20",
      excerpt:
        "From new asset listings to advanced order types and mobile apps — here’s what’s coming next.",
      content:
        "We are focusing on expanding asset coverage, launching mobile apps, and adding advanced order types including OCO and trailing stops. Community requests are guiding our priorities.",
    },
  ];
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const activePost = useMemo(
    () => posts.find((p) => p.id === activePostId) || null,
    [activePostId]
  );
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-muted-foreground mb-3">{post.date}</p>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <button
              onClick={() => setActivePostId(post.id)}
              className="text-primary hover:underline font-medium"
            >
              Read more
            </button>
          </article>
        ))}
      </div>
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setActivePostId(null)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border bg-card text-card-foreground shadow-xl">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{activePost.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activePost.date}
                </p>
              </div>
              <button
                onClick={() => setActivePostId(null)}
                className="rounded-md px-3 py-1 text-sm hover:bg-accent"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {activePost.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
