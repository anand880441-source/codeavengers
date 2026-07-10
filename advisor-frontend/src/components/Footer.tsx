import { Link } from 'react-router-dom';
import { Mic, ShieldCheck, ArrowUpRight, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--theme-surface-alt)',
        borderTopColor: 'var(--theme-border)',
        color: 'var(--theme-text)',
      }}
      className="border-t font-sans"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand Block (takes up 2 columns on lg) */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group shrink-0 focus:outline-none cursor-pointer w-fit mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
                style={{ backgroundColor: 'var(--theme-brand)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}
              >
                <Mic className="text-white w-4.5 h-4.5" strokeWidth={2.25} />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">Aura</span>
            </Link>
            <p style={{ color: 'var(--theme-text-muted)' }} className="text-sm leading-relaxed max-w-xs pr-4 mb-6">
              Voice-first educational mutual fund guidance. Building financial literacy through conversational AI and historical data.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/TrikamDevasi/codeAvengersProject"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--theme-text-muted)' }}
                className="hover:opacity-70 transition-opacity"
                aria-label="GitHub Repository"
              >
                <Github size={20} strokeWidth={2} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <h3 style={{ color: 'var(--theme-text)' }} className="font-semibold text-sm tracking-wide mb-1">Product</h3>
            <FooterLink href="/#how-it-works">How it works</FooterLink>
            <FooterLink href="/disclaimer">Voice assessment</FooterLink>
            <FooterLink href="/report">Sample report</FooterLink>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
          </div>

          <div className="flex flex-col gap-3.5">
            <h3 style={{ color: 'var(--theme-text)' }} className="font-semibold text-sm tracking-wide mb-1">Company</h3>
            <FooterLink href="/#about">About Aura</FooterLink>
            <FooterLink href="/#">Our Team</FooterLink>
            <FooterLink href="/#">Contact</FooterLink>
            <FooterLink href="/#">Careers</FooterLink>
          </div>

          <div className="flex flex-col gap-3.5">
            <h3 style={{ color: 'var(--theme-text)' }} className="font-semibold text-sm tracking-wide mb-1">Resources</h3>
            <FooterLink href="/#">Documentation <ArrowUpRight size={12} className="inline ml-0.5 opacity-60" /></FooterLink>
            <FooterLink href="/#">Methodology</FooterLink>
            <FooterLink href="/#">FAQ</FooterLink>
            <FooterLink href="https://devpost.com">Hackathon Pitch <ArrowUpRight size={12} className="inline ml-0.5 opacity-60" /></FooterLink>
          </div>

          <div className="flex flex-col gap-3.5">
            <h3 style={{ color: 'var(--theme-text)' }} className="font-semibold text-sm tracking-wide mb-1">Legal</h3>
            <FooterLink href="/disclaimer">Disclaimer</FooterLink>
            <FooterLink href="/#">Privacy Policy</FooterLink>
            <FooterLink href="/#">Terms of Service</FooterLink>
            <FooterLink href="/#">Educational Notice</FooterLink>
          </div>
        </div>

        {/* Trust & Disclaimer Strip */}
        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border-soft)',
          }}
          className="rounded-2xl p-5 border flex flex-col md:flex-row gap-4 items-start md:items-center mb-10"
        >
          <div
            style={{ backgroundColor: 'var(--theme-brand-light)' }}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          >
            <ShieldCheck size={18} style={{ color: 'var(--theme-brand)' }} strokeWidth={2.5} />
          </div>
          <div>
            <h4 style={{ color: 'var(--theme-text)' }} className="text-[13px] font-semibold mb-0.5">Educational purposes only</h4>
            <p style={{ color: 'var(--theme-text-muted)' }} className="text-[12px] leading-relaxed max-w-4xl">
              Aura is a sandbox tool. All analytics and volatility metrics are mapped from historical mutual fund NAV data. Past performance does not guarantee future returns. This product does not provide personalized SEBI-registered investment advice or facilitate transactions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{ borderTopColor: 'var(--theme-border-soft)' }}
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]"
        >
          <div style={{ color: 'var(--theme-text-soft)' }}>
            &copy; {currentYear} Aura. All rights reserved.
          </div>
          <div style={{ color: 'var(--theme-text-soft)' }} className="flex items-center gap-1.5 font-medium">
            Built with
            <span style={{ color: 'var(--theme-brand)' }}>♥</span>
            by <span style={{ color: 'var(--theme-text)' }}>CodeAvengers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http');
  const content = (
    <span
      style={{ color: 'var(--theme-text-muted)' }}
      className="text-sm font-medium hover:text-[var(--theme-text)] transition-colors duration-200 cursor-pointer flex items-center w-fit"
    >
      {children}
    </span>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="w-fit">
        {content}
      </a>
    );
  }

  if (href.startsWith('/#')) {
    return (
      <a
        href={href}
        onClick={(e) => {
          if (window.location.pathname === '/') {
            e.preventDefault();
            const id = href.slice(2);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="w-fit"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className="w-fit">
      {content}
    </Link>
  );
}
