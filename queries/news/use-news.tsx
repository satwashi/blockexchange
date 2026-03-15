"use client";
import { useQuery } from "@tanstack/react-query";

export interface SourceInfo {
  name: string;
  img?: string;
}

export interface NewsArticle {
  article_id: string;
  title: string;
  description?: string;
  content?: string;
  link: string;
  pubDate: string;
  image_url?: string;
  source_id: string;
  source_url?: string;
  source_icon?: string;
  category: string[];
  ai_tag?: string;
  sentiment?: string;
  country?: string[];
  language?: string;
  creator?: string[];
  keywords?: string[];

  // Computed by the server API route
  source_info: SourceInfo;
}

const fetchNews = async (): Promise<NewsArticle[]> => {
  // Fetch from our own cached API route — not newsdata.io directly
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error("Failed to fetch news from server");

  const data = await res.json();

  // Our API route returns an error object on failure
  if (data.error) {
    throw new Error(data.error);
  }

  return Array.isArray(data) ? data : [];
};

export const useNews = () => {
  const { data, isLoading, error } = useQuery<NewsArticle[], Error>({
    queryKey: ["cryptoNews"],
    queryFn: fetchNews,
    // Client refetches every 24h — server cache handles the rest
    refetchInterval: 24 * 60 * 60 * 1000,
    staleTime: 12 * 60 * 60 * 1000,
  });

  const news = Array.isArray(data) ? data : [];

  return { news, isLoading, error };
};
