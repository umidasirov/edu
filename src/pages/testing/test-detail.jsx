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

const Testing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const { profileData, access } = useContext(AccessContext);

  // Test holati state'lari
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
      title: "O'zingizni toifa imtixoni uchun shu yerda sinang!",
      tableHeaders: ["№", "Fan nomi", "Vaqt", "Boshlash"],
      startTest: "Testni boshlash",
      noSubjects: "Toifa fanlari topilmadi.",
      coursePrice: "Kurs narxi:",
      currency: "so'm",
      timeUnit: "minut",
      insufficientBalance: "Sizda yetarli mablag' mavjud emas!",
      cancel: "Bekor qilish",
      topUpBalance: "Balansni oshirish",
      confirmation: "Haqiqatdan ham kursni boshlamoqchimisiz?",
      loginPrompt: "Iltimos, tizimga kiring.",
      networkError: "Tarmoq xatosi yuz berdi",
      startTestConfirmation: "Testni boshlash",
      login: "Kirish",
      searchPlaceholder: "Fan nomi bo'yicha qidirish...", // New translation
      continueTest: "Davom etish",
      continueConfirmation: "Test davom ettirilsinmi?",
      newTest: "Yangi test boshlash"
    },
    kaa: {
      title: "Өзүңизни тоифа имтиҳаны үщин шу жерде сынаң!",
      tableHeaders: ["№", "Фан атың", "Уақыты", "Баслаў"],
      startTest: "Тести баслаў",
      noSubjects: "Тоифа фанлары табылмады.",
      coursePrice: "Курс баһасы:",
      currency: "сўм",
      timeUnit: "минут",
      insufficientBalance: "Сизде жетерлик қаражат жоқ!",
      cancel: "Бекар қылыў",
      topUpBalance: "Балансты арттырыў",
      confirmation: "Шынында курсны баслаўды қалап тұрсызба?",
      loginPrompt: "Илтимас, тизимге кириң.",
      networkError: "Тармақ қаталығы юз берди",
      startTestConfirmation: "Тести баслаў",
      login: "Кириў",
      searchPlaceholder: "Фан аты бойынша іздеу..." // New translation
    },
    ru: {
      title: "Проверьте себя на квалификационный экзамен здесь!",
      tableHeaders: ["№", "Название предмета", "Время", "Начать"],
      startTest: "Начать тест",
      noSubjects: "Предметы не найдены.",
      coursePrice: "Цена курса:",
      currency: "сум",
      timeUnit: "минут",
      insufficientBalance: "У вас недостаточно средств!",
      cancel: "Отмена",
      topUpBalance: "Пополнить баланс",
      confirmation: "Вы действительно хотите начать курс?",
      loginPrompt: "Пожалуйста, войдите в систему.",
      networkError: "Произошла сетевая ошибка",
      startTestConfirmation: "Начать тест",
      login: "Войти",
      searchPlaceholder: "Поиск по названию предмета..." // New translation
    },
    en: {
      title: "Test yourself for the qualification exam here!",
      tableHeaders: ["№", "Subject name", "Time", "Start"],
      startTest: "Start test",
      noSubjects: "No subjects found.",
      coursePrice: "Course price:",
      currency: "UZS",
      timeUnit: "minutes",
      insufficientBalance: "You don't have enough balance!",
      cancel: "Cancel",
      topUpBalance: "Top up balance",
      confirmation: "Do you really want to start the course?",
      loginPrompt: "Please log in.",
      networkError: "Network error occurred",
      startTestConfirmation: "Start test",
      login: "Login",
      searchPlaceholder: "Search by subject name..." // New translation
    }
  };
  const language = localStorage.getItem("language") || "uz";
  const t = translations[language] || translations["uz"];
  const getLanguageClass = () =>
    language === "ru" || language === "kaa" ? "ru" : "";

  // 🔹 Test boshlanganda flag
  useEffect(() => {
    const activeTestId = localStorage.getItem("startTest");
    if (activeTestId && activeTestId !== id) {
      navigate("/schools/prezident-maktablari");
      return;
    }
    localStorage.setItem("startTest", id);

    return () => {
      if (!results) localStorage.removeItem("startTest");
    };
  }, [id, results, navigate]);

  // 🔹 Test ma'lumotlarini yuklash
  useEffect(() => {
    const fetchTestDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error(t.accessDenied);

        const response = await fetch(`${api}/category_exams/test/${id}/start/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(t.fetchError);

        const data = await response.json();
        setTest(data);
        setAllQuestions(data.questions || []);

        const totalSeconds = data.time
          .split(":")
          .reduce((acc, t) => acc * 60 + Number(t), 0);
        setTimeLeft(totalSeconds);
        setStartTime(new Date());
        setQuestionStartTime(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id, t.fetchError]);

  // 🔹 Natijalarni hisoblash
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

    const formattedTime = t.timeFormat(
      Math.floor(totalTimeTaken / 60),
      totalTimeTaken % 60
    );

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
      percentage_correct: ((correctAnswersCount / totalQuestions) * 100).toFixed(
        2
      ),
      total_time_taken: `00:${totalMinutes}:${totalSeconds}`,
      time_per_question: timePerQuestion,
      time_taken: formattedTime,
    };

    try {
      await fetch(`${api}/statistics/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      const finishResponse = await fetch(`${api}/finish/${test.id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersData }),
      });

      if (!finishResponse.ok) throw new Error(t.finishError);

      const finishData = await finishResponse.json();
      setResults({ ...resultData, total_score: finishData.total_score, ai: finishData });
      localStorage.removeItem("startTest");
    } catch (err) {
      console.error(err.message);
    } finally {
      setResLoading(false);
    }
  };

  // 🔹 Timer
  useEffect(() => {
    if (timeLeft === 0) calculateResults();
  }, [timeLeft]);

  useEffect(() => {
    if (!timeLeft || results) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, results]);

  // 🔹 Browser chiqish blok
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

  // 🔹 Savollarni boshqarish
  const handleNextQuestion = () => {
    const currentTime = new Date();
    const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);
    const currentQuestion = allQuestions[currentQuestionIndex];

    setTimePerQuestion((prev) => ({
      ...prev,
      [currentQuestion.text]: timeSpent,
    }));

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(new Date());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleExitConfirm = () => {
    localStorage.removeItem("startTest");
    navigate("/schools/prezident-maktablari");
  };

  const handleExitCancel = () => setShowExitModal(false);

  if (loading) return <Loading />;
  if (error) return <p className={getLanguageClass()}>{t.error} {error}</p>;
  if (results)
    return (
      <Results
        loading={resLoading}
        results={results}
        test={test}
        selectedAnswers={selectedAnswers}
      />
    );

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
            <button onClick={handlePreviousQuestion}>{t.previous}</button>
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
