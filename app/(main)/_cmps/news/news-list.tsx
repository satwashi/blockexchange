"use client";

import { useNews } from "@/queries/news/use-news";
import { NewsCard } from "./news-card";
import { NewsCardSkeleton } from "../skeletons/news-card-skeleton";

export default function NewsSection() {
  const { news, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-6">
        <h2 className="text-2xl font-bold mb-6">📢 Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Failed to load news.</div>;
  }

  return (
    <div className="max-w-7xl mx-6">
      <h2 className="text-2xl font-bold mb-6">📢 Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news?.slice(0, 5).map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
}
