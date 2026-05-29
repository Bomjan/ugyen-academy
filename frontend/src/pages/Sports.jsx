import { useReveal } from "../hooks/useReveal";

function R({ children, d = "", className = "" }) {
  const [ref, on] = useReveal();
  return <div ref={ref} className={`reveal ${on ? "on" : ""} ${d} ${className}`}>{children}</div>;
}

const sports = [
  { n: "01", name: "Football",  level: "Bhutan Premier League", desc: "Ugyen Academy FC — the only school club in the Bhutan Premier League. 2013 National League Champions. Represented Bhutan at the 2014 AFC President's Cup. Home ground: Lekeythang Football Field. Current coach: Kinley Dorji.", color: "#3B82F6" },
  { n: "02", name: "Cricket",   level: "National Level",        desc: "UA hosts inter-school and district-level cricket tournaments. One of the most active cricket programs in Punakha Dzongkhag.", color: "#10B981" },
  { n: "03", name: "Volleyball",level: "Dzongkhag Level",       desc: "UA competes at dzongkhag and national levels in volleyball, with both boys' and girls' teams active in the school games circuit.", color: "#8B5CF6" },
  { n: "04", name: "Swimming",  level: "School Facility",       desc: "UA has dedicated swimming facilities — uncommon among Bhutanese schools. Swimming training is available to all enrolled students.", color: "#06B6D4" },
  { n: "05", name: "Basketball",level: "Active Program",        desc: "Basketball training available with a dedicated court. Offered as part of the Winter Engagement Program and regular school sports.", color: "#F59E0B" },
  { n: "06", name: "Archery",   level: "National Sport",        desc: "Bhutan's national sport is part of the UA program. Students learn traditional archery as part of their physical and cultural education.", color: "#EF4444" },
];

const ach = [
  { y: "2014", t: "AFC President's Cup — Continental Debut", n: "Ugyen Academy FC, Group A — Colombo, Sri Lanka" },
  { y: "2013", t: "Bhutan National League Champions",        n: "Ugyen Academy FC — inaugural national title, 1 point above Yeedzin" },
  { y: "2013", t: "Highest Scoring Win of the Season",       n: "8–1 victory over Samtse FC, Bhutan National League" },
  { y: "2012", t: "7th National School Games — Top School", n: "Highest medal count across all disciplines" },
  { y: "2002", t: "School Founded with Sports at Its Core",  n: "Football, cricket, volleyball, archery from Day 1" },
];

const clubs = ["Python & Technology Club", "Drama & Cultural Arts", "Music & Dance", "Debate & Public Speaking", "Science Exploration Club", "Eco & Environmental Club"];

export default function Sports() {
  return (
    <div className="bg-white pt-14">
      <section className="py-20 bg-dark">
        <div className="wrap">
          <R>
            <p className="label text-white/30 mb-4">Sports & Activities</p>
            <h1
              className="font-black text-white tracking-tight leading-tight mb-5"
              style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)" }}
            >
              Champions<br />every year.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              The only school in Bhutan with a professional football club in the Bhutan Premier League. UA has dominated the National School Games and competed at the AFC President's Cup.
            </p>
          </R>
        </div>

        <div className="wrap mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["2013", "National Champions"], ["2014", "AFC President's Cup"], ["6+", "Sports Disciplines"], ["#1", "School Games Medal Count"]].map(([v, l], i) => (
              <R key={l} d={`d${i + 1}`}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-5 text-center">
                  <p className="font-black text-3xl text-white tracking-tight">{v}</p>
                  <p className="label text-white/30 mt-1">{l}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="wrap">
          <R>
            <p className="label text-accent mb-3">Programs</p>
            <h2 className="font-black text-text tracking-tight mb-10" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Sports at UA.</h2>
          </R>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sports.map((s, i) => (
              <R key={s.name} d={`d${(i % 4) + 1}`}>
                <div className="card group cursor-default h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: s.color }} />
                    <span className="label text-muted">{s.level}</span>
                  </div>
                  <h3 className="font-black text-2xl text-text tracking-tight mb-2 group-hover:text-accent transition-colors duration-150">{s.name}</h3>
                  <p className="text-[13px] text-muted leading-relaxed">{s.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark">
        <div className="wrap">
          <R>
            <p className="label text-white/30 mb-3">Hall of Fame</p>
            <h2 className="font-black text-white tracking-tight mb-10" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Achievements.</h2>
          </R>
          <div className="space-y-1">
            {ach.map((a, i) => (
              <R key={i} d={`d${(i % 4) + 1}`}>
                <div className="group flex items-center gap-5 px-5 py-4 rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-150 cursor-default">
                  <span className="font-black text-xl text-accent w-12 shrink-0">{a.y}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-[14px] text-white group-hover:text-accent transition-colors duration-150">{a.t}</p>
                    <p className="text-[12px] text-white/30 mt-0.5">{a.n}</p>
                  </div>
                  <div className="w-4 h-px bg-white/10 group-hover:bg-accent group-hover:w-8 transition-all duration-300 shrink-0" />
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="wrap">
          <R>
            <p className="label text-accent mb-3">Beyond Sport</p>
            <h2 className="font-black text-text tracking-tight mb-10" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Clubs & activities.</h2>
          </R>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((c, i) => (
              <R key={c} d={`d${(i % 4) + 1}`}>
                <div className="group flex items-center gap-3 border border-border rounded-2xl px-5 py-4 hover:border-accent/30 hover:shadow-card transition-all duration-200 cursor-default bg-white">
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="font-medium text-[14px] text-text group-hover:text-accent transition-colors duration-150">{c}</span>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
