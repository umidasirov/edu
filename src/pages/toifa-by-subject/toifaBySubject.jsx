import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AccessContext } from '../../AccessContext';
import { api } from '../../App';
import Loading from '../../components/loading/loading';
import Success from '../../components/success-message/success';
import "./toifaBySubject.scss"

const ToifaBySubject = () => {
    const [loading, setLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const [error, setError] = useState(null);
    const { subject } = useParams();
    const navigate = useNavigate();
    const { access, startTest, setStartTest, profileData, setProfileData } = useContext(AccessContext);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [selectedTestPrice, setSelectedTestPrice] = useState(null);
    const [selectedFanName, setSelectedFanName] = useState(null);
    const [mod, setMod] = useState(false);
    const language = localStorage.getItem("language") || "uz";
    const [success, setSuccess] = useState(false);
    const [isFreeTestAvailable, setIsFreeTestAvailable] = useState(false);
    const guid = useParams().subject;
    
    const translations = {
        uz: {
            title: "o'zingizni toifa imtixoni uchun shu yerda sinang!",
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
            login: "Kirish"
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
            login: "Кириў"
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
            login: "Войти"
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
            login: "Login"
        }
    };

    const t = translations[language] || translations["uz"];

    const getLanguageClass = () => {
        return language === "ru" || language === "kaa" ? "ru" : "";
    };

    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/category_exams/testsubjects/${guid}/tests/`);
                if (!response.ok) throw new Error("Network error");

                const data = await response.json();
                
                setTests(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [subject]);

    const formatLink = (text) => {
        return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
    };

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
        console.log(selectedFanName);
        console.log(selectedTestId);
        
        
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

            const response = await fetch(`${api}/category_exams/test/${selectedTestId}/start/`, {
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
            console.log(selectedFanName);
            console.log(selectedTestId);
            
            
            // Muvaffaqiyatli bo'lsa testni boshlaymiz
            localStorage.setItem("startTest", selectedTestId);
            setStartTest(selectedTestId);
            navigate(`/toifa/${formatLink(selectedFanName)}/fan/${selectedTestId}`);

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

    const renderStartButton = (test) => (
        <button
            type="button"
            onClick={() => handleStartButtonClick(test.guid, test.price, test.testsubject.title)}
            className={getLanguageClass()}
            disabled={loading}
        >
            {loading && selectedTestId === test.guid ? (
                <span className="loader-small"></span>
            ) : (
                t.startTest
            )}
        </button>
    );

    if (loading) return <Loading />;
    console.log(tests);
    
    return (
        <div className={`toifa ${getLanguageClass()}`}>
            {success && <Success text={error} />}
            <h1 className={getLanguageClass()}>{subject[0].toUpperCase()+subject.slice(1)} fanidan {t.title}</h1>
            <div className={`table-cont ${getLanguageClass()}`}>
                <table className={getLanguageClass()}>
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
                        {tests.length > 0 ? (
                            tests.map((test, testIndex) => (
                                <tr key={test.guid} className={getLanguageClass()}>
                                    <td className={getLanguageClass()}>{testIndex + 1}</td>
                                    <td className={getLanguageClass()}>{test.name}</td>
                                    <td className={`${getLanguageClass()} tim`}>{test.duration}</td>
                                    <td>{renderStartButton(test)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className={getLanguageClass()}>
                                <td colSpan="4" className={getLanguageClass()}>{t.noSubjects}</td>
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

export default ToifaBySubject;