import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const PROCESSING_STEPS = [
  'Analyzing conversation transcript',
  'Building financial profile',
  'Classifying risk capacity',
  'Classifying investment horizon',
  'Fetching historical NAV data',
  'Calculating CAGR and volatility',
  'Calculating Sharpe ratio and maximum drawdown',
  'Comparing mutual fund categories',
  'Generating plain-language explanation',
  'Preparing report layout'
];

export default function Processing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalTime = 6000;
    const timePerStep = totalTime / PROCESSING_STEPS.length;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < PROCESSING_STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/report');
        }, 500);
      }
    }, timePerStep);

    return () => clearInterval(interval);
  }, [navigate]);

  const progressPercent = ((currentStep) / PROCESSING_STEPS.length) * 100;

  return (
    <div style={{ backgroundColor: 'var(--theme-bg)' }} className="min-h-screen flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
          className="rounded-2xl p-8 border shadow-lg"
        >
          <div className="flex items-center gap-4 mb-8">
            <div style={{ backgroundColor: 'var(--theme-brand-light)', borderColor: 'var(--theme-brand)' }} className="w-11 h-11 border rounded-xl flex items-center justify-center">
              <Loader2 style={{ color: 'var(--theme-brand)' }} className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 style={{ color: 'var(--theme-text)' }} className="text-base font-bold tracking-tight">Computing Analytics</h2>
              <p style={{ color: 'var(--theme-text-muted)' }} className="text-[12.5px]">Fetching NAV databases...</p>
            </div>
          </div>

          <div className="space-y-4">
            {PROCESSING_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isVisible = Math.abs(index - currentStep) <= 2 || index === PROCESSING_STEPS.length - 1;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={step}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                  ) : isCurrent ? (
                    <Loader2 style={{ color: 'var(--theme-brand)' }} className="w-4.5 h-4.5 animate-spin shrink-0" />
                  ) : (
                    <Circle style={{ color: 'var(--theme-border)' }} className="w-4.5 h-4.5 shrink-0" />
                  )}
                  <span
                    style={{
                      color: isCompleted
                        ? 'var(--theme-text-soft)'
                        : isCurrent
                        ? 'var(--theme-text)'
                        : 'var(--theme-text-soft)',
                    }}
                    className="text-[13px] font-medium transition-colors"
                  >
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div style={{ borderTopColor: 'var(--theme-border-soft)' }} className="mt-8 pt-6 border-t">
            <div style={{ backgroundColor: 'var(--theme-bg)' }} className="w-full h-1.5 rounded-full overflow-hidden">
              <motion.div
                style={{ backgroundColor: 'var(--theme-brand)' }}
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: progressPercent + '%' }}
                transition={{ ease: 'linear', duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
