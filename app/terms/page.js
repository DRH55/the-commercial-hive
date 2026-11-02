import Link from "next/link";
import LegalDoc, { LegalSection, LegalList } from "../components/LegalDoc";

export const metadata = {
  title: "Terms of Use",
  description: "The rules for using The Commercial Hive, including what you can post and how to describe your contributions.",
};

export default function TermsPage() {
  return (
    <LegalDoc eyebrow="Legal" title="Terms of Use" updated="2 November 2026">
      <p>
        By creating a profile or using The Commercial Hive, you agree to these terms and to our{" "}
        <Link href="/privacy" className="text-amber font-semibold">Privacy Policy</Link>. If you don't agree, please don't
        use the site. In these terms, "we" means The Commercial Hive.
      </p>

      <LegalSection heading="Your profile">
        <LegalList>
          <li>You must be 16 or over.</li>
          <li>Give accurate information, and keep one profile per person.</li>
          <li>Keep your password safe. You are responsible for what happens under your profile.</li>
          <li>You can delete your profile at any time from My Hive.</li>
        </LegalList>
      </LegalSection>

      <LegalSection heading="This is not legal advice">
        <p>
          Articles, challenges and discussions on the site are written by students, graduates and volunteer contributors to
          build commercial awareness. They are educational commentary, not legal, financial or professional advice, and they
          don't create a solicitor-client or any other professional relationship. We try to be accurate, but we don't
          guarantee that anything on the site is complete, correct or up to date. Please get advice from a qualified
          professional before acting on anything you read here.
        </p>
      </LegalSection>

      <LegalSection heading="What you post">
        <LegalList>
          <li>
            Your work remains yours. When you submit something, you give us a free, non-exclusive licence to store and
            display it on The Commercial Hive, including in links and previews of it, for as long as it is on the site.
          </li>
          <li>
            You confirm that what you submit is your own work, that you have credited any sources, and that it doesn't
            include confidential information. That includes anything you learned from an employer, law firm, client,
            placement or internship.
          </li>
          <li>
            Don't post anything unlawful, defamatory, discriminatory or abusive, or anything that infringes someone
            else's rights.
          </li>
          <li>
            Editors review articles before they are published, and may edit them for clarity, length and accuracy,
            decline them, or remove them later, including after publication. Publication is never guaranteed.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection heading="Discussions">
        <p>
          Discussions are for genuine, constructive debate about commercial ideas and topics. Be respectful, stay on topic,
          and don't post spam or promotion. Editors can remove any discussion or reply, and can remove profiles that
          repeatedly break these rules.
        </p>
      </LegalSection>

      <LegalSection heading="Contributor titles, badges and certificates">
        <LegalList>
          <li>
            Contributing is voluntary and unpaid. It is not employment, an internship or a work placement, and nothing on
            the site creates an employment or agency relationship between you and us.
          </li>
          <li>
            Contributor tiers (Guest, Monthly and Weekly) are awarded automatically based on how many of your articles we
            have published. Monthly and Weekly Contributors can download a certificate.
          </li>
          <li>
            Describe your role accurately. List it as volunteer experience, never as full-time or part-time employment,
            and only use a title once you have earned it. Public profiles show what you have published, so any claim can
            be checked.
          </li>
          <li>
            If an article is removed, your tier is recalculated. We may correct or remove a title, badge or certificate
            if it is being misdescribed or the work behind it no longer stands.
          </li>
        </LegalList>
        <p>
          Our <Link href="/about" className="text-amber font-semibold">About page</Link> shows exactly how to list your
          contribution on a CV or LinkedIn.
        </p>
      </LegalSection>

      <LegalSection heading="Our content">
        <p>
          The name, logo and design of The Commercial Hive belong to us. Articles belong to their authors. You are welcome
          to share links and short quotations with credit, but please don't copy the site or its articles wholesale.
        </p>
      </LegalSection>

      <LegalSection heading="Availability and liability">
        <p>
          The site is provided as it is. We will do our best to keep it running, but we can't promise it will always be
          available or free of errors, and we may change or remove features. To the extent the law allows, we aren't
          liable for loss that results from relying on content, from content posted by others, or from the site being
          unavailable. Nothing in these terms limits any liability that cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection heading="Ending your use of the site">
        <p>
          You can stop at any time by deleting your profile. We may suspend or remove profiles or content that break
          these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Changes and contact">
        <p>
          If we change these terms, we will update the date at the top, and continuing to use the site means you accept
          the updated terms. Questions? Email{" "}
          <a href="mailto:contact@thecommercialhive.com" className="text-amber font-semibold">contact@thecommercialhive.com</a>.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
