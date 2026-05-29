import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Marquee from "../components/Marquee";
import { useReveal } from "../hooks/useReveal";

function R({ children, d = "", className = "" }) {
  const [ref, on] = useReveal();
  return <div ref={ref} className={`reveal ${on ? "on" : ""} ${d} ${className}`}>{children}</div>;
}

const features = [
  { title: "Top-Ranked Nationally", desc: "Consistently among Bhutan's highest BCSE and BHSEC results across Science, Commerce, and Arts.", color: "#0066CC" },
  { title: "Bhutan Premier League", desc: "The only school in Bhutan with its own professional football club — Ugyen Academy FC, 2013 National League Champions.", color: "#10B981" },
  { title: "International Campus", desc: "Students from Bhutan, India, Thailand, and South Korea learn together in Punakha's most diverse school.", color: "#8B5CF6" },
  { title: "Founded by Royalty", desc: "Established by H.E. Yab Dasho Ugyen Dorji (1925–2019), father of Bhutan's four Queen Mothers and co-founded by Yum Thinley Choden.", color: "#F59E0B" },
  { title: "47 Dedicated Faculty", desc: "32 Bhutanese and 5 Indian teachers, led by Principal Norbu Gyaltshen — former tutor to His Majesty the Fifth King.", color: "#EF4444" },
  { title: "A School of WILL", desc: "Since April 3, 2002, UA has developed students academically, athletically, and as citizens of Bhutan and the world.", color: "#06B6D4" },
];

const programs = [
  { n: "01", name: "Science",  sub: "Physics · Chemistry · Biology · Mathematics · English · Dzongkha", desc: "Advanced labs and Bhutan's top BHSEC Science scores, year after year." },
  { n: "02", name: "Commerce", sub: "Accountancy · Economics · Business Studies · Mathematics · English", desc: "Preparing Bhutan's next generation of entrepreneurs and business leaders." },
  { n: "03", name: "Arts",     sub: "History · Geography · Political Science · Sociology · English", desc: "Producing civil servants, journalists, and policy makers who shape the nation." },
  { n: "04", name: "Sports",   sub: "Football · Cricket · Volleyball · Swimming · Basketball · Archery", desc: "National School Games champions. The only school in the Bhutan Premier League." },
];

const news = [
  { date: "2026", tag: "Admissions", title: "Classes VII–XII Admissions Now Open", desc: "Online registration open for all classes and streams. Contact 77111000 or ugyenacademyadmin@education.gov.bt." },
  { date: "2025", tag: "Achievement", title: "UA Dominates 7th National School Games", desc: "Ugyen Academy won the highest medal count of any school at the National School Games held in Punakha." },
  { date: "2024", tag: "Sports", title: "Ugyen Academy FC — Bhutan Premier League", desc: "UA FC continues to compete in the Bhutan Premier League, the only school-affiliated club in the top flight." },
];

const stats = [
  { n: "2002", l: "Founded" },
  { n: "47",   l: "Faculty" },
  { n: "VII–XII", l: "Classes" },
  { n: "4 km", l: "From Punakha Dzong" },
];

export default function Home() {
  return (
    <div>
      <section className="relative min-h-screen bg-dark flex flex-col items-center justify-center text-center px-6 pt-14">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3.5 py-1.5 text-[12px] text-white/50 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Bhutan's Premier School · Est. 2002
          </span>

          <h1
            className="font-black text-white leading-none tracking-[-0.05em] mb-5"
            style={{ fontSize: "clamp(3rem,8.5vw,7.5rem)", lineHeight: "0.93" }}
          >
            Excellence<br />in Education.
          </h1>

          <p className="text-white/50 text-[17px] font-light leading-relaxed max-w-[44ch] mx-auto mt-5 mb-10">
            Bhutan's first international private school. Founded in 2002 in Punakha — 4 km from Punakha Dzong — by H.E. Yab Dasho Ugyen Dorji, father of Bhutan's four Queen Mothers.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/admissions"
              className="bg-accent hover:bg-accent-h text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Apply for 2026 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/academics"
              className="bg-white/8 border border-white/10 hover:bg-white/12 text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Explore Programs
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-0 mt-16 max-w-xl mx-auto border border-white/8 rounded-2xl overflow-hidden bg-white/4">
            {stats.map(({ n, l }, i) => (
              <div
                key={l}
                className={`py-5 px-4 flex flex-col items-center ${i < stats.length - 1 ? "border-r border-white/8" : ""}`}
              >
                <span className="font-bold text-white text-2xl leading-none">{n}</span>
                <span className="text-white/35 text-[11px] mt-1.5 text-center">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />

      <section className="py-24 bg-white">
        <div className="wrap">
          <R>
            <p className="label text-accent mb-3">Why Ugyen Academy</p>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <h2
                className="font-black text-text leading-tight tracking-tight"
                style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
              >
                The standard<br />for Bhutan.
              </h2>
              <Link
                to="/academics"
                className="text-[13px] font-medium text-muted hover:text-text transition-colors inline-flex items-center gap-1.5"
              >
                All programs <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </R>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <R key={f.title} d={`d${(i % 4) + 1}`}>
                <div className="card cursor-default h-full">
                  <div className="w-2 h-2 rounded-full mb-4" style={{ background: f.color }} />
                  <h3 className="font-semibold text-[15px] text-text mb-1.5">{f.title}</h3>
                  <p className="text-[13px] text-muted leading-relaxed">{f.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark">
        <div className="wrap">
          <R>
            <p className="label text-white/30 mb-3">Academic Streams</p>
            <h2
              className="font-black text-white tracking-tight mb-12"
              style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
            >
              Four disciplines.
            </h2>
          </R>
          <div className="grid md:grid-cols-2 gap-4">
            {programs.map((p, i) => (
              <R key={p.name} d={`d${(i % 4) + 1}`}>
                <div className="group bg-dark-2 border border-white/8 rounded-2xl p-8 hover:border-accent/40 transition-all duration-200 cursor-default">
                  <span className="label text-white/20 mb-4 block">{p.n}</span>
                  <h3 className="font-black text-3xl text-white tracking-tight mb-2">{p.name}</h3>
                  <p className="text-white/35 text-sm mb-3">{p.sub}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="wrap">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <R>
              <p className="label text-accent mb-4">Our Founding</p>
              <h2
                className="font-black text-text tracking-tight leading-tight mb-6"
                style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
              >
                Built for<br />a nation.
              </h2>
              <Link
                to="/academics"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-h text-[14px] font-medium transition-colors"
              >
                Our programs <ArrowUpRight className="w-4 h-4" />
              </Link>
            </R>
            <R d="d2">
              <p className="text-text/70 text-[17px] leading-relaxed mb-5">
                Ugyen Academy opened on April 3, 2002 with 154 students. Founded by H.E. Yab Dasho Ugyen Dorji — father of the four Queen Mothers of Bhutan — and co-founded by Yum Thinley Choden.
              </p>
              <p className="text-muted text-[15px] leading-relaxed mb-4">
                Located in Khuruthang town, 4 km from the historic Punakha Dzong, UA is Bhutan's first and only authentic international school — welcoming students from Bhutan, India, Thailand, and South Korea.
              </p>
              <p className="text-muted text-[15px] leading-relaxed">
                Principal Norbu Gyaltshen, who holds a Master's degree from the University of New England, Australia, and formerly served as tutor to His Majesty the Fifth King, has led the school since its founding.
              </p>
            </R>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="wrap">
          <R>
            <p className="label text-accent mb-3">Latest</p>
            <h2
              className="font-black text-text tracking-tight mb-10"
              style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
            >
              News.
            </h2>
          </R>
          <div className="space-y-2">
            {news.map((n, i) => (
              <R key={n.title} d={`d${i + 1}`}>
                <div className="group flex items-center gap-5 p-5 rounded-2xl bg-white border border-border hover:border-accent/30 hover:shadow-hover transition-all duration-200 cursor-pointer">
                  <div className="shrink-0 w-24">
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-accent">{n.tag}</p>
                    <p className="text-[11px] text-muted mt-0.5">{n.date}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-text group-hover:text-accent transition-colors truncate">{n.title}</p>
                    <p className="text-[13px] text-muted mt-0.5 truncate">{n.desc}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-border group-hover:text-accent transition-colors shrink-0" />
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark">
        <R>
          <div className="wrap text-center">
            <p className="label text-white/30 mb-4">Admissions 2026</p>
            <h2
              className="font-black text-white tracking-tight mb-5"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
            >
              Ready to join?
            </h2>
            <p className="text-white/40 mb-10 max-w-sm mx-auto text-[15px]">
              Class XI applications open. Limited seats across all streams.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/admissions"
                className="bg-accent hover:bg-accent-h text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/academics"
                className="bg-white/8 border border-white/10 hover:bg-white/12 text-white text-[14px] font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </R>
      </section>
    </div>
  );
}
