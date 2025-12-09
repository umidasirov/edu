import React from 'react';
import "./analyzingLoading.scss";

const AnalyzingLoading = () => {

    const language = localStorage.getItem("language") || "uz"

  const translations = {
    kaa: "Натижалар таҳлил қилинмақда...",
    ru: "Результаты анализируются...",
    en: "Analyzing results...",
    uz: "Natijalar tahlil qilinmoqda..."
  };

  return (
    <div className='loadingAnalyzing'>
        <div className="load"></div>
        <div className="text">{translations[language] || translations.uz}</div>
    </div>
  )
}

export default AnalyzingLoading;