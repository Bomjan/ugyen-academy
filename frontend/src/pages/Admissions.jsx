import { ArrowUpRight, FileText, Upload, PenLine, UserCheck } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

function R({ children, d = "", className = "" }) {
  const [ref, on] = useReveal();
  return <div ref={ref} className={`reveal ${on ? "on" : ""} ${d} ${className}`}>{children}</div>;
}

const steps = [
  { icon: FileText,  n: "01", t: "Online Registration",   d: "Complete the preliminary online registration form via the school's official admission portal. Submitting the form is the first step — it does not guarantee admission." },
  { icon: Upload,    n: "02", t: "Application Review",    d: "The admission committee reviews all applications. Shortlisted candidates are contacted within 2–3 days of submission." },
  { icon: PenLine,   n: "03", t: "Entrance Examination",  d: "Shortlisted applicants sit a written entrance test. Check admission status via the dedicated status link 2–3 days after applying." },
  { icon: UserCheck, n: "04", t: "Final Selection",       d: "Selected students receive an offer and complete enrolment. Contact the relevant admission committee for your class group." },
];

const eli = [
  "Open for Classes VII, VIII, IX, X, XI (all streams) and XII (all streams)",
  "Bhutanese and international students welcome",
  "Science, Commerce, and Arts streams available for Class XI & XII",
  "Accurate and complete information required on registration form",
  "Supporting documents as requested by the admission committee",
  "International students may require additional documentation",
];

const contacts = [
  { group: "Classes VII & VIII", people: "Dechen Dorji: 17477003 · Jit Kumar Layo Thapa: 17635409 · Sonam Tobgyal: 17458200" },
  { group: "Classes IX & X",     people: "Tashi Phuntsho · Sonam · Tashi Lhamo · Sonam Tobgyal" },
  { group: "Class XI & XII Science", people: "Prakash Chhetri (HoS): 17705788 · Gopal Bhandari · Ugyen Dorji" },
  { group: "General Enquiries",  people: "Phone: 77111000 (9 AM–5 PM) · Email: ugyenacademyadmin@education.gov.bt" },
];

const fees = [
  { l: "Winter Engagement — Boarders",   n: "Dec–Jan program",  a: "Nu. 8,500" },
  { l: "Winter Engagement — Day Students", n: "Dec–Jan program", a: "Nu. 6,000" },
  { l: "Principal's Office",              n: "Direct enquiries", a: "02-584710" },
  { l: "School Mobile",                   n: "9 AM–5 PM",        a: "77111000" },
];

export default function Admissions() {
  return (
    <div className="bg-white pt-14">
      <section className="py-20 bg-dark">
        <div className="wrap">
          <R>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="label text-green-500">Admissions Open — Limited Seats</p>
            </div>
            <h1
              className="font-black text-white tracking-tight leading-tight mb-5"
              style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)" }}
            >
              Begin your<br />journey at UA.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              Classes VII–XII open for academic year 2026. Science, Commerce, and Arts streams available. Bhutanese and international students welcome.
            </p>
          </R>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="wrap">
          <R>
            <p className="label text-accent mb-3">Process</p>
            <h2 className="font-black text-text tracking-tight mb-10" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>How to apply.</h2>
          </R>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <R key={s.n} d={`d${i + 1}`}>
                <div className="card group cursor-default h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center group-hover:bg-dark group-hover:border-dark transition-all duration-200">
                      <s.icon className="w-4 h-4 text-muted group-hover:text-white transition-colors duration-200" />
                    </div>
                    <span className="label text-border">{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-[15px] text-text mb-2">{s.t}</h3>
                  <p className="text-[13px] text-muted leading-relaxed flex-1">{s.d}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="wrap grid md:grid-cols-2 gap-16">
          <R>
            <p className="label text-accent mb-4">Who Can Apply</p>
            <h2 className="font-black text-2xl text-text mb-8">Eligibility.</h2>
            <ul className="space-y-0">
              {eli.map(e => (
                <li key={e} className="flex items-start gap-3 py-3.5 border-b border-border text-[14px] text-text/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />{e}
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-muted mt-4">Submitting the form does not guarantee admission — it is the first step in the selection process.</p>
          </R>
          <R d="d2">
            <p className="label text-accent mb-4">Admission Committees</p>
            <h2 className="font-black text-2xl text-text mb-8">Who to contact.</h2>
            <div className="border border-border rounded-2xl overflow-hidden">
              {contacts.map((c, i) => (
                <div key={c.group} className={`px-5 py-4 hover:bg-surface transition-colors ${i < contacts.length - 1 ? "border-b border-border" : ""}`}>
                  <p className="text-[13px] font-semibold text-text mb-1">{c.group}</p>
                  <p className="text-[12px] text-muted leading-relaxed">{c.people}</p>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-muted mt-3">General: <a href="mailto:ugyenacademyadmin@education.gov.bt" className="text-accent hover:underline">ugyenacademyadmin@education.gov.bt</a> · 77111000</p>
          </R>
        </div>
      </section>

      <section className="py-20 bg-dark">
        <R>
          <div className="wrap flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-black text-white text-2xl mb-1">Ready to apply?</h2>
              <p className="text-white/40 text-[14px]">Status visible 2–3 days after submitting your form.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://sites.google.com/education.gov.bt/ugyen-academy-admission-2026"
                target="_blank"
                rel="noreferrer"
                className="bg-accent hover:bg-accent-h text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Apply Online <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="mailto:ugyenacademyadmin@education.gov.bt"
                className="border border-white/15 text-white/70 hover:border-white/30 hover:text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2"
              >
                Email Us
              </a>
            </div>
          </div>
        </R>
      </section>
    </div>
  );
}
