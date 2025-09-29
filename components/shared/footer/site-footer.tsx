"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Mail } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded bg-primary" />
              <span className="text-xl font-bold text-primary">
                Blockechange
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Trade smarter with a modern, secure, and lightning‑fast crypto
              platform.
            </p>
            <div className="h-6" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/wallet"
                  className="hover:text-primary transition-colors"
                >
                  Wallet
                </a>
              </li>
              <li>
                <a
                  href="/market"
                  className="hover:text-primary transition-colors"
                >
                  Market
                </a>
              </li>
              <li>
                <a
                  href="/trading"
                  className="hover:text-primary transition-colors"
                >
                  Trade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="hover:text-primary transition-colors"
                >
                  News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Stay in the loop</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Subscribe for updates, market news, and feature launches.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                />
              </div>
              <Button type="submit">Subscribe</Button>
            </form>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>No spam, unsubscribe anytime.</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2022 Blockechange. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Globe className="h-4 w-4" /> EN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
