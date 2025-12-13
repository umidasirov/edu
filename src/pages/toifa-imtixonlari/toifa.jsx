import React, { useContext, useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { AccessContext } from '../../AccessContext';
import { api } from '../../App';
import Loading from '../../components/loading/loading';
import Success from '../../components/success-message/success';
import "./toifa.scss";

const Toifa = () => {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [tests, setTests] = useState([]);
  const [errors, setError] = useState(null);
  const { name } = useParams();
  const [mod, setMod] = useState(false);
  const navigate = useNavigate();
  const { access, startTest, setStartTest, profileData, setProfileData } =
    useContext(AccessContext);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedTestPrice, setSelectedTestPrice] = useState(null);
  const [selectedFanName, setSelectedFanName] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isFreeTestAvailable, setIsFreeTestAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      title: "O'zingizni toifa imtixoni uchun shu yerda sinang!",
      tableHeaders: ["№", "Fan nomi", "Vaqt", "Boshlash"],
      startTest: "Testni boshlash",
      noSubjects: "Toifa fanlari topilmadi.",
      coursePrice: "Kurs narxi:",
      currency: "so'm",
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

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sciencesResponse, testsResponse] = await Promise.all([
          fetch(`${api}/category/`),
          fetch(`${api}/tests_title/`),
        ]);

        if (!sciencesResponse.ok || !testsResponse.ok) {
          throw new Error("Network error");
        }

        const sciencesData = await sciencesResponse.json();
        const testsData = await testsResponse.json();

        setSchools(sciencesData);
        setTests(testsData.tests);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };

  const matchedSchool = schools.find(
    (school) => formatLink(school.title) === name
  );

  const filteredTests = tests.filter((test) => {
    const matchesCategory = test.category === matchedSchool?.id;
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && (searchTerm === "" || matchesSearch);
  });

  const handleStartButtonClick = async (testId, testPrice, fanName) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!access || !token) {
        setSelectedTestId(testId);
        setSelectedTestPrice(testPrice);
        setSelectedFanName(fanName);
        setMod(true);
        return;
      }

      // Check if test is available for free
      const response = await fetch(`${api}/check_free_test/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ test_id: testId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFreeTestAvailable(data.is_free);
      } else {
        setIsFreeTestAvailable(false);
      }

      setSelectedTestId(testId);
      setSelectedTestPrice(testPrice);
      setSelectedFanName(fanName);
      setMod(true);
    } catch (error) {
      console.error("Error checking free test:", error);
      setIsFreeTestAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmStartTest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // Optimistic update - deduct balance immediately if not free
      if (!isFreeTestAvailable) {
        const oldBalance = profileData.balance;
        setProfileData(prev => ({
          ...prev,
          balance: prev.balance - selectedTestPrice
        }));
      }

      const response = await fetch(`${api}/start-test/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          test_id: selectedTestId,
          use_free: isFreeTestAvailable,
        }),
      });

      if (!response.ok) {
        // Revert balance deduction if error occurred and not free
        if (!isFreeTestAvailable) {
          setProfileData(prev => ({
            ...prev,
            balance: prev.balance + selectedTestPrice
          }));
        }

        const errorData = await response.json();
        setError(errorData.detail || t.networkError);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        return;
      }

      // Success - start the test
      localStorage.setItem("startTest", selectedTestId);
      setStartTest(selectedTestId);
      navigate(`/toifa/${formatLink(selectedFanName)}/fan/${selectedTestId}`);

    } catch (error) {
      // Revert balance deduction if error occurred and not free
      if (!isFreeTestAvailable) {
        setProfileData(prev => ({
          ...prev,
          balance: prev.balance + selectedTestPrice
        }));
      }
      setError(t.networkError);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setMod(false);
      setIsFreeTestAvailable(false);
    }
  };

  const renderStartButton = (test) => {
    const isCurrentTest = localStorage.getItem("startTest") === test.id?.toString();

    return (
      <button
        type="button"
        onClick={() => handleStartButtonClick(test.id, test.price, test.title)}
        className={`${getLanguageClass()} ${isCurrentTest ? 'continue-btn' : ''}`}
        disabled={loading}
      >
        {loading && selectedTestId === test.id ? (
          <span className="loader-small"></span>
        ) : isCurrentTest ? (
          t.continueTest
        ) : (
          t.startTest
        )}
      </button>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`toifa ${getLanguageClass()}`}>
      {success && <Success text={errors} />}
      <h1 className={getLanguageClass()}>{t.title}</h1>

      {/* Search Input */}
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
              {t.tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`${getLanguageClass()} ${index === 2 ? 'tim' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={getLanguageClass()}>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, testIndex) => (
                <tr key={test.id} className={getLanguageClass()}>
                  <td className={getLanguageClass()}>{testIndex + 1}</td>
                  <td className={getLanguageClass()}>{test.title}</td>
                  <td className={`${getLanguageClass()} tim`}>{test.time}</td>
                  <td>{renderStartButton(test)}</td>
                </tr>
              ))
            ) : (
              <tr className={getLanguageClass()}>
                <td colSpan="4" className={getLanguageClass()}>
                  {searchTerm ?
                    `${t.noSubjects} "${searchTerm}"` :
                    t.noSubjects
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for test confirmation */}
      {mod && <div className={`m-shape ${getLanguageClass()}`}></div>}
      <div className={`opened-modal ${mod ? "active" : ""} ${getLanguageClass()}`}>
        {/* Narx ko‘rsatish */}
        {!isFreeTestAvailable && (
          <p className={getLanguageClass()}>
            {t.coursePrice} <span>{new Intl.NumberFormat("de-DE").format(selectedTestPrice)} {t.sum}</span>
          </p>
        )}

        {/* Agar foydalanuvchi ro'yxatdan o'tmagan bo‘lsa */}
        {!access ? (
          <>
            <p className={getLanguageClass()}>Testni ishlash uchun tizimga kiring!</p>
            <div className="modal-buttons">
              <button onClick={() => setMod(false)}>{t.cancel}</button>
              <button onClick={() => navigate("/login")}>{t.login}</button>
            </div>
          </>
        ) : (
          <>
            {/* Bepul imkoniyat mavjud bo‘lsa */}
            {isFreeTestAvailable && (
              <p className={getLanguageClass()} style={{ color: 'green' }}>
                {language === 'uz'
                  ? "Siz bu testni 1 marta bepul yechish imkoniyatiga egasiz!"
                  : "You can take this test once for free!"}
              </p>
            )}

            {/* Balans yetarli bo'lmasa */}
            {!isFreeTestAvailable && profileData.balance < selectedTestPrice && (
              <p style={{ color: "red" }} className={getLanguageClass()}>{t.insufficientBalance}</p>
            )}

            {/* Faqat balans yetarli bo‘lsa confirmation so‘rovi */}
            {!isFreeTestAvailable && profileData.balance >= selectedTestPrice && (
              <p className={getLanguageClass()}>{t.confirmation}</p>
            )}

            <div className="modal-buttons">
              <button onClick={() => setMod(false)}>{t.cancel}</button>

              {/* Bepul test bo‘lsa */}
              {isFreeTestAvailable ? (
                <button onClick={handleConfirmStartTest}>
                  {language === "uz" ? "Bepul" : "Free"}
                </button>
              ) : (
                <>
                  {profileData.balance >= selectedTestPrice ? (
                    <button onClick={handleConfirmStartTest}>
                      {t.startTest}
                    </button>
                  ) : (
                    <button onClick={() => navigate("/top-up-balance")}>
                      {t.topUpBalance}
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Toifa;