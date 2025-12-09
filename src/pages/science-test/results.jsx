import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../testing/test-detail.scss";
import CircularProgress from "./circularProgress";

const Results = ({
  results,
  questions,
  selectedAnswers,
  translations = {},
  languageClass = ""
}) => {
  const navigate = useNavigate();
  const [seeAll, setSeeAll] = useState(false);
  const language = localStorage.getItem("language") || "uz";

  const defaultTranslations = {
    uz: {
      title: "Test tugadi. Natijalar:",
      totalQuestions: "Jami savollar:",
      correctAnswers: "To'g'ri javoblar:",
      incorrectAnswers: "Noto'g'ri javoblar:",
      unansweredQuestions: "Belgilanmagan savollar:",
      percentageCorrect: "To'g'ri javoblar foizi:",
      timeTaken: "Sarflangan vaqt:",
      detailsButton: "Aniq tafsilot",
      backButton: "Ortga",
      reviewTitle: "Umumiy natijalar bilan tanishing!",
      noData: "Test ma'lumotlari mavjud emas",
      mainPage: "Asosiy sahifaga qaytish",
      viewDetails: "Batafsil natijalarni ko'rish"
    },
    kaa: {
      title: "Тест аяқланды. Натижелер:",
      totalQuestions: "Барлық сұрақтар:",
      correctAnswers: "Дұрыс жауаптар:",
      incorrectAnswers: "Қате жауаптар:",
      unansweredQuestions: "Жауапсыз қалған сұрақтар:",
      percentageCorrect: "Дұрыс жауаптар пайызы:",
      timeTaken: "Жұмсалған уақыт:",
      detailsButton: "Толық мәлімет",
      backButton: "Артқа",
      reviewTitle: "Жалпы натижелермен танысыңыз!",
      noData: "Тест деректері жоқ",
      mainPage: "Негізгі бетке қайту",
      viewDetails: "Толық натижелерді қарау"
    },
    ru: {
      title: "Тест завершен. Результаты:",
      totalQuestions: "Всего вопросов:",
      correctAnswers: "Правильные ответы:",
      incorrectAnswers: "Неправильные ответы:",
      unansweredQuestions: "Неотмеченные вопросы:",
      percentageCorrect: "Процент правильных ответов:",
      timeTaken: "Затраченное время:",
      detailsButton: "Подробности",
      backButton: "Назад",
      reviewTitle: "Ознакомьтесь с общими результатами!",
      noData: "Данные теста недоступны",
      mainPage: "Вернуться на главную",
      viewDetails: "Просмотреть подробные результаты"
    },
    en: {
      title: "Test completed. Results:",
      totalQuestions: "Total questions:",
      correctAnswers: "Correct answers:",
      incorrectAnswers: "Incorrect answers:",
      unansweredQuestions: "Unanswered questions:",
      percentageCorrect: "Percentage correct:",
      timeTaken: "Time taken:",
      detailsButton: "Details",
      backButton: "Back",
      reviewTitle: "Review your overall results!",
      noData: "Test data not available",
      mainPage: "Return to main page",
      viewDetails: "View detailed results"
    }
  };

  const t = translations[language] || defaultTranslations[language] || defaultTranslations["uz"];

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("timePerQuestion");
      localStorage.removeItem("startTime");
      navigate("/school/tests");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  const deleteTestDetail = () => {
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("timeLeft");
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

  return (
    <div className={`results-container ${languageClass}`}>
      <h2 className={languageClass}>{t.title}</h2>
      <div className="result-inner">
        <div className={`text-inner-left ${languageClass}`}>
          <p className={languageClass}>
            <span className={languageClass}>{t.totalQuestions}</span> {results.total_questions}
          </p>
          <p className={languageClass}>
            <span className={languageClass}>{t.correctAnswers}</span> {results.correct_answers}
          </p>
          <p className={languageClass}>
            <span className={languageClass}>{t.incorrectAnswers}</span> {results.incorrect_answers}
          </p>
          <p className={languageClass}>
            <span className={languageClass}>{t.unansweredQuestions}</span> {results.unanswered_questions}
          </p>
          <p className={languageClass}>
            <span className={languageClass}>{t.percentageCorrect}</span> {results.percentage_correct}%
          </p>
          <p className={languageClass}>
            <span className={languageClass}>{t.timeTaken}</span> {results.time_taken}
          </p>
        </div>
        <div id="go-back">
          <button id="mobile-ver" className={languageClass} onClick={() => setSeeAll(true)}>
            <span className={languageClass}>{t.detailsButton}</span>
          </button>
        </div>
        <div className={`text-inner-right ${languageClass}`}>
          <div className={`all-results-shape ${seeAll ? "active" : ""}`}></div>
          <div className={`all-results ${seeAll ? "active" : ""} ${languageClass}`}>
            <div className={`to-back ${languageClass}`}>
              <button className={languageClass} onClick={() => setSeeAll(false)}>
                <span className={languageClass}>{t.backButton}</span>
              </button>
              <p className={languageClass}>{t.reviewTitle}</p>
            </div>
            <div className={`circles ${languageClass}`}>
              {questions && questions.length > 0 ? (
                questions.map((question, index) => {
                  const userAnswer = selectedAnswers.find(
                    (answer) => answer.questionId === question.id
                  );
                  return (
                    <div key={index} className={`question-review ${languageClass}`}>
                      <div className={`question-option-line ${languageClass}`}>
                        <p className={`question-text ${languageClass}`}>
                          <span className={`q-count ${languageClass}`}>{index + 1})</span>{" "}
                          <span
                            className={languageClass}
                            dangerouslySetInnerHTML={{ __html: question.question_text }}
                          />
                        </p>
                        <div className={`options-container ${languageClass}`}>
                          {question.options &&
                            question.options.map((option, optionIndex) => {
                              const userAnswer = selectedAnswers.find(
                                (answer) => answer.questionId === question.id
                              );

                              let status = "";

                              if (option.is_correct) {
                                if (!userAnswer) {
                                  status = "blue";
                                }
                                else if (userAnswer.id === option.id) {
                                  status = "correct";
                                }
                                else {
                                  status = "blue";
                                }
                              }
                              else if (userAnswer && userAnswer.id === option.id) {
                                status = "incorrect";
                              }

                              return (
                                <div key={option.id} className={`option ${status} ${languageClass}`}>
                                  <strong className={`chart ${languageClass}`}>
                                    {String.fromCharCode(65 + optionIndex)})
                                  </strong>
                                  <span
                                    className={languageClass}
                                    dangerouslySetInnerHTML={{ __html: option.option_text }}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={languageClass}>{t.noData}</p>
              )}
            </div>
          </div>
          <CircularProgress
            value={results.correct_answers}
            maxValue={results.total_questions}
            languageClass={languageClass}
          />
        </div>
      </div>
      <div id="go-back" className={languageClass}>
        <Link to="/" className={languageClass} onClick={deleteTestDetail}>
          <span className={languageClass}>{t.mainPage}</span>
        </Link>
        <button id="ws" className={languageClass} onClick={() => setSeeAll(true)}>
          <span className={languageClass}>{t.viewDetails}</span>
        </button>
      </div>
    </div>
  );
};

export default Results;