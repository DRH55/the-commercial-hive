import { TrendingUp, Briefcase, Users, Award } from "lucide-react";

const ITEMS = [
  { icon: TrendingUp, title: "Reading a deal like a lawyer", body: "How to move past headline value and identify the structural questions interviewers actually want to hear." },
  { icon: Briefcase, title: "Vacation scheme application timing", body: "A realistic month-by-month guide to when applications actually open, by firm type." },
  { icon: Users, title: "What assessors listen for", body: "The difference between reciting news and demonstrating judgement, from contributors who've sat on both sides." },
  { icon: Award, title: "Turning a Hive portfolio into a CV line", body: "How to describe your published challenge responses and analyses in applications." },
];

export default function CareersPage() {
  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Careers</div>
      <h1 className="text-[30px] max-w-[640px]">Commercial interview tips. Application guidance. Employer insights.</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-9">
        {ITEMS.map((item, i) => (
          <div key={i} className="card">
            <item.icon size={18} className="text-amber" />
            <h3 className="text-[16.5px] font-medium mt-3">{item.title}</h3>
            <p className="text-sm text-charcoal-soft mt-2.5">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
