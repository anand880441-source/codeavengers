import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReportDisplay from '../components/ReportDisplay';
import { generateReport, getReport } from '../services/api';

export default function Report() {
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const viewReportId = localStorage.getItem('viewReportId');
        if (viewReportId) {
          const result = await getReport(viewReportId);
          setReport(result);
          localStorage.removeItem('viewReportId'); // clear it
        } else {
          const conversationId = localStorage.getItem('conversationId') || 'demo';
          const result = await generateReport(conversationId);
          setReport(result);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleNewChat = () => {
    navigate('/disclaimer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--theme-brand) transparent transparent transparent' }} />
          <p className="mt-4 text-[var(--theme-text-muted)]">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleNewChat}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--theme-brand)' }}
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ReportDisplay report={report} onNewChat={handleNewChat} />
        </motion.div>
      </div>
    </div>
  );
}
