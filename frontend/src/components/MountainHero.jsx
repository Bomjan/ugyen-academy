import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      x:  Math.random() * 100,
      y:  Math.random() * 58,
      r:  Math.random() * 1.2 + 0.3,
      op: Math.random() * 0.4 + 0.1,
      dur:`${Math.random() * 4 + 3}s`,
      del:`${Math.random() * 5}s`,
    }))
  , []);

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.r}px`, height: `${s.r}px`,
            opacity: s.op,
            "--op": s.op,
            animation: `twinkle ${s.dur} ${s.del} ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}

export default function MountainHero() {
  return (
    <section className="relative min-h-screen sky-grad overflow-hidden flex flex-col">

      {/* Stars */}
      <Stars />

      {/* Horizon glow */}
      <div className="absolute bottom-[160px] inset-x-0 h-48 pointer-events-none"
        style={{background:"radial-gradient(ellipse 70% 100% at 50% 100%, rgba(196,148,59,0.35), rgba(139,94,26,0.15) 50%, transparent 80%)"}} />

      {/* Mountain far layer */}
      <div className="mountains absolute bottom-0 inset-x-0 h-56 opacity-60"
        style={{background:"#0A1520",filter:"blur(0.5px)"}} />

      {/* Mountain near layer — slightly different clip, darker */}
      <div className="absolute bottom-0 inset-x-0 h-40"
        style={{
          background:"#05080F",
          clipPath:"polygon(0% 100%, 0% 85%, 3% 74%, 7% 82%, 12% 62%, 16% 74%, 21% 52%, 25% 66%, 30% 46%, 34% 58%, 38% 38%, 42% 52%, 46% 32%, 50% 48%, 54% 35%, 57% 50%, 61% 38%, 65% 55%, 69% 42%, 73% 60%, 77% 46%, 81% 62%, 85% 50%, 89% 66%, 93% 55%, 96% 68%, 99% 60%, 100% 65%, 100% 100%)"
        }} />

      {/* A thin gold horizon line */}
      <div className="absolute bottom-[155px] inset-x-0 h-px opacity-40"
        style={{background:"linear-gradient(90deg,transparent,#C4943B 20%,#D4A84A 50%,#C4943B 80%,transparent)"}} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 pb-48 pt-24">

        <div className="opacity-0" style={{animation:"up .5s .1s ease-out forwards"}}>
          <span className="label text-sky-lt/70 inline-flex items-center gap-2 mb-6">
            <span className="w-4 h-px bg-sky-lt/50" />
            Punakha, Bhutan · Est. 2002
            <span className="w-4 h-px bg-sky-lt/50" />
          </span>
        </div>

        <h1
          className="font-black text-white leading-[0.95] tracking-[-0.04em] mb-6 opacity-0"
          style={{
            fontSize:"clamp(3.5rem,11vw,9.5rem)",
            animation:"up .9s .2s cubic-bezier(.16,1,.3,1) forwards",
            textShadow:"0 2px 40px rgba(0,0,0,0.5)"
          }}
        >
          UGYEN<br/>
          <span style={{
            background:"linear-gradient(135deg,#ffffff 0%,#e0f0ff 40%,#C4943B 100%)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text"
          }}>
            ACADEMY
          </span>
        </h1>

        {/* WILL — staggered pillar reveal */}
        <div className="mb-10 opacity-0" style={{animation:"up .5s .42s ease-out forwards"}}>
          <p className="text-white/25 text-[9px] tracking-[0.35em] uppercase font-semibold mb-7 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-white/15" />
            A School of WILL
            <span className="w-6 h-px bg-white/15" />
          </p>

          <div className="grid grid-cols-4 gap-4 sm:gap-8 md:gap-12 max-w-lg mx-auto">
            {[
              { l:"W", word:"Winners",    line:"Rise through challenge"  },
              { l:"I", word:"nnovators",  line:"Build what isn't yet"    },
              { l:"L", word:"earners",    line:"Stay curious always"     },
              { l:"L", word:"eaders",     line:"Shape what comes next"   },
            ].map(({ l, word, line }, i) => (
              <div key={i}
                className="flex flex-col items-center gap-1 opacity-0"
                style={{ animation:`up .55s ${.48+i*.11}s cubic-bezier(.16,1,.3,1) forwards` }}>

                {/* Big gradient letter */}
                <span className="font-black leading-none select-none" style={{
                  fontSize:"clamp(2rem,5.5vw,3.6rem)",
                  background:"linear-gradient(160deg,#F5C800 0%,#C8920A 100%)",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  backgroundClip:"text",
                  filter:"drop-shadow(0 0 18px rgba(200,146,10,0.45))",
                }}>
                  {l}
                </span>

                {/* Thin gold rule */}
                <div className="w-4 h-px my-0.5"
                  style={{background:"linear-gradient(90deg,transparent,rgba(245,200,0,0.5),transparent)"}} />

                {/* Full word — first letter bold */}
                <span className="text-white/60 tracking-[0.12em] uppercase font-semibold"
                  style={{fontSize:"clamp(9px,1.4vw,11px)"}}>
                  {l}{word}
                </span>

                {/* Tagline */}
                <span className="text-white/22 text-[8px] sm:text-[9px] tracking-wide text-center leading-tight hidden xs:block">
                  {line}
                </span>

              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 opacity-0"
          style={{animation:"up .5s .65s ease-out forwards"}}>
          <Link to="/admissions"
            className="bg-gold hover:bg-gold-lt text-white font-semibold text-[14px] px-6 py-3 rounded-lg transition-colors duration-150 inline-flex items-center gap-2"
            style={{boxShadow:"0 0 24px rgba(196,148,59,0.4)"}}>
            Apply for 2026 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/academics"
            className="bg-white/10 backdrop-blur-sm border border-white/[0.1] hover:bg-white/20 text-white font-medium text-[14px] px-6 py-3 rounded-lg transition-all duration-150">
            Explore Programs
          </Link>
        </div>
      </div>

      {/* Bottom stats bar floating over mountains */}
      <div className="relative z-10 opacity-0" style={{animation:"up .5s .85s ease-out forwards"}}>
        <div className="wrap pb-10">
          <div className="grid grid-cols-4 bg-white/8 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
            {[["24+","Years"],["1,000+","Students"],["98%","Pass Rate"],["3×","Champions"]].map(([v,l],i) => (
              <div key={l} className={`py-4 text-center ${i>0?"border-l border-white/[0.06]":""}`}>
                <p className="font-black text-white text-xl tracking-tight">{v}</p>
                <p className="label text-white/35 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
