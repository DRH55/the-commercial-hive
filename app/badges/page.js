import Link from "next/link";
import { Award, Star, Flame, MessageSquare, Layers, Trophy, FileText } from "lucide-react";

const ACHIEVEMENT_BADGES = [
  { icon: Star, name: "First Step", desc: "Made your first contribution", how: "Submit an article, respond to a challenge, or reply in a discussion." },
  { icon: FileText, name: "Applicant", desc: "Applied to become a contributor", how: "Submit an application on the Apply to Contribute page." },
  { icon: Flame, name: "Sharp Thinker", desc: "Submitted 3 challenge responses", how: "Take on 3 commercial scenarios in the Challenges section." },
  { icon: MessageSquare, name: "In The Room", desc: "Posted 3 discussion replies", how: "Join the conversation on 3 discussion threads." },
  { icon: Layers, name: "Well Rounded", desc: "Contributed across 2+ categories", how: "Write articles or take challenges spanning at least two practice areas (e.g. Corporate and Technology)." },
  { icon: Trophy, name: "Hive Regular", desc: "Made 6+ contributions", how: "Any mix of articles, challenge responses, and discussion replies, 6 or more in total." },
];

const TIERS = [
  { name: "Guest Contributor", desc: "Invited to contribute a one-off piece" },
  { name: "Monthly Contributor", desc: "Publishes on a monthly cadence" },
  { name: "Weekly Contributor", desc: "Publishes on a weekly cadence" },
];

export default function BadgesPage() {
  return (
    <section className="max-w-[860px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">How It Works</div>
      <h1 className="text-[30px] max-w-[640px]">Badges and contributor tiers</h1>
      <p className="mt-3 text-charcoal-soft max-w-[600px] leading-relaxed">
        Anyone with a profile can submit an article, take on a challenge, or join a discussion.
        Badges are how the Hive recognises what you've actually done, visible on your{" "}
        <Link href="/profile" className="text-amber font-semibold">public profile</Link>.
      </p>

      <div className="mt-10">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Earned automatically</div>
        <h2 className="text-xl">Achievement badges</h2>
        <p className="text-[13.5px] text-charcoal-soft mt-1.5">These are calculated from your real activity, no application needed.</p>
        <div className="grid gap-4 sm:grid-cols-2 mt-5">
          {ACHIEVEMENT_BADGES.map((b) => (
            <div key={b.name} className="card flex gap-3">
              <b.icon size={18} className="text-amber flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-display font-semibold text-[15px]">{b.name}</div>
                <div className="text-[12.5px] text-charcoal-soft mt-1">{b.desc}</div>
                <div className="text-[12.5px] text-charcoal mt-2">
                  {b.name === "Applicant" ? (
                    <>Submit an application on the <Link href="/apply" className="text-amber font-semibold">Apply to Contribute</Link> page.</>
                  ) : b.how}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Editor-assigned</div>
        <h2 className="text-xl">Contributor tiers</h2>
        <p className="text-[13.5px] text-charcoal-soft mt-1.5 max-w-[600px]">
          As you publish, an editor may recognise your work with a tier, shown next to your name
          across the site. There's no fixed quota. It reflects the consistency and quality an editor has seen from you.
        </p>
        <div className="flex flex-col gap-3 mt-5 max-w-[480px]">
          {TIERS.map((t) => (
            <div key={t.name} className="card flex gap-3 items-center">
              <Award size={18} className="text-amber flex-shrink-0" />
              <div>
                <div className="font-display font-semibold text-[15px]">{t.name}</div>
                <div className="text-[12.5px] text-charcoal-soft mt-0.5">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-12 bg-cream-deep border-none text-center py-8">
        <p className="text-charcoal-soft text-sm">The best way to start earning badges:</p>
        <Link href="/news/submit" className="btn-primary mt-3 inline-flex">Submit an Article</Link>
      </div>
    </section>
  );
}
