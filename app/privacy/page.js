import Link from "next/link";
import LegalDoc, { LegalSection, LegalList } from "../components/LegalDoc";

export const metadata = {
  title: "Privacy Policy",
  description: "What personal information The Commercial Hive collects, who can see it, and how to delete it.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc eyebrow="Legal" title="Privacy Policy" updated="2 November 2026">
      <p>
        The Commercial Hive is a community where law and business students and graduates build commercial awareness,
        publish short analysis, and keep a public portfolio. This page explains what personal information we collect,
        why we collect it, who can see it, and how to remove it. In this policy, "we" means The Commercial Hive. You can
        reach us at <a href="mailto:contact@thecommercialhive.com" className="text-amber font-semibold">contact@thecommercialhive.com</a>.
      </p>

      <LegalSection heading="What we collect">
        <LegalList>
          <li>
            <strong className="text-charcoal">What you give us when you create a profile:</strong> your name, email
            address and password, and optionally your university, course, bio, goals, profile photo and LinkedIn link.
            Your password is handled by our sign-in provider and stored in scrambled (hashed) form. We never see it.
          </li>
          <li>
            <strong className="text-charcoal">What you add to the site:</strong> articles you submit, challenge
            responses, discussion posts and replies, likes, glossary terms you add, and any application you send with
            your interests and a writing sample.
          </li>
          <li>
            <strong className="text-charcoal">What we work out from your activity:</strong> your badges, contributor
            tier and certificate, which are calculated automatically from what you have published and done on the site.
          </li>
          <li>
            <strong className="text-charcoal">Basic visit data:</strong> we count page views and visits in aggregate using
            Vercel Web Analytics. It doesn't use cookies and doesn't build profiles of individual visitors.
          </li>
        </LegalList>
        <p>
          Your browser also keeps a sign-in token so you stay signed in. The site needs it to work, we don't use it to
          track you, and we don't use advertising or marketing cookies.
        </p>
      </LegalSection>

      <LegalSection heading="What is public and what is not">
        <p>
          <strong className="text-charcoal">Public to anyone with the link, no sign-in needed:</strong> your name, photo,
          university, course, bio, goals, LinkedIn link, contributor tier and badges, your published articles, and your
          discussion posts and replies. Challenge responses may also be visible to other visitors.
        </p>
        <p>
          <strong className="text-charcoal">Not public:</strong> your email address and password. Your email is used for
          your account and is visible only to the site's editors. Applications to contribute are also visible only to
          editors.
        </p>
        <p>
          We ask search engines not to list member profile pages or the contributors directory. Published articles carry
          the author's name and may appear in search results. We can't control other websites that copy or link to
          public content.
        </p>
      </LegalSection>

      <LegalSection heading="Why we use it">
        <LegalList>
          <li>
            To run your account, show your profile, and publish your contributions. This is needed to provide the
            service you signed up for.
          </li>
          <li>To send emails that are part of your account, such as a password reset link.</li>
          <li>
            To keep the site secure, prevent misuse, and understand which pages are used. This is our legitimate interest
            in running a safe and useful site.
          </li>
        </LegalList>
        <p>
          We don't sell your information and we don't use it for advertising. The only automated decision on the site is
          the calculation of your contributor tier, which is based on how many of your articles have been published.
        </p>
      </LegalSection>

      <LegalSection heading="Who handles it for us">
        <LegalList>
          <li>
            <strong className="text-charcoal">Supabase</strong> provides our database, sign-in and file storage. Our data
            is stored in Ireland.
          </li>
          <li>
            <strong className="text-charcoal">Vercel</strong> hosts the website and provides aggregate analytics. Vercel
            may process data in other countries, using recognised legal safeguards for international transfers.
          </li>
        </LegalList>
        <p>We don't share your information with anyone else unless the law requires it.</p>
      </LegalSection>

      <LegalSection heading="How long we keep it, and deleting your profile">
        <p>
          We keep your information until you delete your profile. You can do that yourself at any time: sign in, open{" "}
          <Link href="/profile" className="text-amber font-semibold">My Hive</Link>, and scroll to the bottom. Deleting
          permanently removes your login, profile, photo, articles, discussions, replies, challenge responses, likes and
          applications, and it takes effect straight away.
        </p>
        <p>
          Copies that other people have made of public content, such as a screenshot or a shared link preview, are outside
          our control.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          If you are in the UK or EU, you have the right to ask for a copy of your information, to have it corrected or
          deleted, to restrict or object to how it is used, and to receive it in a portable format. You can edit or delete
          most of your information yourself in My Hive. For anything else, email us and we will reply within one month.
        </p>
        <p>
          If you are unhappy with how we have handled your information, you can complain to your data protection
          authority. In the UK, that is the Information Commissioner's Office at ico.org.uk.
        </p>
      </LegalSection>

      <LegalSection heading="Who this is for">
        <p>The Commercial Hive is aimed at university students and graduates. It is not intended for anyone under 16.</p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          If we change this policy, we will update the date at the top. If the change is significant, we will also put a
          notice on the site. Our <Link href="/terms" className="text-amber font-semibold">Terms of Use</Link> explain the
          rules for using The Commercial Hive.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
