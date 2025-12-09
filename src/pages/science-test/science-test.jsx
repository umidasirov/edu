import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./science-test.scss";
import Loading from "../../components/loading/loading";
import Question from "./question";
import Results from "./results";
import { api } from "../../App";
import TestHeader from "./test-header";

const ScienceTest = () => {
  const { name, question, time } = useParams();
  const questionCount = Number(question);
  const testTime = Number(time) * 60;
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      loadingError: "Savollar yoki variantlarni yuklashda xatolik!",
      error: "Xatolik: ",
      attention: "Diqqat!",
      navigationHint: "Bu tugmalar orqali savollar orasida harakat qilishingiz mumkin.",
      previous: "Ortga",
      next: "Keyingi Savol",
      viewResults: "Natijani Ko'rish",
      timeFormat: " daqiqa  soniya",
      results: {
        correct: "To'g'ri javoblar: ",
        incorrect: "Noto'g'ri javoblar: ",
        total: "Jami savollar: ",
        unanswered: "Javobsiz savollar: ",
        percentage: "To'g'ri javoblar foizi: ",
        timeTaken: "Sarflangan vaqt: "
      }
    },
    kaa: {
      loadingError: "Сұрақтар немесе варианттарды жүктеу кезінде қателік!",
      error: "Қателік: ",
      attention: "Назар аударыңыз!",
      navigationHint: "Бұл батырмалар арқылы сұрақтар арасында қозғала аласыз.",
      previous: "Артқа",
      next: "Келесі сұрақ",
      viewResults: "Нәтижені көру",
      timeFormat: " минут  секунд",
      results: {
        correct: "Дұрыс жауаптар: ",
        incorrect: "Қате жауаптар: ",
        unanswered: "Жауапсыз сұрақтар: ",
        total: "Барлық сұрақтар: ",
        percentage: "Дұрыс жауаптар пайызы: ",
        timeTaken: "Жұмсалған уақыт: "
      }
    },
    ru: {
      loadingError: "Ошибка при загрузке вопросов или вариантов!",
      error: "Ошибка: ",
      attention: "Внимание!",
      navigationHint: "Вы можете перемещаться между вопросами с помощью этих кнопок.",
      previous: "Назад",
      next: "Следующий вопрос",
      viewResults: "Посмотреть результаты",
      timeFormat: " минута  секунда",
      results: {
        correct: "Правильные ответы: ",
        incorrect: "Неправильные ответы: ",
        total: "Всего вопросов: ",
        unanswered: "Вопросы без ответа: ",
        percentage: "Процент правильных ответов: ",
        timeTaken: "Затраченное время: "
      }
    },
    en: {
      loadingError: "Error loading questions or options!",
      error: "Error: ",
      attention: "Attention!",
      navigationHint: "You can navigate between questions using these buttons.",
      previous: "Previous",
      next: "Next Question",
      viewResults: "View Results",
      timeFormat: " minute  second",
      results: {
        correct: "Correct answers: ",
        incorrect: "Incorrect answers: ",
        total: "Total questions: ",
        unanswered: "Unanswered questions: ",
        percentage: "Percentage correct: ",
        timeTaken: "Time taken: "
      }
    }
  };

  const t = translations[language] || translations["uz"];

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(testTime);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      try {
        const questionsResponse = await fetch(
          `${api}/test_questions/`
        );
        const optionsResponse = await fetch(
          `${api}/test_options/`
        );

        if (!questionsResponse.ok || !optionsResponse.ok)
          throw new Error(t.loadingError);

        const questionsData = await questionsResponse.json();
        const optionsData = await optionsResponse.json();

        const checkedTopics =
          JSON.parse(localStorage.getItem("checkedTopics")) || [];
        const filteredQuestions = questionsData.filter((q) =>
          checkedTopics.includes(q.test_sinov)
        );
        let shuffledQuestions = [...filteredQuestions];
        shuffledQuestions.sort(() => 0.5 - Math.random());
        shuffledQuestions = shuffledQuestions.slice(0, questionCount);

        const questionsWithOptions = shuffledQuestions.map((q) => ({
          ...q,
          options: optionsData.filter((opt) => opt.question === q.id),
        }));

        setQuestions(questionsWithOptions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndOptions();
  }, [name, questionCount, t.loadingError]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const [isCalculatingResults, setIsCalculatingResults] = useState(false);

  const calculateResults = () => {
    setIsCalculatingResults(true);

    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = `${minutes}${t.timeFormat.split(" ")[0]} ${seconds}${t.timeFormat.split(" ")[1]}`;
    const correctAnswersCount = selectedAnswers.filter(
      (answer) => answer.is_correct
    ).length;
    const totalQuestions = questions.length;

    setTimeout(() => {
      setResults({
        correct_answers: correctAnswersCount,
        incorrect_answers: totalQuestions - correctAnswersCount,
        total_questions: totalQuestions,
        unanswered_questions: totalQuestions - selectedAnswers.length,
        percentage_correct: (
          (correctAnswersCount / totalQuestions) *
          100
        ).toFixed(2),
        time_taken: formattedTime,
      });
      setIsCalculatingResults(false);
    }, 1500); // 1.5 soniya loading ko'rsatish
  };

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  if (loading) return <Loading />;
  if (error) return <p className={getLanguageClass()}>{t.error}{error}</p>;
  if (results)
    return (
      <Results
        results={results}
        questions={questions}
        selectedAnswers={selectedAnswers}
        translations={t.results}
        languageClass={getLanguageClass()}
      />
    );

  return (
    <section id="test-detail" className={getLanguageClass()}>
      <TestHeader
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        calculateResults={calculateResults}
        res={isCalculatingResults}
        onFinishTest={calculateResults}
        languageClass={getLanguageClass()}
      />
      <Question
        currentIndex={currentQuestionIndex}
        question={questions[currentQuestionIndex]}
        selectedAnswers={selectedAnswers}
        setSelectedAnswers={setSelectedAnswers}
        test={questions}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        languageClass={getLanguageClass()}
      />
      <div id="flex" className={getLanguageClass()}>
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion} className={getLanguageClass()}>
            <span className={getLanguageClass()}>{t.previous}</span>
          </button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNextQuestion} className={getLanguageClass()}>
            <span className={getLanguageClass()}>{t.next}</span>
          </button>
        ) : (
          <button onClick={calculateResults} className={getLanguageClass()}>
            <span className={getLanguageClass()}>{t.viewResults}</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default ScienceTest;