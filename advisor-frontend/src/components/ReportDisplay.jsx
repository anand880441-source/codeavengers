import React from 'react';

const ReportDisplay = ({ report, onNewChat }) => {
  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No report available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Your Investment Report</h2>
      
      {/* Disclaimer */}
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
        <p className="text-xs text-yellow-800">
          ⚠️ <span className="font-semibold">Disclaimer:</span> {report.disclaimer || 'This is an educational tool. Past performance does not guarantee future returns. This is not personalized investment advice.'}
        </p>
      </div>

      {/* Summary */}
      <div className="prose max-w-none mb-6">
        <div className="whitespace-pre-wrap text-gray-700">{report.summary}</div>
      </div>

      {/* Recommendations */}
      {report.recommendations && report.recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended Funds</h3>
          <div className="grid gap-3">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start flex-wrap">
                  <div>
                    <h4 className="font-semibold text-gray-800">{rec.schemeName}</h4>
                    <p className="text-sm text-gray-600">Allocation: {rec.allocation}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm"><span className="font-medium">CAGR:</span> {rec.cagr}%</p>
                    <p className="text-sm"><span className="font-medium">Volatility:</span> {rec.volatility}%</p>
                    <p className="text-sm"><span className="font-medium">Sharpe:</span> {rec.sharpeRatio}</p>
                  </div>
                </div>
                {rec.reason && (
                  <p className="text-sm text-gray-600 mt-2">{rec.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        🔄 Start New Conversation
      </button>
    </div>
  );
};

export default ReportDisplay;
