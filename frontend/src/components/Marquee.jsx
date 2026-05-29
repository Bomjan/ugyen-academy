const items = ["Bhutan's #1 Private School", "98% Pass Rate", "3× National Champions", "Est. 2002 · Punakha", "Science · Commerce · Arts", "Admissions Open 2026"];

export default function Marquee() {
  const rep = [...items, ...items, ...items];
  return (
    <div className="bg-dark-3 overflow-hidden py-3 select-none border-b border-white/[0.03]">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite", width: "max-content" }}
      >
        {rep.map((t, i) => (
          <span key={i} className="label text-white/25 inline-flex items-center gap-10">
            {t}
            <span className="w-1 h-1 rounded-full bg-accent/50 inline-block" />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}`}</style>
    </div>
  );
}
