import "./circular.scss";

const CircularProgress = ({ value, maxValue }) => {
  const radius = 90; 
  const strokeWidth = 10; 
  const circumference = 2 * Math.PI * radius; 
  const progress = (value / maxValue) * 100; 

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const language = localStorage.getItem("language") || "uz";
  
  const translations = {
    uz: {
      total: "Umumiy",
      percentage: "%"
    },
    kaa: {
      total: "Барлығы",
      percentage: "%"
    },
    ru: {
      total: "Всего",
      percentage: "%"
    },
    en: {
      total: "Total",
      percentage: "%"
    }
  };

  const t = translations[language] || translations["uz"];

  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="circular-progress"
    >
      <circle
        cx="100"
        cy="100"
        r={radius}
        stroke="#3c3c3c"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        stroke="#1AD079" 
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: "stroke-dashoffset 0.5s ease",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="-0.5em"
        fill="#3c3c3c"
        fontSize="20"
        fontWeight="bold"
      >
        {value} / {maxValue}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="1em"
        fill="#3c3c3c"
        fontSize="16"
      >
        {t.total} - {progress.toFixed(2)}%
      </text>
    </svg>
  );
};

export default CircularProgress;
