import React, { useContext, useEffect, useState } from 'react';
import TestHeader from './toifa-header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AccessContext } from '../../AccessContext';
import { api } from '../../App';
import Loading from '../../components/loading/loading';
import "./toifa.scss";
import UserData from './user-data';
import ProgressTracker from './progressTracker';
import Question from './questions';
import Results from './result';
import BackButtonModalHandler from '../../components/backBlock/backBock';
import { useRefreshPrompt } from '../../hooks/usePromptCustom';
import { UseTestMode } from '../../components/linksBlock/linksBlock';

const ToifaDetail = () => {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const { profileData, access, startTest, setStartTest } =
        useContext(AccessContext);


    const [questionStartTime, setQuestionStartTime] = useState(
        localStorage.getItem("questionStartTime")
            ? new Date(localStorage.getItem("questionStartTime"))
            : new Date()
    );

    const [timePerQuestion, setTimePerQuestion] = useState(
        JSON.parse(localStorage.getItem("timePerQuestion")) || {}
    );







    const TEST_STORAGE_KEY = 'test_data_tf';

    // Test ma'lumotlarini olish
    const getTestData = () => {
        const allTests = JSON.parse(localStorage.getItem(TEST_STORAGE_KEY)) || {};
        return allTests[id] || null;
    };

    // Test ma'lumotlarini saqlash
    const saveTestData = (data) => {
        const allTests = JSON.parse(localStorage.getItem(TEST_STORAGE_KEY)) || {};
        allTests[id] = data;
        localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(allTests));
    };

    // Test ma'lumotlarini tozalash
    const clearTestData = () => {
        const allTests = JSON.parse(localStorage.getItem(TEST_STORAGE_KEY)) || {};
        delete allTests[id];

        if (Object.keys(allTests).length === 0) {
            localStorage.removeItem(TEST_STORAGE_KEY);
        } else {
            localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(allTests));
        }

        console.log(`${id} testi ma'lumotlari tozalandi`);
    };

    // State larni initialize qilish
    const initialTestData = getTestData() || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
        initialTestData.currentQuestionIndex || 0
    );

    const [selectedAnswers, setSelectedAnswers] = useState(
        initialTestData.selectedAnswers || []
    );

    const [timeLeft, setTimeLeft] = useState(
        initialTestData.timeLeft || null
    );

    const [startTime, setStartTime] = useState(
        initialTestData.startTime ? new Date(initialTestData.startTime) : new Date()
    );

    // Test ma'lumotlarini saqlash useEffect
    useEffect(() => {
        const testData = {
            currentQuestionIndex,
            selectedAnswers,
            timeLeft,
            startTime: startTime.toISOString(),
            // Boshqa kerakli ma'lumotlar...
        };

        saveTestData(testData);
    }, [currentQuestionIndex, selectedAnswers, timeLeft, startTime]);
    const [endModal, setEndModal] = useState(false);


    const [sciences, setSciences] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState([]);
    const [resLoading, setResLoading] = useState(false);
    const language = localStorage.getItem("language") || "uz";

    const [openDetails, setOpenDetails] = useState(false);

    const translations = {
        uz: {
            analyzing: "Taxlil qilinmoqda..."
        },
        kaa: {
            analyzing: "Талдау этилмақта..."
        },
        ru: {
            analyzing: "Анализируется..."
        },
        en: {
            analyzing: "Analyzing..."
        }
    };

    const t = translations[language] || translations["uz"];

    const getLanguageClass = () => {
        return language === "ru" || language === "kaa" ? "ru" : "";
    };

    // Cleanup function for test data
    const cleanupTestData = () => {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("selectedAnswers");
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("timePerQuestion");
        localStorage.removeItem("startTime");
        localStorage.removeItem("questionStartTime");
        localStorage.removeItem("startTest");
    };

    useEffect(() => {
        const savedTestId = localStorage.getItem("startTest");
        if (savedTestId) {
            setStartTest(savedTestId);
        }

        return () => {
            if (!results) {
                cleanupTestData();
            }
        };
    }, [results]);

    // Save timings to localStorage
    useEffect(() => {
        localStorage.setItem("startTime", startTime.toISOString());
    }, [startTime]);

    useEffect(() => {
        localStorage.setItem("questionStartTime", questionStartTime.toISOString());
    }, [questionStartTime]);

    // Update question start time when question changes
    useEffect(() => {
        if (groupedQuestions.length > 0 || test?.questions?.length > 0) {
            setQuestionStartTime(new Date());
        }
    }, [currentQuestionIndex, groupedQuestions, test]);

    // Fetch sciences data
    useEffect(() => {
        if (test?.questions_grouped_by_science) {
            const grouped = [];
            let questionIndex = 0;

            // Iterate through questions_grouped_by_science in the order they come
            Object.entries(test.questions_grouped_by_science).forEach(([scienceName, questions]) => {
                const group = {
                    name: scienceName,
                    questions: questions,
                    count: questions.length,
                    startIndex: questionIndex
                };

                grouped.push(group);
                questionIndex += group.count;
            });

            // Flatten all questions while maintaining order
            const allQuestions = grouped.flatMap(group => group.questions);
            setGroupedQuestions(allQuestions);
        } else if (test?.questions) {
            // Fallback to regular questions array if grouped data isn't available
            setGroupedQuestions(test.questions);
        }
    }, [test]);

    // Group questions by science
    useEffect(() => {
        if (test && (test.questions_grouped_by_science || test.questions) && sciences.length > 0) {
            const grouped = {};
            let questionIndex = 0;

            // Use questions_grouped_by_science if available, otherwise use questions
            const questionsSource = test.questions_grouped_by_science
                ? Object.values(test.questions_grouped_by_science).flat()
                : test.questions;

            sciences.forEach(science => {
                grouped[science.id] = {
                    name: science.name,
                    questions: [],
                    startIndex: questionIndex,
                    count: 0
                };
            });

            questionsSource.forEach((question, index) => {
                const scienceId = question.science_id || test.science[index % test.science.length];
                if (grouped[scienceId]) {
                    grouped[scienceId].questions.push(question);
                    grouped[scienceId].count++;
                    questionIndex++;
                }
            });

            const sortedQuestions = [];
            Object.values(grouped).forEach(subject => {
                sortedQuestions.push(...subject.questions);
            });

            setGroupedQuestions(sortedQuestions);
        } else if (test && (test.questions_grouped_by_science || test.questions)) {
            const questions = test.questions_grouped_by_science
                ? Object.values(test.questions_grouped_by_science).flat()
                : test.questions;
            setGroupedQuestions(questions);
        }
    }, [test, sciences]);

    // Fetch test details
    // Testni yuklash
    const token = localStorage.getItem('accessToken')
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await fetch(`${api}/category_exams/test/${id}/start/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Testni yuklab bo‘lmadi');

                const testData = await response.json();
                console.log(testData);

                setTest(testData);

                // timeLeft serverdan kelgan ma'lumot asosida
                setTimeLeft(testData.attempt.remaining_seconds);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };


        fetchTest();

        // Komponent unmount bo'lganda tozalash
        return () => {
            if (!results) {
                clearTestData();
            }
        };
    }, [id]);

    // Vaqt hisoblagichi
    useEffect(() => {
        if (!timeLeft) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    calculateResults();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
    
    // Save current state to localStorage
    useEffect(() => {
        localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    }, [currentQuestionIndex]);

    useEffect(() => {
        localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    }, [selectedAnswers]);

    useEffect(() => {
        localStorage.setItem("timePerQuestion", JSON.stringify(timePerQuestion));
    }, [timePerQuestion]);

    // Navigation functions
    const handleNextQuestion = () => {
        const currentTime = new Date();
        const currentQuestion = groupedQuestions?.[currentQuestionIndex] || test?.questions?.[currentQuestionIndex];

        if (!currentQuestion) return;

        const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);

        setTimePerQuestion((prev) => {
            const updated = { ...prev, [currentQuestion.text]: timeSpent };
            localStorage.setItem("timePerQuestion", JSON.stringify(updated));
            return updated;
        });

        const totalQuestions = groupedQuestions?.length || test?.questions?.length || 0;
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => {
                const newIndex = prev - 1;
                localStorage.setItem("currentQuestionIndex", newIndex);
                return newIndex;
            });
        }
    };


    // Calculate results function
    const calculateResults = async () => {
        setResLoading(true);
        

        try {
            // Prepare answers data with guid format
             const answersData = selectedAnswers.map((answer) => ({
                question_guid: answer.questionGuid,
                option_guid: answer.selectedOptionGuid,
            }));

            // Get attempt guid from test data
            const attemptGuid = test?.attempt?.guid;

            if (!attemptGuid) {
                throw new Error("Attempt GUID topilmadi.");
            }

            // Step 1: Submit answers to the submit endpoint
            const submitResponse = await fetch(
                `https://api.edumark.uz/category_exams/attempt/${attemptGuid}/submit/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({ answers: answersData }),
                }
            );

            if (!submitResponse.ok) {
                throw new Error("Testing natijalarini saqlashda xato yuz berdi.");
            }

            const submitData = await submitResponse.json();
            console.log("Submit response:", submitData);

            // Step 2: Get results from the result endpoint
            const resultResponse = await fetch(
                `${api}/category_exams/attempt/${attemptGuid}/result/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );

            if (!resultResponse.ok) {
                throw new Error("Natijalarni olishda xato yuz berdi.");
            }

            const resultData = await resultResponse.json();
            console.log("Result response:", resultData);

            // Set results with the new structure
            setResults(resultData);
        } catch (error) {
            console.error(error.message);
        } finally {
            setResLoading(false);
            cleanupTestData();
        }
    };


    // Auto-calculate results when time is up
    useEffect(() => {
        if (timeLeft === 0) {
            calculateResults();
        }
    }, [timeLeft]);

    const handleFinishTest = () => {
        calculateResults();
    };

    const [nextPath, setNextPath] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        window.history.pushState(null, "", window.location.pathname);

        const handlePopState = () => {
            setNextPath('/toifa-imtihonlari');
            setShowModal(true);
        };

        window.addEventListener('popstate', handlePopState)
    })

    const handleCancel = () => {
        setShowModal(false);
    };
    const handleConfirm = () => {
        setShowModal(false);
        if (nextPath) {
            window.location.href = nextPath
        }
    };

    const { RefreshModal } = useRefreshPrompt(true);


    if (loading)
        return (
            <p>
                <Loading />
            </p>
        );
    if (error) return <p>Xatolik: {error}</p>;

    if (results)
        return (
            <Results
                resLoading={resLoading}
                results={results}
                test={test}
                selectedAnswers={selectedAnswers}
            />
        );

    return (
        <div id='toifa-testing'>
            <UseTestMode testMode={true} />
            <TestHeader
                currentIndex={currentQuestionIndex}
                totalQuestions={(groupedQuestions?.length || test?.questions?.length) || 0}
                timeLeft={timeLeft}
                calculateResults={calculateResults}
                res={resLoading}
            />
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Testni tark etmoqchimisiz?</h3>
                        <p>Sahifani yangilash yoki yopish test natijalaringizni yo'qotishiga olib keladi</p>

                        <div className="modal-actions">
                            <button onClick={handleCancel} className="confirm-btn">
                                Davom etish
                            </button>
                            <button onClick={handleConfirm} className="cancel-btn">
                                Chiqish
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="test-container">
                <div className={`opener-btn ${openDetails ? "active" : ""}`} onClick={() => setOpenDetails(!openDetails)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144" /></svg>
                </div>
                <div className={`toifa-left ${openDetails ? "active" : ""}`}>
                    <div className={`opener-btn right ${openDetails ? "active" : ""}`} onClick={() => setOpenDetails(!openDetails)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144" /></svg>
                    </div>
                    <UserData />
                    <ProgressTracker
                        test={test}
                        selectedAnswers={selectedAnswers}
                        currentQuestionIndex={currentQuestionIndex}
                        isTestFinished={false}
                        setCurrentQuestionIndex={setCurrentQuestionIndex}
                        groupedQuestions={groupedQuestions}
                    />
                </div>
                <div className="toifa-right">
                    <Question
                        currentIndex={currentQuestionIndex}
                        question={(groupedQuestions?.[currentQuestionIndex] || test?.questions?.[currentQuestionIndex]) || null}
                        selectedAnswers={selectedAnswers}
                        setSelectedAnswers={setSelectedAnswers}
                        currentQuestionIndex={currentQuestionIndex}
                        test={test}
                        setCurrentQuestionIndex={setCurrentQuestionIndex}
                        res={resLoading}
                        handleNextQuestion={handleNextQuestion}
                        handlePreviousQuestion={handlePreviousQuestion}
                        calculateResults={calculateResults}
                        timeLeft={timeLeft}
                    />

                    <div className={`end-modal-shape ${endModal ? "act" : ""}`}></div>
                    <div className={`end-modal ${endModal ? "act" : ""}`}>
                        <h3>Rostdan ham testni yakunlamoqchimisiz?</h3>
                        <div className="end-btns">
                            <button onClick={() => setEndModal(false)}>{resLoading ? t.analyzing : (
                                language === "uz" ? "Yo'q" :
                                    language === "ru" ? "Нет" :
                                        language === "en" ? "No" : "Жоқ"
                            )}</button>
                            <button onClick={calculateResults}
                                disabled={resLoading}>
                                {resLoading ? t.analyzing : (
                                    language === "uz" ? "Ha" :
                                        language === "ru" ? "Да" :
                                            language === "en" ? "Yes" : "Hа"
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        className={`exit mobi ${getLanguageClass()}`}
                        onClick={() => setEndModal(true)}
                    >
                        {resLoading ? t.analyzing : (
                            language === "uz" ? "Testni yakunlash" :
                                language === "ru" ? "Завершить тест" :
                                    language === "en" ? "Finish Test" : "Тестти тамaмлаў"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToifaDetail;