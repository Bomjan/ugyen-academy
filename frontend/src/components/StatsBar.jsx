import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 24,   suffix: "",  label: "Years of Excellence" },
  { value: 1000, suffix: "+", label: "Students Enrolled" },
  { value: 98,   suffix: "%", label: "BHSEC Pass Rate" },
  { value: 50,   suffix: "+", label: "National Awards" },
];

function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let n = 0;
        const step = Math.ceil(target / (1800 / 16));
        const t = setInterval(() => {
          n += step;
          if (n >= target) { setCount(target); clearInterval(t); }
          else setCount(n);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsBar() {
  return (
    <div className="bg-navy-deep py-16 md:py-20">
      <div className="section">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-8 py-4 ${i > 0 ? "border-l border-white/10" : ""}`}>
              <div className="font-serif text-5xl md:text-6xl font-bold text-white mb-2 leading-none">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="eyebrow text-white/35">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
