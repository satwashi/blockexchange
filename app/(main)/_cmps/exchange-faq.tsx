import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqData = [
  {
    question: "What is a cryptocurrency exchange?",
    answer:
      "A cryptocurrency exchange is a digital platform that allows users to buy, sell, and trade cryptocurrencies. It acts as an intermediary between buyers and sellers, providing secure transactions, wallet services, and market data to facilitate crypto trading.",
  },
  {
    question: "How to track cryptocurrency prices",
    answer:
      "You can track crypto prices through our real-time market data, price charts, and mobile app notifications. We provide 24/7 price monitoring, technical indicators, trading volume data, and customizable alerts for your favorite cryptocurrencies.",
  },
  {
    question: "How to trade cryptocurrencies on Block.trading",
    answer:
      "Start by creating and verifying your account, then deposit funds via bank transfer or crypto. Navigate to the trading interface, select your desired trading pair, choose between market or limit orders, and execute your trades with our advanced trading tools.",
  },

  {
    question: "How secure are cryptocurrency exchanges?",
    answer:
      "Security depends on the exchange. Reputable exchanges use two-factor authentication (2FA), cold storage for funds, encryption, and regular security audits. Users should also enable 2FA and use strong passwords.",
  },
  {
    question: "How secure are cryptocurrency exchanges?",
    answer:
      "Security depends on the exchange. Reputable exchanges use two-factor authentication (2FA), cold storage for funds, encryption, and regular security audits. Users should also enable 2FA and use strong passwords.",
  },
  {
    question: "How do exchanges handle KYC and AML regulations?",
    answer:
      "Exchanges comply with KYC (Know Your Customer) and AML (Anti-Money Laundering) regulations by verifying user identities, monitoring suspicious activity, and reporting to authorities as required.",
  },
];

export default function ExchangeFAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-16">
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-0">
        <Accordion type="single" collapsible>
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-border last:border-b-0"
            >
              <AccordionTrigger className="text-left py-6 hover:no-underline group">
                <div className="flex items-start gap-4 w-full pr-4">
                  <span className="text-lg md:text-xl font-medium text-muted-foreground flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-base md:text-lg font-medium text-foreground text-left leading-relaxed">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="ml-8 md:ml-10">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
