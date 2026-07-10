import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';

export default function Disclaimer() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--theme-bg)' }} className="min-h-screen flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
        className="max-w-2xl w-full rounded-2xl border shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div style={{ backgroundColor: 'var(--theme-surface)', borderBottomColor: 'var(--theme-border)' }} className="px-8 pt-10 pb-6 border-b text-center flex flex-col items-center">
          <div style={{ backgroundColor: 'var(--theme-brand-light)', borderColor: 'var(--theme-brand)', color: 'var(--theme-brand)' }} className="w-12 h-12 border rounded-xl flex items-center justify-center mb-5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 style={{ color: 'var(--theme-text)' }} className="font-serif text-2xl font-semibold tracking-tight mb-2">Before we begin</h1>
          <p style={{ color: 'var(--theme-text-muted)' }} className="text-xs sm:text-sm max-w-md">
            Please review these important notices about how this educational sandbox operates.
          </p>
        </div>

        {/* Content */}
        <div style={{ backgroundColor: 'var(--theme-surface)' }} className="p-8 space-y-4">
          <DisclaimerItem
            icon={<Info className="w-5 h-5" style={{ color: 'var(--theme-brand)' }} />}
            title="Educational Sandbox Only"
            description="This tool is built solely to explain return and risk capacity concepts. It does not provide personalized investment advice or SEBI-registered advisories."
          />
          <DisclaimerItem
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            title="Grounded in Historical Data"
            description="All CAGR, Sharpe, and drawdown parameters are calculated strictly from public mutual fund historical NAV records."
          />
          <DisclaimerItem
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            title="No Return Guarantees"
            description="Historical metrics show past variance only. Markets are inherently volatile and subject to risk."
          />
          <DisclaimerItem
            icon={<ShieldAlert className="w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />}
            title="No Payment Integrations"
            description="This platform holds no transactional capabilities or broker partnerships. We will never ask for bank accounts or sensitive keys."
          />
        </div>

        {/* Footer actions */}
        <div style={{ backgroundColor: 'var(--theme-bg)', borderTopColor: 'var(--theme-border)' }} className="px-8 py-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            style={{ color: 'var(--theme-text-muted)' }}
            className="text-xs uppercase tracking-wider font-semibold hover:opacity-70 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('/assessment')}
            style={{ backgroundColor: 'var(--theme-brand)', borderColor: 'var(--theme-ink)', color: 'white', boxShadow: '2px 2px 0 var(--theme-ink)' }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all hover:opacity-90 cursor-pointer border"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 var(--theme-ink)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0 var(--theme-ink)'; }}
          >
            I Understand, Continue
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DisclaimerItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{ borderColor: 'transparent' }} className="flex gap-4 p-4 rounded-xl transition-all hover:opacity-90">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 style={{ color: 'var(--theme-text)' }} className="text-[13.5px] font-bold mb-1 tracking-tight">{title}</h3>
        <p style={{ color: 'var(--theme-text-muted)' }} className="leading-relaxed text-xs sm:text-[13px]">{description}</p>
      </div>
    </div>
  );
}
