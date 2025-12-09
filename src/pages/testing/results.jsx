import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./test-detail.scss";
import CircularProgress from "./circularProgres";
import { AccessContext } from "../../AccessContext";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";
import Analyzer from "../../components/analyzer/analyzer";

const Results = ({ results, test, selectedAnswers, loading }) => {
  const navigate = useNavigate();
  const [seeAll, setSeeAll] = useState(false);
  const { setStartTest } = useContext(AccessContext);
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
      title: "Тест аяқланды. Натижелер:",
      totalQuestions: "Жами сұрақтар:",
      correctAnswers: "Тўғри жуаптар:",
      incorrectAnswers: "Қате жуаптар:",
      unansweredQuestions: "Белгиленмеген сұрақтар:",
      percentageCorrect: "Тўғри жуаплар пайызы:",
      timeSpent: "Сарфланған уақыт:",
      totalScore: "Жыйналған балаңыз:",
      details: "Анық тафсилот",
      back: "Артқа",
      reviewTitle: "Умумий натижелер менен танысыңыз!",
      mainPage: "Негизги бөлимге қайтыў",
      fullResults: "Толық натижелерди көриў",
      excellentResult: "Ажайып натиже! Сиз Президент мектебине кириўге жуқынсыз! Сынаўды тақырлап, ишонч хосил қылыңыз.",
      goodResult: "Сиз жақсы натиже қойдыңыз, бирақ дагы аз ғана машық қылыў керек! Натижеңизди ошириў үшін дагы тест ишлеңиз.",
      poorResult: "Бул басталыўы ғана! Тажриба орттырыў үшін дагы бир тест ишлеңиз.",
      tryAgain: "Дагы бир урыныў",
      improve: "Өз натижеңизди жақсартыў",
      tryNow: "Ҳазир қазақ қылып көриңиз"
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupTestData();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
      document.documentElement.style.overflowX = "unset";
    } else {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowX = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [seeAll]);

  const renderQuestionText = (text) => {
    if (typeof text !== "string") return "";

    const baseUrl = "https://edumark.uz";
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

  console.log(results, "res")

  const { message, cta } = getResultMessage(results.percentage_correct);

  return (
    <div className={`results-container ${getLanguageClass()}`}>
      <h2 className={getLanguageClass()}>{t.title}</h2>
      <div className={`result-inner ${getLanguageClass()}`}>
        <div className={`text-inner-left ${getLanguageClass()}`}>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.totalQuestions}</span> {results.total_questions}</p>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.correctAnswers}</span> {results.ai.correct_answers}</p>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.incorrectAnswers}</span> {results.ai.incorrect_answers}</p>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.unansweredQuestions}</span> {results.unanswered_questions}</p>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.percentageCorrect}</span> {(results.ai.correct_answers / results.total_questions * 100).toFixed(2)}%</p>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.timeSpent}</span> {results.time_taken}</p>
          <p className={getLanguageClass()}><span className={` ${getLanguageClass()}`}>{t.totalScore}</span> {results.total_score}</p>
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
            value={results.ai.correct_answers}
            maxValue={results.total_questions}
          />
        </div>
      </div>
      <Analyzer results={results} loading={loading} />

      <div className={`result-message ${getLanguageClass()}`}>
        <p className={getLanguageClass()}>{results.ai_text}</p>
        <button onClick={() => navigate(`/schools/prezident-maktablari`)} className={getLanguageClass()}>
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