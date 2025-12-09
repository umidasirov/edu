import React, { useState } from 'react';
import './analyzer.scss';
import { useParams } from 'react-router-dom';

const Analyzer = ({ results, loading }) => {
  const { name, id } = useParams();
  const [error] = useState(null);

  const getStableColor = (categoryName) => {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return {
      op100: `hsl(${hue}, 80%, 60%)`,
      op70: `hsla(${hue}, 80%, 60%, 0.7)`,
      op50: `hsla(${hue}, 80%, 60%, 0.5)`
    };
  };

  const formatName = (name) => {
    return name.replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">Xato yuz berdi: {error}</div>;
  if (!results?.ai) return <div className="error">Ma'lumot topilmadi</div>;

  // departmentStatistics obyektini olish
  const departmentStatistics = results.ai.department_statistics;
  
  // Kalitlarni (mavzularni) olish va ularni foizga qarab tartiblash
  const categories = Object.entries(departmentStatistics)
    .map(([category, stats]) => ({
      category,
      percentage: stats.foiz || '0%',
      correct: stats['to‘g‘ri'] || 0,
      incorrect: stats['noto‘g‘ri'] || 0,
      color: getStableColor(category)
    }))
    .sort((a, b) => {
      // Foizni songa aylantirib solishtiramiz
      const percentA = parseInt(a.percentage);
      const percentB = parseInt(b.percentage);
      return percentB - percentA;
    });

  return (
    <div className="matematika-results">
      <h2>{formatName(name)}</h2>
      <h3>Sizning Real-Vaqtdagi natijalaringiz</h3>

      <div className="scroll-container">
        <div className="scores-container">
          {categories.map(({ category, percentage, color }, index) => (
            <div className='item-content' key={index}>
              <div className="item-way" style={{ '--c-op100': color.op100 }}>
                <span>{percentage}</span>
              </div>
              <div
                className="score-item"
                style={{
                  '--i': `${parseInt(percentage)}%`,
                  '--c': color.op70,
                  '--c-op50': color.op50,
                }}
              >
                <div className="ver-line"></div>
              </div>
              <div className="score-category" style={{ color: color.op100 }}>
                <div className="stats-details">
                  {/* {category.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                  ))} */}
                  <span>{category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;