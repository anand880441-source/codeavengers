import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Mic, LineChart, ShieldCheck, BookOpen } from 'lucide-react';
import BentoCard from './BentoCard';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{ backgroundColor: 'var(--theme-bg)' }} className="min-h-screen flex flex-col lg:flex-row font-sans antialiased">
      {/* Left Panel - Brand & Bento Cards */}
      <div
        style={{ backgroundColor: 'var(--theme-surface)', borderRightColor: 'var(--theme-border)' }}
        className="hidden lg:flex lg:w-[48%] flex-col p-12 relative overflow-hidden border-r"
      >

        {/* Subtle grid pattern overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--theme-text-muted) 1px, transparent 1px),
              linear-gradient(to bottom, var(--theme-text-muted) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2 mb-16 relative z-10">
          <div
            className="w-7.5 h-7.5 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--theme-brand)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}
          >
            <Mic className="text-white w-4 h-4" strokeWidth={2.25} />
          </div>
          <span style={{ color: 'var(--theme-text)' }} className="font-serif font-bold text-lg tracking-tight">Aura</span>
        </div>

        {/* Bento Grid */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto relative z-10 w-full">
          <div className="mb-10">
            <h2 style={{ color: 'var(--theme-text)' }} className="font-serif text-2xl font-medium tracking-tight mb-3">
              Your voice-first mutual fund assistant
            </h2>
            <p style={{ color: 'var(--theme-text-muted)' }} className="text-xs sm:text-sm leading-relaxed">
              Log in to store your profile evaluations, review computed volatility briefs, and load educational mutual fund checklists.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
            >
              <BentoCard
                title="Speak Naturally"
                description="Adapting conversation based on your goals."
                icon={<Mic size={18} strokeWidth={2.25} />}
                accent="blue"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
            >
              <BentoCard
                title="Real NAV Metrics"
                description="CAGR, Sharpe, and volatility calculations."
                icon={<LineChart size={18} strokeWidth={2.25} />}
                accent="green"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
            >
              <BentoCard
                title="Safe Sandbox"
                description="Strictly educational, SEBI-aligned guide."
                icon={<ShieldCheck size={18} strokeWidth={2.25} />}
                accent="amber"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5 }}
            >
              <BentoCard
                title="Jargon-Free Reports"
                description="Personalized outcomes described simply."
                icon={<BookOpen size={18} strokeWidth={2.25} />}
                accent="emerald"
              />
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ color: 'var(--theme-text-soft)' }} className="mt-auto relative z-10 text-[11px]">
          © {new Date().getFullYear()} Aura. Structured for financial literacy.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2">
              <div
                className="w-7.5 h-7.5 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-brand)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}
              >
                <Mic className="text-white w-4 h-4" strokeWidth={2.25} />
              </div>
              <span style={{ color: 'var(--theme-text)' }} className="font-serif font-bold text-lg tracking-tight">Aura</span>
            </div>
          </div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
            className="rounded-xl p-8 sm:p-10 border shadow-lg"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}