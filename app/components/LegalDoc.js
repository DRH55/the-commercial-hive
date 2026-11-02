export default function LegalDoc({ eyebrow, title, updated, children }) {
  return (
    <section className="max-w-[720px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">{eyebrow}</div>
      <h1 className="text-[clamp(28px,4vw,36px)] leading-tight">{title}</h1>
      <p className="text-[12.5px] text-charcoal-soft mt-2">Last updated {updated}</p>
      <div className="mt-9 flex flex-col gap-9 text-[14.5px] text-charcoal-soft leading-[1.75]">{children}</div>
    </section>
  );
}

export function LegalSection({ heading, children }) {
  return (
    <div>
      <h2 className="text-[19px] font-semibold text-charcoal mb-2.5">{heading}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function LegalList({ children }) {
  return <ul className="list-disc pl-5 flex flex-col gap-2">{children}</ul>;
}
