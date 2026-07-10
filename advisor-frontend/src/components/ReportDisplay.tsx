import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ShieldAlert, IndianRupee, Calendar, TrendingUp, HelpCircle } from 'lucide-react';

interface Recommendation {
  schemeName: string;
  schemeCode: string;
  cagr: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  allocation: number;
  reason: string;
}

interface ReportData {
  _id: string;
  conversationId: string;
  profile: {
    riskTolerance?: string;
    investmentHorizon?: string;
    monthlyAmount?: number;
    goal?: string;
    age?: number;
  };
  recommendations: Recommendation[];
  summary: string;
  disclaimer: string;
}

interface ReportDisplayProps {
  report: ReportData | null;
  onNewChat: () => void;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onNewChat }) => {
  if (!report) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--theme-text-muted)' }} className="text-sm">No report available</p>
      </div>
    );
  }

  // Prepare chart data
  const recommendations = report.recommendations || [];
  
  const pieData = recommendations.map((rec) => ({
    name: rec.schemeName.split(' - ')[0], // shorten name for chart
    value: rec.allocation || 33,
  }));

  const barData = recommendations.map((rec) => ({
    name: rec.schemeName.split(' - ')[0].substring(0, 15) + '...',
    cagr: rec.cagr,
    volatility: rec.volatility,
  }));

  const riskVal = report.profile?.riskTolerance || 'medium';
  const riskLabel = riskVal === 'high' ? 'Aggressive' : riskVal === 'low' ? 'Conservative' : 'Moderate';
  const riskColorClass = riskVal === 'high' ? 'text-red-500 bg-red-500/10' : riskVal === 'low' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10';

  return (
    <div 
      className="rounded-2xl p-6 md:p-8 border shadow-lg space-y-8"
      style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--theme-border-soft)' }}>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--theme-text-muted)]">Educational Briefing</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mt-1">📊 Investment Report</h2>
        </div>
        
        <span className={`self-start sm:self-auto text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full ${riskColorClass}`}>
          {riskLabel} Risk Profile
        </span>
      </div>
      
      {/* Disclaimer */}
      <div className="p-4 rounded-xl border flex gap-3 items-start" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border-soft)' }}>
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
        <p className="text-xs leading-relaxed text-[var(--theme-text-muted)]">
          <strong className="text-[var(--theme-text-soft)]">Disclaimer:</strong> {report.disclaimer || 'This is an educational sandbox. Past performance does not guarantee future returns.'}
        </p>
      </div>

      {/* Meta Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-[var(--theme-bg)]" style={{ borderColor: 'var(--theme-border-soft)' }}>
          <div className="text-[var(--theme-text-muted)] flex items-center gap-1.5 text-xs mb-1.5">
            <TrendingUp size={14} />
            Goal
          </div>
          <span className="text-sm font-bold capitalize">{report.profile?.goal || 'General Wealth'}</span>
        </div>

        <div className="p-4 rounded-xl border bg-[var(--theme-bg)]" style={{ borderColor: 'var(--theme-border-soft)' }}>
          <div className="text-[var(--theme-text-muted)] flex items-center gap-1.5 text-xs mb-1.5">
            <IndianRupee size={14} />
            Monthly Invest
          </div>
          <span className="text-sm font-bold">₹{(report.profile?.monthlyAmount || 0).toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-xl border bg-[var(--theme-bg)]" style={{ borderColor: 'var(--theme-border-soft)' }}>
          <div className="text-[var(--theme-text-muted)] flex items-center gap-1.5 text-xs mb-1.5">
            <Calendar size={14} />
            Horizon
          </div>
          <span className="text-sm font-bold capitalize">{report.profile?.investmentHorizon || 'medium'} term</span>
        </div>

        <div className="p-4 rounded-xl border bg-[var(--theme-bg)]" style={{ borderColor: 'var(--theme-border-soft)' }}>
          <div className="text-[var(--theme-text-muted)] flex items-center gap-1.5 text-xs mb-1.5">
            <HelpCircle size={14} />
            Age
          </div>
          <span className="text-sm font-bold">{report.profile?.age || 'Not specified'} yrs</span>
        </div>
      </div>

      {/* Visualizations Section */}
      {recommendations.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8 border-y py-8" style={{ borderColor: 'var(--theme-border-soft)' }}>
          {/* Allocation Pie Chart */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base tracking-tight text-center">Portfolio Asset Allocation</h3>
            <div className="h-60 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      borderColor: 'var(--theme-border-soft)',
                      borderRadius: '8px',
                      color: 'var(--theme-text)',
                      fontSize: '11px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)] font-mono">Allocation</span>
                <span className="text-base font-bold">100%</span>
              </div>
            </div>
            {/* Custom Legend list */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-[var(--theme-text-muted)]">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{item.name}: <strong>{item.value}%</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Comparison Bar Chart */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base tracking-tight text-center">CAGR vs Volatility (%)</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--theme-text-soft)', fontSize: 9 }} 
                    axisLine={{ stroke: 'var(--theme-border-soft)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--theme-text-soft)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--theme-border-soft)' }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      borderColor: 'var(--theme-border-soft)',
                      borderRadius: '8px',
                      color: 'var(--theme-text)',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="cagr" name="CAGR %" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="volatility" name="Volatility %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Summary Narrative */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-lg tracking-tight">Executive Summary</h3>
        <div 
          className="p-5 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap text-[var(--theme-text-soft)]"
          style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border-soft)' }}
        >
          {report.summary}
        </div>
      </div>

      {/* Recommendations Cards */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg tracking-tight">Fund Breakdown Details</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {recommendations.map((rec, idx) => (
              <div 
                key={rec.schemeCode || idx}
                className="p-5 rounded-2xl border flex flex-col justify-between transition-all"
                style={{ 
                  backgroundColor: 'var(--theme-surface)', 
                  borderColor: 'var(--theme-border)', 
                  boxShadow: `3px 3px 0 ${COLORS[idx % COLORS.length]}`
                }}
              >
                <div className="space-y-4">
                  <div>
                    <span 
                      className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    >
                      Allocation: {rec.allocation}%
                    </span>
                    <h4 className="font-serif font-bold text-sm leading-snug mt-2 text-[var(--theme-text)]">{rec.schemeName}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y" style={{ borderColor: 'var(--theme-border-soft)' }}>
                    <div>
                      <span className="text-[var(--theme-text-muted)] block">CAGR</span>
                      <strong className="text-emerald-500 font-bold">{rec.cagr}%</strong>
                    </div>
                    <div>
                      <span className="text-[var(--theme-text-muted)] block">Volatility</span>
                      <strong className="text-red-500 font-bold">{rec.volatility}%</strong>
                    </div>
                    <div>
                      <span className="text-[var(--theme-text-muted)] block">Sharpe</span>
                      <strong className="text-[var(--theme-text-soft)]">{rec.sharpeRatio}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--theme-text-muted)] block">Max Drawdown</span>
                      <strong className="text-rose-500 font-bold">{rec.maxDrawdown}%</strong>
                    </div>
                  </div>
                </div>

                {rec.reason && (
                  <p className="text-xs italic text-[var(--theme-text-muted)] mt-4 leading-relaxed bg-[var(--theme-bg)] p-2.5 rounded-lg border border-[var(--theme-border-soft)]">
                    "{rec.reason}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onNewChat}
          className="flex-1 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: 'var(--theme-brand)', border: '2px solid var(--theme-ink)', boxShadow: '3px 3px 0 var(--theme-ink)' }}
        >
          🔄 Start New Assessment
        </button>
        <button
          onClick={() => window.print()}
          className="py-3.5 px-6 rounded-xl font-semibold border-2 transition-all hover:bg-[var(--theme-brand-light)] cursor-pointer"
          style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
        >
          🖨️ Print Report
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;
