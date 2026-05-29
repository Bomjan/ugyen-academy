import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/[0.05]">
      <div className="wrap py-14">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-dark text-[11px] font-black select-none">UA</span>
              <span className="font-wordmark font-bold text-[15px] text-white tracking-tight">Ugyen Academy</span>
            </div>
            <p className="text-[13px] text-white/30 leading-relaxed">
              Bhutan's premier private higher secondary school. Nurturing excellence since 2002.
            </p>
          </div>

          <div>
            <p className="label text-white/20 mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {[["/", "Home"], ["/academics", "Academics"], ["/admissions", "Admissions"], ["/sports", "Sports"]].map(([to, l]) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-white/30 hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-white/20 mb-4">Contact</p>
            <ul className="space-y-2.5 text-[13px] text-white/30">
              <li>Khuruthang, Punakha Dzongkhag, Bhutan</li>
              <li>02-584710 · 77111000</li>
              <li>
                <a href="mailto:ugyenacademyadmin@education.gov.bt" className="hover:text-white transition-colors">
                  ugyenacademyadmin@education.gov.bt
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/www.ugyenacademy.edu.bt/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Facebook ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="label text-white/20 mb-4">Admissions</p>
            <p className="text-[13px] text-white/30 mb-4 leading-relaxed">Class XI applications open for 2026. Limited seats.</p>
            <Link
              to="/admissions"
              className="inline-block bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between gap-2 text-[12px] text-white/20">
          <p>© {new Date().getFullYear()} Ugyen Academy. All rights reserved.</p>
          <p>Founded by H.E. Yab Dasho Ugyen Dorji</p>
        </div>
      </div>
    </footer>
  );
}
