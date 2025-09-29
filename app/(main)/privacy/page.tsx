import { email } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="rounded-xl border bg-card text-card-foreground p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Your privacy matters. Learn what we collect, why we collect it, and
            how we protect your data.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <nav className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <a
              href="#collect"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Information we collect
            </a>
            <a
              href="#use"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              How we use information
            </a>
            <a
              href="#sharing"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Data sharing
            </a>
            <a
              href="#retention"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Data retention
            </a>
            <a
              href="#security"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Security
            </a>
            <a
              href="#rights"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Your rights
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
            id="collect"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                Account data: name, email, and verification (KYC) details.
              </li>
              <li>Usage data: device, IP, logs, and interaction analytics.</li>
              <li>Financial data: payment methods and transaction history.</li>
            </ul>
          </section>

          <section id="use" className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">How We Use Information</h2>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground space-y-1">
              <li>Provide and improve our services, including support.</li>
              <li>
                Comply with legal obligations and regulatory requirements.
              </li>
              <li>Protect users and our platform from fraud and abuse.</li>
            </ul>
          </section>

          <section
            id="sharing"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Data Sharing</h2>
            <p className="mt-3 text-muted-foreground">
              We do not sell your personal information. We may share limited
              data with vetted service providers (e.g., KYC, analytics,
              infrastructure) under strict agreements, and with regulators or
              law enforcement when required.
            </p>
          </section>

          <section
            id="retention"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Data Retention</h2>
            <p className="mt-3 text-muted-foreground">
              We retain data only as long as necessary for the purposes
              described or as mandated by law.
            </p>
          </section>

          <section
            id="security"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="mt-3 text-muted-foreground">
              We use encryption in transit and at rest, role-based access, and
              continuous monitoring to safeguard data. No system is perfectly
              secure; we work continually to strengthen defenses.
            </p>
          </section>

          <section
            id="rights"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Your Rights</h2>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground space-y-1">
              <li>Access, update, or delete certain personal information.</li>
              <li>Export your data where applicable.</li>
              <li>Object to or restrict certain processing.</li>
            </ul>
          </section>

          <section
            id="contact"
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-3 text-muted-foreground">
              Questions? Contact{" "}
              <a
                className="text-primary hover:underline"
                href={`mailto:${email("privacy")}`}
              >
                {email("privacy")}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
