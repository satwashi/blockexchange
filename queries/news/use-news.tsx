"use client";
import { useQuery } from "@tanstack/react-query";
export interface SourceInfo {
  name: string;
  img?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  body?: string;
  source: string;
  url: string;
  published_on: number;
  imageurl?: string;

  // Additional properties used in NewsCard
  source_info: SourceInfo;
  categories: string; // "category1|category2"
  tags: string; // "tag1|tag2"
  upvotes: number;
  downvotes: number;
}
const fetchNews = async (): Promise<NewsArticle[]> => {
  const res = await fetch(
    "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
  );
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.Data; // CryptoCompare uses Data key
};

export const useNews = () => {
  const { data, isLoading, error } = useQuery<NewsArticle[], Error>({
    queryKey: ["cryptoNews"],
    queryFn: fetchNews,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });

  return { news: data ?? [], isLoading, error };
};
