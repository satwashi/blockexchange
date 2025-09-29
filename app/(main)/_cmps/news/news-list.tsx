"use client";

import { useNews } from "@/queries/news/use-news";
import { NewsCard } from "./news-card";
import { NewsCardSkeleton } from "../skeletons/news-card-skeleton";
import Link from "next/link";

export default function NewsSection() {
  const { news, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              📢 Latest News
            </h2>
            <p className="text-muted-foreground mt-1">
              Product updates, announcements, and market insights.
            </p>
          </div>
          <div className="hidden md:block h-8 w-28 rounded-full bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-stretch">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full max-w-md md:max-w-none px-2">
              <NewsCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Failed to load news.</div>;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              📢 Latest News
            </h2>
            <p className="text-muted-foreground mt-1">
              Product updates, announcements, and market insights.
            </p>
          </div>
          <Link
            href="/news"
            className="mt-3 md:mt-0 text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-stretch">
          {news?.slice(0, 6).map((article, index) => (
            <div key={index} className="w-full max-w-md md:max-w-none px-2">
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
