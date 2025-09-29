"use client";

import { ArrowUp, ArrowDown, ExternalLink, Calendar, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/queries/news/use-news";
import Image from "next/image";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCategories = (categories: string) => {
    return categories.split("|").filter(Boolean);
  };

  const formatTags = (tags: string) => {
    return tags.split("|").slice(0, 3).filter(Boolean);
  };

  return (
    <Card
      className="
    group relative overflow-hidden border border-border/50 shadow-card 
    hover:shadow-lg hover:border-border transition-all duration-300 
    hover:-translate-y-[2px] 
    h-full flex flex-col
  "
    >
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative p-0 flex flex-col h-full">
        {/* 🖼️ Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={article.imageurl}
            alt={article.title}
            width={400}
            height={192}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 🔗 Source overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Image
              src={article.source_info.img}
              alt={article.source_info.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <span className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
              {article.source_info.name}
            </span>
          </div>
        </div>

        {/* 📄 Content */}
        <div className="p-6 flex flex-col flex-1 space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {formatCategories(article.categories).map((category, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-crypto-purple/20 text-crypto-purple border-crypto-purple/30 hover:bg-crypto-purple/30"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-crypto-purple transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>

          {/* Body */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {article.body}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {formatTags(article.tags).map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </div>
            ))}
          </div>

          {/* 📅 Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.published_on)}</span>
            </div>

            {/* Votes + Read */}
            <div className="flex items-center gap-4">
              {/* Voting */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-crypto-green">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{article.upvotes}</span>
                </div>
                <div className="flex items-center gap-1 text-crypto-red">
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {article.downvotes}
                  </span>
                </div>
              </div>

              {/* Read Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-crypto-purple hover:text-crypto-purple hover:bg-crypto-purple/10"
                asChild
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span>Read</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
