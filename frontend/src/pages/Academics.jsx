import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, BarChart2, Palette, Trophy } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

function R({ children, d = "", className = "" }) {
  const [ref, on] = useReveal();
  return <div ref={ref} className={`reveal ${on ? "on" : ""} ${d} ${className}`}>{children}</div>;
}

const streams = [
  {
    icon: FlaskConical, n: "01", name: "Science", color: "#3B82F6",
    sub: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Dzongkha"],
    careers: ["Medicine", "Engineering", "Research & Development", "Information Technology"],
    desc: "UA's Science stream consistently produces Bhutan's top BHSEC scorers. Equipped with advanced laboratories and taught by specialist faculty, it is the most sought-after stream in the school.",
  },
  {
    icon: BarChart2, n: "02", name: "Commerce", color: "#10B981",
    sub: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English", "Dzongkha"],
    careers: ["Finance & Banking", "Entrepreneurship", "Trade & Economics", "Public Policy"],
    desc: "Grounded in real-world business principles, the Commerce stream prepares students to lead Bhutan's growing private sector and contribute to the national economy.",
  },
  {
    icon: Palette, n: "03", name: "Arts", color: "#8B5CF6",
    sub: ["History", "Geography", "Political Science", "Sociology", "English", "Dzongkha"],
    careers: ["Civil Services", "Law & Judiciary", "Journalism", "Diplomacy"],
    desc: "The Arts stream cultivates analytical thinkers, communicators, and future civil servants. UA Arts graduates have gone on to serve in Bhutan's most prominent institutions.",
  },
  {
    icon: Trophy, n: "04", name: "Sports Program", color: "#F59E0B",
    sub: ["Football", "Cricket", "Volleyball", "Swimming", "Basketball", "Traditional Archery"],
    careers: ["Professional Athletics", "Coaching & Training", "Sports Administration", "Physical Education"],
    desc: "UA is the only school in Bhutan with a professional football club in the Bhutan Premier League — Ugyen Academy FC, 2013 National League Champions and 2014 AFC President's Cup participants.",
  },
];

const facilities = [
  "Football Astro Turf", "Science Laboratories", "Computer & ICT Labs",
  "Lekeythang Football Field", "Swimming Pool", "Indoor Games Facility",
  "Library", "Basketball & Volleyball Courts", "Python & Technology Lab",
];

export default function Academics() {
  return (
    <div className="bg-white pt-14">
      <section className="py-20 bg-dark">
        <div className="wrap">
          <R>
            <p className="label text-white/30 mb-4">Academic Programs</p>
            <h1
              className="font-black text-white tracking-tight leading-tight mb-5"
              style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)" }}
            >
              Three streams.<br />One standard.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              Classes VII–XII. Bhutan's finest faculty, modern infrastructure, and a relentless culture of excellence.
            </p>
          </R>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="wrap space-y-4">
          {streams.map((s) => (
            <R key={s.name}>
              <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-text/20 hover:shadow-hover transition-all duration-200 cursor-default">
                <div className="grid md:grid-cols-12">
                  <div
                    className="md:col-span-3 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border"
                    style={{ background: `${s.color}08` }}
                  >
                    <div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                      >
                        <s.icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <span className="label text-muted mb-2 block">{s.n}</span>
                      <h2 className="font-black text-3xl text-text tracking-tight">{s.name}</h2>
                    </div>
                  </div>
                  <div className="md:col-span-9 p-8">
                    <p className="text-muted leading-relaxed mb-7 text-[15px]">{s.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="label text-muted mb-3">Subjects</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.sub.map(x => (
                            <span key={x} className="text-[12px] bg-surface border border-border px-2.5 py-1 rounded-md text-text/70">{x}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="label text-muted mb-3">Career Paths</p>
                        <ul className="space-y-1.5">
                          {s.careers.map(c => (
                            <li key={c} className="flex items-center gap-2 text-[13px] text-muted">
                              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: s.color }} />{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      <section className="py-20 bg-dark">
        <div className="wrap">
          <R>
            <p className="label text-white/30 mb-4">Infrastructure</p>
            <h2
              className="font-black text-white tracking-tight mb-12"
              style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
            >
              World-class facilities.
            </h2>
          </R>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {facilities.map((f, i) => (
              <R key={f} d={`d${(i % 4) + 1}`}>
                <div className="group bg-white/5 border border-white/8 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-white/15 transition-all duration-200 cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-white/60 group-hover:text-white text-[14px] transition-colors">{f}</span>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface border-t border-border">
        <R>
          <div className="wrap flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="font-black text-2xl text-text tracking-tight">Choose your stream.</h2>
            <Link
              to="/admissions"
              className="bg-accent hover:bg-accent-h text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Apply for 2026 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </R>
      </section>
    </div>
  );
}
