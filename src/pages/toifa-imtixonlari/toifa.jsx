import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import { api } from "../../App";
import Loading from "../../components/loading/loading";
import Success from "../../components/success-message/success";
import "./toifa.scss";

const Toifa = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mod, setMod] = useState(false);
  const [isFreeTestAvailable, setIsFreeTestAvailable] = useState(false);

  const navigate = useNavigate();
  const { name } = useParams();
  const { access, profileData, setProfileData, setStartTest } = useContext(AccessContext);

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
  const getLanguageClass = () => (language === "ru" ? "ru" : "");

  // 🔹 TESTLARNI OLISH
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api}/category_exams/tests/`);
        if (!res.ok) throw new Error(t.networkError);

        const data = await res.json();
        setTests(data);
      } catch (err) {
        setError(err.message);
        setSuccess(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 START BUTTON
  const onStartClick = async (test) => {
    if (!access) {
      navigate("/login");
      return;
    }

    setSelectedTest(test);
    setMod(true);

    // 🔹 CHECK FREE TEST
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(`${api}/check_free_test/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ test_id: test.guid }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFreeTestAvailable(data.is_free);
      } else {
        setIsFreeTestAvailable(false);
      }
    } catch {
      setIsFreeTestAvailable(false);
    }
  };

  // 🔹 CONFIRM START
  const confirmStart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return navigate("/login");

      // BALANCE CHECK
      if (!isFreeTestAvailable && +profileData.balance < +selectedTest.price) {
        setError(t.insufficientBalance);
        setSuccess(true);
        return;
      }

      // OPTIMISTIC UPDATE
      if (!isFreeTestAvailable) {
        setProfileData(prev => ({ ...prev, balance: prev.balance - selectedTest.price }));
      }

      const res = await fetch(`${api}/category_exams/test/${selectedTest.guid}/start/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(t.networkError);
      const data = await res.json();

      // TEST BOSHLASH
      localStorage.setItem("startTest", selectedTest.guid);
      setStartTest(selectedTest.guid);
      console.log(selectedTest);
      console.log(data);
      
      
      navigate(`/toifa/${name}/fan/${selectedTest.guid}`, { state: { testData: data } });
    } catch (err) {
      // REVERT BALANCE
      if (!isFreeTestAvailable) {
        setProfileData(prev => ({ ...prev, balance: prev.balance + selectedTest.price }));
      }
      setError(err.message);
      setSuccess(true);
    } finally {
      setMod(false);
      setIsFreeTestAvailable(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={`toifa ${getLanguageClass()}`}>
      {success && <Success text={error} />}
      <h1 className={getLanguageClass()}>{t.title}</h1>

      <div className={`search-container ${getLanguageClass()}`}>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${getLanguageClass()}`}
        />
      </div>

      <div className={`table-cont ${getLanguageClass()}`}>
        <table className={`${getLanguageClass()} t-table`}>
          <thead className={getLanguageClass()}>
            <tr className={getLanguageClass()}>
              {t.tableHeaders.map((header, i) => (
                <th key={i} className={`${getLanguageClass()} ${i === 2 ? "tim" : ""}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={getLanguageClass()}>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, i) => (
                <tr key={test.guid} className={getLanguageClass()}>
                  <td className={getLanguageClass()}>{i + 1}</td>
                  <td className={getLanguageClass()}>{test.name}</td>
                  <td className={`${getLanguageClass()} tim`}>{test.duration} {t.timeUnit}</td>
                  <td>
                    <button
                      onClick={() => onStartClick(test)}
                      className={getLanguageClass()}
                    >
                      {localStorage.getItem("startTest") === test.guid?.toString()
                        ? t.continueTest
                        : t.startTest}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className={getLanguageClass()}>
                <td colSpan="4" className={getLanguageClass()}>
                  {t.noSubjects}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {mod && <div className={`m-shape ${getLanguageClass()}`}></div>}
      <div className={`opened-modal ${mod ? "active" : ""} ${getLanguageClass()}`}>
        {selectedTest && (
          <>
            <p className={getLanguageClass()}>
              {t.coursePrice}{" "}
              <span>{new Intl.NumberFormat("de-DE").format(selectedTest.price)} {t.currency}</span>
            </p>

            {isFreeTestAvailable && (
              <p style={{ color: "green" }}>
                {language === "uz" ? "Siz bu testni 1 marta bepul yechish imkoniyatiga egasiz!" : "You can take this test once for free!"}
              </p>
            )}

            <p className={getLanguageClass()}>{t.confirmation}</p>

            <div className="modal-buttons">
              <button onClick={() => setMod(false)} className={getLanguageClass()}>
                {t.cancel}
              </button>
              <button onClick={confirmStart} className={getLanguageClass()}>
                {isFreeTestAvailable ? "Bepul" : t.startTest}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Toifa;
