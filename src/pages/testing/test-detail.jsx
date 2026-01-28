import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../App";
import "./test-detail.scss";
import { AccessContext } from "../../AccessContext";
import TestHeader from "./test-header";
import Question from "./question";
import Results from "./results";
import Loading from "../../components/loading/loading";
import { UseTestMode } from "../../components/linksBlock/linksBlock";
import { useLocation } from "react-router-dom";
const Testing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const { profileData, access } = useContext(AccessContext);

  const location = useLocation();
  const { testData } = location.state || {};
  console.log(testData);
  
  // Test holati uchun state'lar (localStorage ishlatilmaydi)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timePerQuestion, setTimePerQuestion] = useState({});
  const [startTime, setStartTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [resLoading, setResLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Til sozlamalari
  const translations = {
    uz: {
      loading: "Yuklanmoqda...",
      error: "Xatolik:",
      fetchError: "Test tafsilotlarini olishda xato yuz berdi.",
      saveError: "Natijalarni saqlashda xato yuz berdi.",
      finishError: "Testing natijalarini saqlashda xato yuz berdi.",
      previous: "Ortga",
      next: "Keyingi Savol",
      analyzing: "Taxlil qilinmoqda...",
      viewResults: "Natijani Ko'rish",
      minutes: "daqiqa",
      seconds: "soniya",
      timeFormat: (min, sec) => `${min} daqiqa ${sec} soniya`,
      accessDenied: "Kirish rad etildi",
      exitWarning: "Test davom etayotgan paytda sahifani tark etish natijalaringizni yo'qotishiga olib kelishi mumkin. Rostan ham sahifani tark etmoqchimisiz?",
      exitConfirm: "Ha, chiqish",
      exitCancel: "Yo'q, qolish"
    },
    kaa: {
      loading: "Қирьан эйней...",
      error: "Хата: ",
      fetchError: "Тест хаалаатка асаан ейлие хатъа хасай.",
      saveError: "Натиджа хазана асаан ейлие хатъа хасай.",
      finishError: "Тест натиджа хазана асаан ейлие хатъа хасай.",
      previous: "Нааз",
      next: "Балан Саваал",
      analyzing: "Тахлийилья жаахей...",
      viewResults: "Натиджа Нааз",
      minutes: "дақииқа",
      seconds: "соанийя",
      timeFormat: (min, sec) => `${min} дақииқа ${sec} соанийя`,
      accessDenied: "Хайваан наазхай"
    },
    ru: {
      loading: "Загрузка...",
      error: "Ошибка:",
      fetchError: "Произошла ошибка при получении данных теста.",
      saveError: "Ошибка при сохранении результатов.",
      finishError: "Ошибка при сохранении результатов тестирования.",
      previous: "Назад",
      next: "Следующий вопрос",
      analyzing: "Анализируется...",
      viewResults: "Посмотреть результаты",
      minutes: "минут",
      seconds: "секунд",
      timeFormat: (min, sec) => `${min} минут ${sec} секунд`,
      accessDenied: "Доступ запрещен"
    },
    en: {
      loading: "Loading...",
      error: "Error:",
      fetchError: "Error fetching test details.",
      saveError: "Error saving results.",
      finishError: "Error saving test results.",
      previous: "Previous",
      next: "Next Question",
      analyzing: "Analyzing...",
      viewResults: "View Results",
      minutes: "minutes",
      seconds: "seconds",
      timeFormat: (min, sec) => `${min} minutes ${sec} seconds`,
      accessDenied: "Access denied"
    }
  };
  const language = localStorage.getItem("language") || "uz";
  const t = translations[language] || translations["uz"];

  // Test boshlanganda flag'ni o'rnatish va tekshirish
  useEffect(() => {
    const activeTestId = localStorage.getItem("startTest");
    console.log(activeTestId);

    // Agar boshqa test ishlayotgan bo'lsa, bosh sahifaga yo'naltiramiz
    if (activeTestId && activeTestId !== id) {
      navigate("/schools/prezident-maktablari");
      return;
    }

    // Yangi testni boshlaymiz
    localStorage.setItem("startTest", id);

    return () => {
      // Agar test tugallanmagan bo'lsa, flag'ni o'chiramiz
      if (!results) {
        localStorage.removeItem("startTest");
      }
    };
  }, [id, results, navigate]);

  // Test ma'lumotlarini yuklash
  const token = localStorage.getItem('authToken')
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`$/category_exams/test/${testData.id}/start/`,{ method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },});

        if (!response.ok) throw new Error(t.fetchError);
        const testsData = await response.json();

        if (testsData) {
          setTest(testsData);
          const flattenedQuestions = [];
          for (const science in testsData.questions_grouped_by_science) {
            flattenedQuestions.push(...testsData.questions_grouped_by_science[science]);
          }
          setAllQuestions(flattenedQuestions);

          // Vaqtni hisoblash
          const totalSeconds = testsData.time
            .split(":")
            .reduce((acc, time) => acc * 60 + Number(time), 0);

          setTimeLeft(totalSeconds);
          setStartTime(new Date());
          setQuestionStartTime(new Date());
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id, t.fetchError]);

  // Test tugaganda natijalarni hisoblash
  const calculateResults = async () => {
    if (!test) return;
    setResLoading(true);

    const correctAnswersCount = selectedAnswers.filter(
      (answer) => answer.is_staff
    ).length;
    const totalQuestions = allQuestions.length;

    const currentTime = new Date();
    const totalTimeTaken = Math.floor((currentTime - startTime) / 1000);
    const totalMinutes = String(Math.floor(totalTimeTaken / 60)).padStart(2, "0");
    const totalSeconds = String(totalTimeTaken % 60).padStart(2, "0");

    const formattedTime = t.timeFormat(Math.floor(totalTimeTaken / 60), totalTimeTaken % 60);

    const answersData = selectedAnswers.map((answer) => ({
      question_id: answer.questionId,
      selected_option_id: answer.id,
    }));

    const resultData = {
      user: profileData.id,
      test_title: test.title,
      correct_answers: correctAnswersCount,
      incorrect_answers: totalQuestions - correctAnswersCount,
      unanswered_questions: totalQuestions - selectedAnswers.length,
      total_questions: totalQuestions,
      percentage_correct: ((correctAnswersCount / totalQuestions) * 100).toFixed(2),
      total_time_taken: `00:${totalMinutes}:${totalSeconds}`,
      time_per_question: timePerQuestion,
      time_taken: formattedTime,
    };

    try {
      // Statistikani yuborish
      const response = await fetch(`${api}/statistics/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) throw new Error(t.saveError);

      const finishResponse = await fetch(`${api}/finish/${test.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: answersData }),
      });

      if (!finishResponse.ok) throw new Error(t.finishError);

      const finishData = await finishResponse.json();

      setResults({ ...resultData, total_score: finishData.total_score, ai: finishData });
      localStorage.removeItem("startTest");

    } catch (error) {
      console.error(error.message);
    } finally {
      setResLoading(false);
    }
  };

  // Vaqt tugaganda natijalarni hisoblash
  useEffect(() => {
    if (timeLeft === 0) {
      calculateResults();
    }
  }, [timeLeft]);

  // Vaqtni hisoblash
  useEffect(() => {
    if (!timeLeft || results) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, results]);

  // Browser orqali chiqishni bloklash
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!results) {
        e.preventDefault();
        e.returnValue = t.exitWarning;
        return t.exitWarning;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [results, t.exitWarning]);

  // Savollarni boshqarish funksiyalari
  const handleNextQuestion = () => {
    const currentTime = new Date();
    const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);
    const currentQuestion = allQuestions[currentQuestionIndex];

    setTimePerQuestion((prev) => ({
      ...prev,
      [currentQuestion.text]: timeSpent
    }));

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(new Date());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Chiqish modali
  const handleExitConfirm = () => {
    localStorage.removeItem("startTest");
    navigate("/schools/prezident-maktablari");
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  // Til klassini aniqlash
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  if (loading) {
    return (
      <p className={getLanguageClass()}>
        <Loading />
      </p>
    );
  }

  if (error) {
    return <p className={getLanguageClass()}>{t.error} {error}</p>;
  }

  if (results) {
    localStorage.removeItem("startTest")
    return (
      <Results
        loading={resLoading}
        results={results}
        test={test}
        selectedAnswers={selectedAnswers}
      />
    );
  }

  return (
    <section id="test-detail" className={getLanguageClass()}>
      <UseTestMode testMode={true} />

      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t.exitWarning.split("?")[0]}?</h3>
            <p>{t.exitWarning.split("?")[1]}</p>
            <div className="modal-actions">
              <button onClick={handleExitCancel} className="confirm-btn">
                {t.exitCancel}
              </button>
              <button onClick={handleExitConfirm} className="cancel-btn">
                {t.exitConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <TestHeader
        currentIndex={currentQuestionIndex}
        totalQuestions={allQuestions.length}
        timeLeft={timeLeft || 0}
        calculateResults={calculateResults}
        res={resLoading}
      />

      <Question
        currentIndex={currentQuestionIndex}
        question={allQuestions[currentQuestionIndex]}
        selectedAnswers={selectedAnswers}
        setSelectedAnswers={setSelectedAnswers}
        currentQuestionIndex={currentQuestionIndex}
        test={test}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />

      {allQuestions.length > 0 && (
        <div id="flex" className={getLanguageClass()}>
          {currentQuestionIndex > 0 && (
            <button onClick={handlePreviousQuestion}>
              {t.previous}
            </button>
          )}
          {currentQuestionIndex < allQuestions.length - 1 ? (
            <button className="next" onClick={handleNextQuestion}>
              {t.next}
            </button>
          ) : (
            <button onClick={calculateResults} disabled={resLoading}>
              {resLoading ? t.analyzing : t.viewResults}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Testing;