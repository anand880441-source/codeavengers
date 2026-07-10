import React from 'react';

const Disclaimer = () => {
  return (
    <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
      <p className="text-xs md:text-sm text-yellow-800">
        ⚠️ <span className="font-semibold">Disclaimer:</span> This is an educational tool that analyzes 
        past performance of publicly available mutual fund data. Past performance does not guarantee 
        future returns. This is <span className="font-bold">not personalized investment advice</span>. 
        Please consult a financial advisor for investment decisions.
      </p>
    </div>
  );
};

export default Disclaimer;
