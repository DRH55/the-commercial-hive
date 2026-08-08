import Link from "next/link";
import { Clock, Compass, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="max-w-[860px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">About The Hive</div>
      <h1 className="text-[clamp(30px,4.5vw,44px)] max-w-[700px] leading-tight">Why students put us on their CV.</h1>
      <p className="mt-4 text-[17px] text-charcoal-soft max-w-[620px] leading-relaxed">
        Three reasons The Commercial Hive exists, and how to actually use it once you're here.
      </p>

      <div className="flex flex-col gap-8 mt-12">
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
            <Clock size={19} className="text-amber" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">1. We know real life doesn't stop for career prep</h2>
            <p className="mt-2 text-charcoal-soft leading-relaxed max-w-[600px]">
              Between lectures, work, and everything else going on, finding time to build commercial awareness
              can feel like one more demand on a schedule that's already full. The Hive is built around that
              reality: short, focused challenges and articles you can engage with in the time you actually have,
              so progress toward your goals doesn't require putting the rest of your life on hold.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
            <Compass size={19} className="text-amber" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Commercial awareness, without a business degree</h2>
            <p className="mt-2 text-charcoal-soft leading-relaxed max-w-[600px]">
              Commercial awareness is expected of every law and business candidate, but rarely taught, and
              even less so if you're coming from a non-business background. The Hive breaks real commercial
              scenarios down in plain language, so you build genuine judgement rather than just memorising
              headlines, regardless of what you studied.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
            <Award size={19} className="text-amber" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. Something real to put on your CV</h2>
            <p className="mt-2 text-charcoal-soft leading-relaxed max-w-[600px]">
              Published a guest article? That's a genuine extracurricular. Publish consistently and you'll
              automatically become a <strong className="text-charcoal">Monthly</strong> or{" "}
              <strong className="text-charcoal">Weekly Contributor</strong>, a role you can list on your CV as
              volunteer experience. Both tiers also unlock a personalised, downloadable certificate from your
              profile, with your name, your tier, and the sectors you've written in, ready to reference in
              applications.
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-12 bg-cream-deep border-none text-center py-9 max-w-[600px] mx-auto">
        <p className="text-charcoal-soft text-sm">Contributor tiers are earned automatically, not assigned. Just publish.</p>
        <Link href="/news/submit" className="btn-primary mt-4 inline-flex items-center gap-1.5">
          Submit an Article <ArrowRight size={14} />
        </Link>
        <p className="text-[12.5px] text-charcoal-soft mt-4">
          Curious how tiers and badges work? See the full breakdown on the <Link href="/badges" className="text-amber font-semibold">Badges page</Link>.
        </p>
      </div>
    </section>
  );
}
