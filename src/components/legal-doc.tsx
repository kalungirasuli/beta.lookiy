'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarClock, ChevronDown, FileText } from 'lucide-react';

export type LegalSection = { id: string; title: string; content: React.ReactNode };

type LegalDocProps = {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  updated: string;
  effective?: string;
  sections: LegalSection[];
};

export function LegalDoc({ eyebrow, title, intro, updated, effective, sections }: LegalDocProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.map((s) => [s.id, true])));
  const observerRef = useRef<IntersectionObserver | null>(null);

  const allOpen = useMemo(() => sections.every((s) => open[s.id]), [sections, open]);
  const anyOpen = useMemo(() => sections.some((s) => open[s.id]), [sections, open]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const nearest = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        setActive(nearest.target.id);
      },
      { rootMargin: '-130px 0px -62% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  const expandAll = () => setOpen(Object.fromEntries(sections.map((s) => [s.id, true])));
  const collapseAll = () => setOpen(Object.fromEntries(sections.map((s) => [s.id, false])));

  return (
    <div className="content-width">
      <section className="legal-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="legal-meta">
          <span><CalendarClock size={15} /> Last updated: {updated}</span>
          {effective && <span><FileText size={15} /> Effective: {effective}</span>}
        </div>
      </section>

      <div className="legal-shell">
        <aside className="legal-toc">
          <h2>On this page</h2>
          <nav aria-label="Table of contents">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}>
                {i + 1}. {s.title}
              </a>
            ))}
          </nav>
          <div className="legal-toc-controls">
            <button type="button" onClick={expandAll} disabled={allOpen}>Expand all</button>
            <button type="button" onClick={collapseAll} disabled={!anyOpen}>Collapse all</button>
          </div>
        </aside>

        <div className="legal-body">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="legal-section">
              <button type="button" onClick={() => toggle(s.id)} aria-expanded={!!open[s.id]}>
                <span className="legal-section-num">{i + 1}</span>
                <span className="legal-section-title">{s.title}</span>
                <ChevronDown size={19} className={`legal-chevron ${open[s.id] ? 'open' : ''}`} />
              </button>
              {open[s.id] && <div className="legal-section-body"><div className="legal-prose">{s.content}</div></div>}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
