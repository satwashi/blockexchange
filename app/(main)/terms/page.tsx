import { email } from "@/lib/site";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Blockechange";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="rounded-xl border bg-card text-card-foreground p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            These Terms govern your use of {appName}. By accessing or using
            the platform, you agree to these Terms.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <nav className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <a
              href="#eligibility"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Eligibility
            </a>
            <a
              href="#accounts"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Accounts
            </a>
            <a
              href="#prohibited"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Prohibited activities
            </a>
            <a
              href="#risk"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Risk disclosure
            </a>
            <a
              href="#fees"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Fees
            </a>
            <a
              href="#liability"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Liability
            </a>
            <a
              href="#changes"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Changes
            </a>
            <a
              href="#contact"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Contact
            </a>
          </div>
        </nav>

        <div className="space-y-6">
          <section
            id="eligibility"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Eligibility</h2>
            <p className="mt-3 text-muted-foreground">
              You must be of legal age and not barred by sanctions or applicable
              law to use the services.
            </p>
          </section>

          <section
            id="accounts"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Accounts</h2>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                You are responsible for safeguarding your credentials and
                account activity.
              </li>
              <li>Provide accurate information and keep it up to date.</li>
            </ul>
          </section>

          <section
            id="prohibited"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Prohibited Activities</h2>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                Illegal transactions, market manipulation, or attempts to breach
                security.
              </li>
              <li>
                Use of the service in violation of applicable laws and
                regulations.
              </li>
            </ul>
          </section>

          <section
            id="risk"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Risk Disclosure</h2>
            <p className="mt-3 text-muted-foreground">
              Crypto assets are volatile and carry risk, including potential
              loss of principal. Do your own research.
            </p>
          </section>

          <section
            id="fees"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Fees</h2>
            <p className="mt-3 text-muted-foreground">
              Fees may apply to trades, withdrawals, or other services. See the
              fees page for details.
            </p>
          </section>

          <section
            id="liability"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              Disclaimer and Limitation of Liability
            </h2>
            <p className="mt-3 text-muted-foreground">
              Services are provided &quot;as is&quot; without warranties.
              Liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section
            id="changes"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Changes</h2>
            <p className="mt-3 text-muted-foreground">
              We may update these Terms. Continued use after changes means you
              accept the updated Terms.
            </p>
          </section>

          <section
            id="contact"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-3 text-muted-foreground">
              For questions about these Terms, contact{" "}
              <a
                className="text-primary hover:underline"
                href={`mailto:${email("legal")}`}
              >
                {email("legal")}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
