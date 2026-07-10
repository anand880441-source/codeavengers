import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ShieldCheck, LineChart, BookOpen, Sparkles, Users, Zap } from 'lucide-react';
import Footer from '../components/Footer';
import BentoCard from '../components/BentoCard';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--theme-brand-light)] px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ color: 'var(--theme-brand)' }}>
            ✨ AI-Powered Wealth Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6">
            Your Voice-Driven <br />
            <span style={{ color: 'var(--theme-brand)' }}>Mutual Fund Advisor</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--theme-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Have a natural conversation about your financial goals. Get personalized investment insights grounded in real historical data.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/disclaimer')}
              className="px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--theme-brand)', boxShadow: '3px 3px 0 var(--theme-ink)' }}
            >
              <Mic size={18} strokeWidth={2.5} />
              Start Free Assessment
            </button>
            <button
              onClick={() => navigate('/#how-it-works')}
              className="px-8 py-3 rounded-xl font-semibold border-2 transition-all hover:opacity-80"
              style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
            >
              How It Works
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto">
            Three simple steps to get your personalized investment report
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <BentoCard
            title="1. Speak Naturally"
            description="Have a voice conversation with our AI about your financial goals, risk tolerance, and investment horizon."
            icon={<Mic size={24} strokeWidth={1.5} />}
            accent="blue"
          />
          <BentoCard
            title="2. Real Data Analysis"
            description="We fetch historical NAV data and compute CAGR, volatility, Sharpe ratio, and maximum drawdown."
            icon={<LineChart size={24} strokeWidth={1.5} />}
            accent="green"
          />
          <BentoCard
            title="3. Get Your Report"
            description="Receive a personalized, jargon-free report with fund recommendations tailored to your profile."
            icon={<BookOpen size={24} strokeWidth={1.5} />}
            accent="amber"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--theme-brand)' }}>10+</div>
            <div className="text-sm text-[var(--theme-text-muted)]">Years of Data</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--theme-brand)' }}>50+</div>
            <div className="text-sm text-[var(--theme-text-muted)]">Mutual Fund Schemes</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--theme-brand)' }}>100%</div>
            <div className="text-sm text-[var(--theme-text-muted)]">Educational & Free</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--theme-brand)' }}>5 min</div>
            <div className="text-sm text-[var(--theme-text-muted)]">Average Session</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div
          className="rounded-3xl p-12 text-center"
          style={{ backgroundColor: 'var(--theme-brand-light)' }}
        >
          <h2 className="text-3xl font-serif font-bold tracking-tight mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-[var(--theme-text-muted)] mb-8 max-w-2xl mx-auto">
            Join thousands of beginners who are building their financial literacy through natural conversation.
          </p>
          <button
            onClick={() => navigate('/disclaimer')}
            className="px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mx-auto transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--theme-brand)', boxShadow: '3px 3px 0 var(--theme-ink)' }}
          >
            <Mic size={18} strokeWidth={2.5} />
            Start Your Assessment
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
