import React, { useState, useEffect, useContext } from "react";
import "./about-test-school.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../App";
import Loading from "../../components/loading/loading";
import Success from "../../components/success-message/success";
import { AccessContext } from "../../AccessContext";

const AboutTestSchool = () => {
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
  const [success, setSuccess] = useState(false);
  const [isFreeTestAvailable, setIsFreeTestAvailable] = useState(false);

  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      title: "Siz hozir testni boshlayapsiz. Tayyormisiz? Urinishlar tugashidan oldin harakat qiling!",
      noSchoolFound: "Bunday maktab topilmadi:",
      schoolTest: "uchun test sinovi",
      schoolDescription: "imtihon topshirish uchun ajratilgan kvotalar, talablar va qabul jarayoni haqida batafsil ma'lumotni shu yerda topishingiz mumkin. Maktablar ro'yxati va ularga ajratilgan o'rinlar bilan tanishing hamda sinov testlarini yechib, o'z bilimingizni tekshirib ko'ring!",
      tableHeaders: ["Test nomi", "Ball", "Vaqt", "Boshlash"],
      noTests: "Bu maktab uchun test topilmadi.",
      startTestBtn: "Testni boshlash",
      coursePrice: "Kurs narxi:",
      sum: "so'm",
      insufficientBalance: "Sizda yetarli mablag' mavjud emas!",
      cancelBtn: "Bekor qilish",
      topUpBalance: "Balansni oshirish",
      confirmation: "Haqiqatdan ham kursni boshlamoqchimisiz?",
      loginPrompt: "Iltimos, tizimga kiring.",
      loginBtn: "Kirish",
      networkError: "Tarmoq xatosi yuz berdi",
      testCount: (count) => `${count} ta`,
      loginTitle: "Kirish",
    },
    kaa: {
      title: "Сиз ҳәзир тестти баслайяпсиз. Тайармысыз? Урынъыслар түгемей турып әрекет етиң!",
      noSchoolFound: "Бундай мектеп табылмады:",
      schoolTest: "ушын тест сыныўы",
      schoolDescription: "имтихан тапсырыў ушын ажратылған квоталар, талаплар ҳәм қабыл жарайоны ҳаққында толығырақ ма'лўматты мана бу ерден таба аласыз. Мектеплер тизимиси ҳәм оларға ажратылған орынлар менен танысың ҳәм сынаў тестлерин ешиў арқалы өз билимиңизни тексериўге мүмкүндүк алыңыз!",
      tableHeaders: ["Тест аты", "Баһа", "Уақыты", "Баслаў"],
      noTests: "Бул мектеп ушын тест табылмады.",
      startTestBtn: "Тестти баслаў",
      coursePrice: "Курс баһасы:",
      sum: "сўм",
      insufficientBalance: "Сизде жетерлик қаражат жоќ!",
      cancelBtn: "Бекар қылыў",
      topUpBalance: "Балансды толтырыў",
      confirmation: "Шыннан да курсты басламақшымысыз?",
      loginPrompt: "Илтимас, тизимге кириң.",
      loginBtn: "Кириў",
      networkError: "Тармақ қатесі болды",
      testCount: (count) => `${count} та`,
      loginTitle: "Кириў",

    },
    ru: {
      title: "Вы собираетесь начать тест. Готовы? Постарайтесь до окончания попыток!",
      noSchoolFound: "Школа не найдена:",
      schoolTest: (schoolName) => `Тестовое испытание для ${schoolName}`,
      schoolDescription: "Здесь вы можете найти подробную информацию о квотах, требованиях и процессе приема для сдачи экзамена. Ознакомьтесь со списком школ и выделенными местами, а также пройдите пробные тесты, чтобы проверить свои знания!",
      tableHeaders: ["Название теста", "Балл", "Время", "Начать"],
      noTests: "Для этой школы тесты не найдены.",
      startTestBtn: "Начать тест",
      coursePrice: "Стоимость курса:",
      sum: "сум",
      insufficientBalance: "У вас недостаточно средств!",
      cancelBtn: "Отмена",
      topUpBalance: "Пополнить баланс",
      confirmation: "Вы действительно хотите начать курс?",
      loginPrompt: "Пожалуйста, войдите в систему.",
      loginBtn: "Войти",
      networkError: "Произошла сетевая ошибка",
      testCount: (count) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) {
          return `${count} шт`;
        } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
          return `${count} шт`;
        } else {
          return `${count} шт`;
        }
      },
      loginTitle: "Вход",

    },
    en: {
      title: "You are about to start the test. Ready? Try your best before attempts run out!",
      noSchoolFound: "School not found:",
      schoolTest: (schoolName) => `Tests for ${schoolName}`,
      schoolDescription: "Here you can find detailed information about quotas, requirements and admission process for taking the exam. Check out the list of schools and allocated places, and take practice tests to check your knowledge!",
      tableHeaders: ["Test name", "Score", "Time", "Start"],
      noTests: "No tests found for this school.",
      startTestBtn: "Start test",
      coursePrice: "Course price:",
      sum: "UZS",
      insufficientBalance: "You don't have enough balance!",
      cancelBtn: "Cancel",
      topUpBalance: "Top up balance",
      confirmation: "Are you sure you want to start the course?",
      loginPrompt: "Please log in to the system.",
      loginBtn: "Login",
      networkError: "Network error occurred",
      testCount: (count) => `${count} pcs`,
      loginTitle: "Login",

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
        const [categoriesResponse, testsResponse] = await Promise.all([
          fetch(`${api}/category-test-count/`),
          fetch(`${api}/tests_title/`),
        ]);

        if (!categoriesResponse.ok || !testsResponse.ok) {
          throw new Error("Network error");
        }

        const categoriesData = await categoriesResponse.json();
        const testsData = await testsResponse.json();

        const testsArray = testsData.tests || [];



        const enrichedCategories = categoriesData.slice(0, 4).map(category => {
          const categoryTests = testsArray.filter(
            test => Number(test.category) === Number(category.id)
          );

          return {
            ...category,
            tests: categoryTests,
            testsCount: categoryTests.length
          };
        });

        setSchools(enrichedCategories);
        setTests(testsArray);
      } catch (error) {
        setError(error.message);
        setSchools([]);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };

  const reverseFormatLinkAndCapitalize = (text) => {
    return text
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const matchedSchool = schools.find(
    (school) => formatLink(school.category_title) === name
  );

  const relatedTests = tests.filter(
    (test) => test.category === matchedSchool?.id
  );

  const handleStartButtonClick = async (testId, testPrice) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!access || !token) {
        setSelectedTestId(testId);
        setSelectedTestPrice(testPrice);
        setMod(true);
        return;
      }

      // Test bepul ekanligini tekshiramiz
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

      // Optimistik yangilash - so'rov yuborilishidan oldin balansni kamaytiramiz
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
        // Agar xato bo'lsa, balansni eski holatiga qaytaramiz
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

      // Muvaffaqiyatli bo'lsa testni boshlaymiz
      localStorage.setItem("startTest", selectedTestId);
      setStartTest(selectedTestId);
      navigate(`/school/${name}/test/${selectedTestId}`);

    } catch (error) {
      // Xato yuz berganda balansni tiklaymiz
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

  // Test jadvalidagi tugmalar uchun
  const renderStartButton = (test) => (
    <button
      type="button"
      onClick={() => handleStartButtonClick(test.id, test.price)}
      className={getLanguageClass()}
      disabled={loading}
    >
      {loading && selectedTestId === test.id ? (
        <span className="loader-small"></span>
      ) : (
        t.startTestBtn
      )}
    </button>
  );

  if (loading) return <Loading />;

  return (
    <div className={`about-test-school ${getLanguageClass()}`}>
      {success && <Success text={errors} />}
      <h1 className={getLanguageClass()}>{t.title}</h1>
      <div className={`schools-cards ${getLanguageClass()}`}>
        {schools.map((school, index) => {
          // Statik test sonlari massivi
          const staticTestCounts = [14, 185, 9, 9];
          // Agar index 0-3 oralig'ida bo'lsa, statik qiymatni olsin, aks holda API dan kelgan qiymat
          const testCount = index < 4 ? staticTestCounts[index] : school.test_count;

          return (
            <Link to={`/schools/${formatLink(school.category_title)}`} key={index} className={getLanguageClass()}>
              <div
                className={`school-card ${name === formatLink(school.category_title) ? "active" : ""} ${getLanguageClass()}`}
              >
                <img src={`${school?.category_img}`} alt={school.category_title} className={getLanguageClass()} />
                <p className={getLanguageClass()}>{school.category_title}</p>
                <span className={getLanguageClass()}>{t.testCount(testCount)}</span>
              </div>
            </Link>
          );
        })}
      </div>
      {matchedSchool ? (
        <>
          <h2 className={getLanguageClass()}>
            {typeof t.schoolTest === 'function'
              ? t.schoolTest(reverseFormatLinkAndCapitalize(name))
              : `${reverseFormatLinkAndCapitalize(name)} ${t.schoolTest}`
            }
          </h2>
          <p className={getLanguageClass()}>
            {reverseFormatLinkAndCapitalize(name)} {t.schoolDescription}
          </p>
          <div className={`table-cont ${getLanguageClass()}`}>
            <table className={getLanguageClass()}>
              <thead>
                <tr className={getLanguageClass()}>
                  {t.tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      className={`${getLanguageClass()} ${index === 2 ? 'mob-t' : ''}`} // 3-ustun (index 2) uchun tim klassini qo'shamiz
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={getLanguageClass()}>
                {relatedTests.length > 0 ? (
                  relatedTests.map((test, testIndex) => (
                    <tr key={testIndex} className={getLanguageClass()}>
                      <td className={getLanguageClass()}>{test.title}</td>
                      <td className={getLanguageClass()}>{test.score}</td>
                      <td className={`mob-t ${getLanguageClass()}`}>{test.time}</td>
                      <td>{renderStartButton(test)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className={getLanguageClass()}>
                    <td colSpan="4" className={getLanguageClass()}>{t.noTests}</td>
                  </tr>
                )}
              </tbody>
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
                      <button onClick={() => setMod(false)}>{t.cancelBtn}</button>
                      <button onClick={() => navigate("/login")}>{t.loginBtn}</button>
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
                      <button onClick={() => setMod(false)}>{t.cancelBtn}</button>

                      {/* Bepul test bo‘lsa */}
                      {isFreeTestAvailable ? (
                        <button onClick={handleConfirmStartTest}>
                          {language === "uz" ? "Bepul" : "Free"}
                        </button>
                      ) : (
                        <>
                          {profileData.balance >= selectedTestPrice ? (
                            <button onClick={handleConfirmStartTest}>
                              {t.startTestBtn}
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


            </table>
          </div>
        </>
      ) : (
        <h2 className={getLanguageClass()}>{t.noSchoolFound} {reverseFormatLinkAndCapitalize(name)}</h2>
      )}
    </div>
  );
};

export default AboutTestSchool;