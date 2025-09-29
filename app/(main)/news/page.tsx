"use client";
import NewsSection from "../_cmps/news/news-list";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-6">
        <h1 className="text-2xl font-bold mb-6">News</h1>
        <NewsSection />
      </div>
    </div>
  );
}
