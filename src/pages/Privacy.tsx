import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SITE } from "@/lib/site";

export default function Privacy() {
  return (
    <Layout>
      <SEO title="Privacy Policy" description={`Read the ${SITE.name} privacy policy covering data collection, cookies, advertising and user rights.`} path="/privacy" />
      <div className="container-prose py-14">
        <span className="kicker text-primary">Legal</span>
        <h1 className="headline-hero mt-2">Privacy Policy</h1>
        <p className="text-sm text-byline mt-3">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <div className="prose-article mt-8">
          <p>This Privacy Policy explains how {SITE.name} ("we", "us") collects, uses and protects your information when you visit our website.</p>
          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Usage data</strong> — pages viewed, referrer, device and browser information, collected automatically via standard web logs and analytics.</li>
            <li><strong>Information you provide</strong> — name, email and message content if you contact us via our form.</li>
            <li><strong>Cookies</strong> — small files used to remember preferences and measure traffic.</li>
          </ul>
          <h2>How We Use Information</h2>
          <p>We use information to operate the site, understand readership, prevent abuse, and respond to enquiries. We do not sell personal data.</p>
          <h2>Advertising & Google AdSense</h2>
          <p>Third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users. Users may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</p>
          <h2>Analytics</h2>
          <p>We may use privacy-respecting analytics to understand which content is most read. Aggregated data does not identify individual users.</p>
          <h2>Your Rights</h2>
          <p>You may request access to, correction of, or deletion of personal information we hold about you by emailing privacy@pulsedaily.app.</p>
          <h2>Children</h2>
          <p>Our content is not directed at children under 13 and we do not knowingly collect data from them.</p>
          <h2>Changes</h2>
          <p>We may update this policy from time to time. Material changes will be reflected via the "last updated" date above.</p>
        </div>
      </div>
    </Layout>
  );
}
