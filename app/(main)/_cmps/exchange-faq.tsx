import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Blockechange";

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
    question: `How to trade cryptocurrencies on ${appName}`,
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
    <section className="py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2">
            Quick answers to common questions about getting started and using
            the exchange.
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-3 md:p-5">
          <Accordion type="single" collapsible>
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="text-left py-6 md:py-7 px-2 md:px-3 hover:no-underline group">
                  <div className="flex items-start gap-4 w-full pr-4">
                    <span className="text-lg md:text-xl font-medium text-muted-foreground flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-base md:text-lg font-medium text-foreground text-left leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 md:pb-7 px-2 md:px-3">
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
    </section>
  );
}
