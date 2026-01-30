import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./toifa.scss";
import { AccessContext } from "../../AccessContext";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";
import CircularProgress from "./circularProgress";
import Analyzer from "../../components/analyzer/analyzer";
import { api } from "../../App";

const Results = ({ results, test, selectedAnswers, loading }) => {
  const navigate = useNavigate();
  const { setStartTest } = useContext(AccessContext);
  const [seeAll, setSeeAll] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const language = localStorage.getItem("language") || "uz";

  const allQuestions = test?.questions_grouped_by_science 
    ? Object.values(test.questions_grouped_by_science).flat()
    : [];

  const translations = {
    uz: {
      title: "Test tugadi. Natijalar:",
      totalQuestions: "Jami savollar:",
      correctAnswers: "To'g'ri javoblar:",
      incorrectAnswers: "Noto'g'ri javoblar:",
      unansweredQuestions: "Belgilanmagan savollar:",
      percentageCorrect: "To'g'ri javoblar foizi:",
      timeSpent: "Sarflangan vaqt:",
      totalScore: "To'plagan ballaringiz:",
      details: "Aniq tafsilot",
      back: "Ortga",
      reviewTitle: "Umumiy natijalar bilan tanishing!",
      mainPage: "Asosiy bo'limga qaytish",
      fullResults: "Batafsil natijalarni ko'rish",
      excellentResult: "Ajoyib natija! Siz Prezident maktabiga kirishga juda yaqin! Sinovni yana takrorlab, ishonch hosil qiling.",
      goodResult: "Siz yaxshi natija qayd etdingiz, ammo hali ozgina mashq qilish kerak! Natijangizni oshirish uchun yana test ishlang.",
      poorResult: "Bu faqat boshlanishi! Tajriba orttirish uchun yana bir test ishlang.",
      tryAgain: "Yana bir urinish",
      improve: "O'z natijangizni yaxshilang",
      tryNow: "Hozir harakat qilib ko'ring"
    },
    kaa: {
      title: "Тест тугади. Нәтийжелер:",
      totalQuestions: "Жами сўрақлар:",
      correctAnswers: "Тўғри жавоблар:",
      incorrectAnswers: "Нотоғри жавоблар:",
      unansweredQuestions: "Белгиланмаган сўрақлар:",
      percentageCorrect: "Тўғри жавоблар фоизи:",
      timeSpent: "Сарфланган вақт:",
      totalScore: "Топлаган балларингиз:",
      details: "Аниқ тафсилот",
      back: "Орқа",
      reviewTitle: "Умумий нәтийжелер билан танишинг!",
      mainPage: "Асосий бўлимга қайтиш",
      fullResults: "Батафсил нәтийжелерни кўриш",
      excellentResult: "Ажойиб нәтийже! Сиз Президент мактабыга киришка жуда яқинсиз! Синовни яна такрорлап, ишонч ҳосил қилинг.",
      goodResult: "Сиз яхшы нәтийже қайд этдингиз, аммо ҳали озгина машқ қилиш керак! Нәтийжени ошириш үщүн яна тест ишланг.",
      poorResult: "Бу фақат бошланғич! Таҗриба орттириш үщүн яна бир тест ишланг.",
      tryAgain: "Яна бир уриниш",
      improve: "Ўз нәтийжани яхшилаш",
      tryNow: "Ҳозир ҳаракат қилиб кўринг"
    },
    ru: {
      title: "Тест завершен. Результаты:",
      totalQuestions: "Всего вопросов:",
      correctAnswers: "Правильные ответы:",
      incorrectAnswers: "Неправильные ответы:",
      unansweredQuestions: "Неотмеченные вопросы:",
      percentageCorrect: "Процент правильных ответов:",
      timeSpent: "Затраченное время:",
      totalScore: "Набранные баллы:",
      details: "Подробности",
      back: "Назад",
      reviewTitle: "Ознакомьтесь с общими результатами!",
      mainPage: "Вернуться на главную",
      fullResults: "Посмотреть подробные результаты",
      excellentResult: "Отличный результат! Вы очень близки к поступлению в Президентскую школу! Повторите тест для уверенности.",
      goodResult: "Вы показали хороший результат, но нужно еще немного потренироваться! Пройдите тест еще раз, чтобы улучшить свой результат.",
      poorResult: "Это только начало! Пройдите тест еще раз, чтобы набраться опыта.",
      tryAgain: "Попробовать снова",
      improve: "Улучшить свой результат",
      tryNow: "Попробуйте сейчас"
    },
    en: {
      title: "Test completed. Results:",
      totalQuestions: "Total questions:",
      correctAnswers: "Correct answers:",
      incorrectAnswers: "Incorrect answers:",
      unansweredQuestions: "Unanswered questions:",
      percentageCorrect: "Percentage correct:",
      timeSpent: "Time spent:",
      totalScore: "Total score:",
      details: "Details",
      back: "Back",
      reviewTitle: "Review your overall results!",
      mainPage: "Return to main page",
      fullResults: "View full results",
      excellentResult: "Excellent result! You're very close to entering the Presidential School! Retake the test for confidence.",
      goodResult: "You achieved a good result, but need a little more practice! Take the test again to improve your score.",
      poorResult: "This is just the beginning! Take another test to gain experience.",
      tryAgain: "Try again",
      improve: "Improve your score",
      tryNow: "Try now"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  // Handle page refresh and cleanup
  useEffect(() => {
    const pageAccessedByReload = (
      (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType("navigation")
        .map((nav) => nav.type)
        .includes("reload")
    );

    if (pageAccessedByReload && !isInitialLoad) {
      navigate('/toifa-imtihonlari');
      return;
    }

    setIsInitialLoad(false);

    const handleBeforeUnload = () => {
      cleanupTestData();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!pageAccessedByReload) {
        cleanupTestData();
      }
    };
  }, [navigate]);

  const cleanupTestData = () => {
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("timePerQuestion");
    localStorage.removeItem("startTime");
    localStorage.removeItem("startTest");
    setStartTest(null);
  };

  useEffect(() => {
    if (seeAll) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [seeAll]);

  const renderQuestionText = (text) => {
    if (typeof text !== "string") return "";

    const baseUrl = api;
    text = text.replace(
      /<img\s+src=["'](\/media[^"']+)["']/g,
      (match, path) => `<img src="${baseUrl}${path}" />`
    );

    const mathRegex = /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div/g;
    text = text.replace(mathRegex, (match) => {
      try {
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    text = text.replace(
      /alt=["']?Question Image["']?\s*style=["'][^"']*["']?\s*\/?>/g,
      ""
    );

    return text;
  };

  const getResultMessage = (percentage) => {
    if (percentage >= 80) {
      return {
        message: t.excellentResult,
        cta: t.tryAgain
      };
    } else if (percentage >= 50) {
      return {
        message: t.goodResult,
        cta: t.improve
      };
    } else {
      return {
        message: t.poorResult,
        cta: t.tryNow
      };
    }
  };

  const { message, cta } = getResultMessage(results.percentage_correct);

  return (
    <div className={`results-container ${getLanguageClass()}`}>
      <h2 className={getLanguageClass()}>{t.title}</h2>

      <div className={`result-inner ${getLanguageClass()}`}>
        <div className={`text-inner-left ${getLanguageClass()}`}>
          <p className={getLanguageClass()}><span>{t.totalQuestions}</span> {results.score.total_questions}</p>
          <p className={getLanguageClass()}><span>{t.correctAnswers}</span> {results.score.earned_score}</p>
          <p className={getLanguageClass()}><span>{t.incorrectAnswers}</span> {results.score.total_questions - results.score.earned_score}</p>
          <p className={getLanguageClass()}><span>{t.unansweredQuestions}</span> 0</p>
          <p className={getLanguageClass()}><span>{t.percentageCorrect}</span> {(results.score.earned_score / results.score.total_questions * 100).toFixed(2)}%</p>
          <p className={getLanguageClass()}><span>{t.timeSpent}</span> {results.attempt.finished_at && results.attempt.started_at ? 
            (() => {
              const start = new Date(results.attempt.started_at);
              const end = new Date(results.attempt.finished_at);
              const diff = Math.floor((end - start) / 1000);
              return `${Math.floor(diff / 60)} daqiqa ${diff % 60} soniya`;
            })() : "0 daqiqa"
          }</p>
          <p className={getLanguageClass()}><span>{t.totalScore}</span> {results.score.earned_score}/{results.score.total_score}</p>
        </div>
        

        <div id="go-back" className={getLanguageClass()}>
          <button id="mobile-ver" onClick={() => setSeeAll(true)} className={getLanguageClass()}>
            {t.details}
          </button>
        </div>

        <div className={`text-inner-right ${getLanguageClass()}`}>
          <div className={`all-results-shape ${seeAll ? "active" : ""} ${getLanguageClass()}`}></div>

          <div className={`all-results ${seeAll ? "active" : ""} ${getLanguageClass()}`}>
            <div className={`to-back ${getLanguageClass()}`}>
              <button onClick={() => setSeeAll(false)} className={getLanguageClass()}>
                {t.back}
              </button>
              <p className={getLanguageClass()}>{t.reviewTitle}</p>
            </div>

            <div className={`circles ${getLanguageClass()}`}>
              {allQuestions.map((question, index) => {
                const userAnswer = selectedAnswers.find(
                  (answer) => answer.questionId === question.id
                );

                return (
                  <div key={index} className={`question-review ${getLanguageClass()}`}>
                    <div className={`question-option-line ${getLanguageClass()}`}>
                      <p className={`question-text ${getLanguageClass()}`}>
                        <span className={`q-count ${getLanguageClass()}`}>{index + 1}.</span>
                        <span>{parse(renderQuestionText(question.text))}</span>
                      </p>

                      <div className={`options-container ${getLanguageClass()}`}>
                        {question.options.map((option, optionIndex) => {
                          const userAnswer = selectedAnswers.find(
                            (answer) => answer.questionId === question.id
                          );

                          let status = "";

                          // 1. Agar variant to'g'ri javob bo'lsa
                          if (option.is_staff) {
                            // a) Foydalanuvchi to'g'ri javob bergan bo'lsa
                            if (userAnswer && userAnswer.id === option.id) {
                              status = "correct";
                            }
                            // b) Foydalanuvchi javob bermagan yoki noto'g'ri javob bergan bo'lsa
                            else {
                              status = "blue";
                            }
                          }
                          // 2. Agar variant noto'g'ri bo'lsa va foydalanuvchi shuni tanlagan bo'lsa
                          else if (userAnswer && userAnswer.id === option.id) {
                            status = "incorrect";
                          }

                          return (
                            <div key={option.id} className={`option ${status} ${getLanguageClass()}`}>
                              <strong className={`chart ${getLanguageClass()}`}>
                                {String.fromCharCode(65 + optionIndex)})
                              </strong>
                              <span>{parse(renderQuestionText(option.text))}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <CircularProgress
            value={results.score.earned_score}
            maxValue={results.score.total_score}
          />
        </div>
      </div>
        <Analyzer results={results} loading={loading}/>


      <div className={`result-message ${getLanguageClass()}`}>
        <p className={getLanguageClass()}>Test natijalari saqlandi</p>
        <button onClick={() => navigate('/toifa-imtihonlari')} className={getLanguageClass()}>
          {cta}
        </button>
      </div>

      <div id="go-back" className={getLanguageClass()}>
        <Link to="/" onClick={cleanupTestData} className={getLanguageClass()}>
          {t.mainPage}
        </Link>
        {/* <button id="ws" onClick={() => setSeeAll(true)} className={getLanguageClass()}>
          {t.fullResults}
        </button> */}
      </div>
    </div>
  );
};

export default Results;
