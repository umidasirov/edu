import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../testing/test-detail.scss";
import { AccessContext } from "../../AccessContext";
import AnalyzingLoading from "../../components/analyzing-loading/analyzingLoading";

const TestHeader = ({ currentIndex, totalQuestions, timeLeft, calculateResults = () => {}, res }) => {
  const { setStartTest } = useContext(AccessContext);
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      exit: "Chiqish",
      questionProgress: (total, current) =>
        `Siz ${total} ta savoldan ${current} - savolga javob bermoqdasiz`,
      timeFormat: "00:00:00"
    },
    kaa: {
      exit: "Шығу",
      questionProgress: (total, current) =>
        `Сиз ${total} сұрақтан ${current}-сұраққа жуап бересиз`,
      timeFormat: "00:00:00"
    },
    ru: {
      exit: "Выход",
      questionProgress: (total, current) =>
        `Вы отвечаете на ${current} вопрос из ${total}`,
      timeFormat: "00:00:00"
    },
    en: {
      exit: "Exit",
      questionProgress: (total, current) =>
        `You're answering question ${current} of ${total}`,
      timeFormat: "00:00:00"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  const formatTime = (seconds) => {
    if (seconds === null) return t.timeFormat;
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  const cleanupTest = () => {
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("startTest");
  };

  const fullCleanup = () => {
    cleanupTest();
    setStartTest(null);
    calculateResults(); // Endi xato bermaydi, chunki default function bor
  };

  useEffect(() => {
    if (timeLeft === 0) {
      cleanupTest();
    }
  }, [timeLeft]);

  if (res) {
    return <AnalyzingLoading />
  }

  return (
    <div className={`testing-header ${getLanguageClass()}`}>
      <button
        className={`exit deskt ${getLanguageClass()}`}
        onClick={fullCleanup}
        disabled={res}
      >
        {res ? t.analyzing : (
          language === "uz" ? "Testni yakunlash" :
            language === "ru" ? "Завершить тест" :
              language === "en" ? "Finish Test" : "Тестти тамaмлаў"
        )}
      </button>

      <p className={`count ${getLanguageClass()}`}>
        {language === "uz" ? (
          <>
            Siz <span>{totalQuestions}</span> ta savoldan <span>{totalQuestions !== 0 ? currentIndex + 1 : 0}</span> - savolga javob bermoqdasiz
          </>
        ) : language === "ru" ? (
          <>
            Вы отвечаете на <span>{totalQuestions !== 0 ? currentIndex + 1 : 0}</span> вопрос из <span>{totalQuestions}</span>
          </>
        ) : language === "en" ? (
          <>
            You're answering question <span>{totalQuestions !== 0 ? currentIndex + 1 : 0}</span> of <span>{totalQuestions}</span>
          </>
        ) : (
          <>
            Сиз <span>{totalQuestions}</span> сұрақтан <span>{totalQuestions !== 0 ? currentIndex + 1 : 0}</span>-сұраққа жуап бересиз
          </>
        )}
      </p>

      <div className={`time ${getLanguageClass()}`}>
        {formatTime(totalQuestions === 0 ? null : timeLeft)}
      </div>

      <div className={`count-time ${getLanguageClass()}`}>
        <p className={getLanguageClass()}>{totalQuestions !== 0 ? currentIndex + 1 : 0}.</p>
        <div className={`time-mob ${getLanguageClass()}`}>
          {formatTime(totalQuestions === 0 ? null : timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default TestHeader;