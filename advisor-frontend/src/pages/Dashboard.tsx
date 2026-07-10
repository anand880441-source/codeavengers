import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserReports } from '../services/api';
import { motion } from 'framer-motion';
import { LineChart, Plus, FileText, ChevronRight, User, Calendar, IndianRupee, HelpCircle } from 'lucide-react';

interface Report {
  _id: string;
  conversationId: string;
  profile: {
    riskTolerance?: string;
    investmentHorizon?: string;
    monthlyAmount?: number;
    goal?: string;
    age?: number;
  };
  recommendations: any[];
  summary: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!user) return;
      try {
        setLoadingReports(true);
        const data = await getUserReports(user.id);
        setReports(data);
      } catch (err) {
        console.error('Error fetching user reports:', err);
        setError('Could not retrieve your reports. Please try again.');
      } finally {
        setLoadingReports(false);
      }
    };

    if (user) {
      fetchUserReports();
    }
  }, [user]);

  const handleViewReport = (reportId: string) => {
    localStorage.setItem('viewReportId', reportId);
    navigate('/report');
  };

  const handleStartNew = () => {
    localStorage.removeItem('viewReportId');
    localStorage.removeItem('conversationId');
    navigate('/disclaimer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--theme-brand) transparent transparent transparent' }} />
          <p className="mt-4 text-[var(--theme-text-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Financial Workspace</h1>
            <p className="text-[var(--theme-text-muted)] mt-1.5 text-sm">
              Welcome back, <span className="font-semibold text-[var(--theme-text-soft)]">{user?.email}</span>
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold text-white transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: 'var(--theme-brand)', border: '2px solid var(--theme-ink)', boxShadow: '3px 3px 0 var(--theme-ink)' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            New Assessment
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left/Middle: Reports History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold tracking-tight flex items-center gap-2">
                <FileText size={18} style={{ color: 'var(--theme-brand)' }} />
                Your Portfolios & Recommendations
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[var(--theme-brand-light)] text-[var(--theme-brand)]">
                {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
              </span>
            </div>

            {loadingReports ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-32 w-full rounded-2xl animate-pulse border border-[var(--theme-border-soft)] bg-[var(--theme-surface)]" />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl border border-red-200 bg-red-50/50 text-red-700 text-xs">
                {error}
              </div>
            ) : reports.length === 0 ? (
              <div 
                className="p-12 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center" 
                style={{ borderColor: 'var(--theme-border-soft)', backgroundColor: 'var(--theme-surface)' }}
              >
                <div className="w-12 h-12 rounded-full bg-[var(--theme-brand-light)] text-[var(--theme-brand)] flex items-center justify-center mb-4">
                  <LineChart size={22} />
                </div>
                <h3 className="font-semibold text-sm">No investment reports yet</h3>
                <p className="text-xs text-[var(--theme-text-muted)] max-w-xs mt-1 leading-relaxed">
                  Start a new voice discovery conversation to generate custom mutual fund allocation metrics.
                </p>
                <button
                  onClick={handleStartNew}
                  className="mt-5 px-4.5 py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
                  style={{ backgroundColor: 'var(--theme-brand)' }}
                >
                  Create First Briefing
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => {
                  const dateStr = new Date(report.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  const riskVal = report.profile?.riskTolerance || 'medium';
                  const riskLabel = riskVal === 'high' ? 'Aggressive' : riskVal === 'low' ? 'Conservative' : 'Moderate';
                  const riskColor = riskVal === 'high' ? '#EF4444' : riskVal === 'low' ? '#10B981' : '#F59E0B';

                  return (
                    <motion.div
                      key={report._id}
                      whileHover={{ y: -2 }}
                      className="p-5 md:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all"
                      style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border-soft)' }}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: riskColor }}>
                            {riskLabel}
                          </span>
                          <span className="text-[11px] text-[var(--theme-text-muted)] font-medium flex items-center gap-1">
                            <Calendar size={12} />
                            {dateStr}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base leading-tight">
                          Goal: <span className="capitalize text-[var(--theme-text-soft)]">{report.profile?.goal || 'General Wealth'}</span>
                        </h3>

                        <div className="flex gap-4.5 text-xs text-[var(--theme-text-muted)] flex-wrap">
                          <span className="flex items-center gap-1">
                            <IndianRupee size={12} />
                            Monthly: <strong className="text-[var(--theme-text-soft)]">₹{(report.profile?.monthlyAmount || 0).toLocaleString()}</strong>
                          </span>
                          <span>
                            Horizon: <strong className="text-[var(--theme-text-soft)] capitalize">{report.profile?.investmentHorizon || 'medium'}</strong>
                          </span>
                          {report.profile?.age && (
                            <span>
                              Age: <strong className="text-[var(--theme-text-soft)]">{report.profile.age}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewReport(report._id)}
                        className="px-4.5 py-2.5 rounded-lg border text-xs font-semibold tracking-wide flex items-center justify-center gap-1 hover:bg-[var(--theme-brand-light)] hover:text-[var(--theme-brand)] hover:border-[var(--theme-brand)] transition-all cursor-pointer select-none"
                        style={{ borderColor: 'var(--theme-border-soft)', color: 'var(--theme-text-soft)' }}
                      >
                        Open Briefing
                        <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Help & User Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border-soft)' }}>
              <h2 className="text-base font-serif font-bold tracking-tight mb-4 flex items-center gap-2">
                <User size={18} style={{ color: 'var(--theme-brand)' }} />
                Account Overview
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--theme-border-soft)' }}>
                  <span className="text-[var(--theme-text-muted)]">Registered Email</span>
                  <span className="font-semibold">{user?.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--theme-border-soft)' }}>
                  <span className="text-[var(--theme-text-muted)]">Supabase ID</span>
                  <span className="font-mono text-[10px] text-[var(--theme-text-muted)] truncate max-w-[120px]">{user?.id}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--theme-text-muted)]">Account Status</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border-soft)' }}>
              <h2 className="text-base font-serif font-bold tracking-tight mb-4 flex items-center gap-2">
                <HelpCircle size={18} style={{ color: 'var(--theme-brand)' }} />
                Sandbox Guidelines
              </h2>
              <ul className="space-y-2.5 text-xs text-[var(--theme-text-muted)] leading-relaxed">
                <li>• Recommended allocations are computed using modern portfolio variance principles.</li>
                <li>• Fund listings map to actual historical NAV records.</li>
                <li>• No actual trade execution or advisory is performed.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
