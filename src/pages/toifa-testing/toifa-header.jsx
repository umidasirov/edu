import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./toifa.scss";
import { AccessContext } from "../../AccessContext";
import AnalyzingLoading from "../../components/analyzing-loading/analyzingLoading";

const TestHeader = ({ currentIndex, totalQuestions, timeLeft, calculateResults, res }) => {
    const { setStartTest } = useContext(AccessContext);
    const language = localStorage.getItem("language") || "uz";
    const [endModal, setEndModal] = useState(false);


    const translations = {
        uz: {
            exit: "Chiqish",
            hour: "Soat",
            minute: "Daqiqa",
            second: "Soniya",
            timeFormat: "00:00:00",
            analyzing: "Taxlil qilinmoqda..."
        },
        kaa: {
            exit: "Чиқиш",
            hour: "Соат",
            minute: "Дакика",
            second: "Сония",
            timeFormat: "00:00:00",
            analyzing: "Талдау этилмақта..."
        },
        ru: {
            exit: "Выход",
            hour: "Час",
            minute: "Минута",
            second: "Секунда",
            timeFormat: "00:00:00",
            analyzing: "Анализируется..."
        },
        en: {
            exit: "Exit",
            hour: "Hour",
            minute: "Minute",
            second: "Second",
            timeFormat: "00:00:00",
            analyzing: "Analyzing..."
        }
    };

    const t = translations[language] || translations["uz"];

    const getLanguageClass = () => {
        return language === "ru" || language === "kaa" ? "ru" : "";
    };
    const overTest = () => {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("selectedAnswers");
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("startTest");
    };

    const overTest2 = () => {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("selectedAnswers");
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("startTest");
        setStartTest(null);
    };

    useEffect(() => {
        if (timeLeft === 0) {
            overTest();
        }
    }, [timeLeft]);

    if (res) {
        return <AnalyzingLoading />
    }

    return (
        <div className={`testing-header ${getLanguageClass()}`}>
            <button
                className={`exit deskt ${getLanguageClass()}`}
                onClick={() => setEndModal(true)}
            >
                {res ? t.analyzing : (
                    language === "uz" ? "Testni yakunlash" :
                        language === "ru" ? "Завершить тест" :
                            language === "en" ? "Finish Test" : "Тестти тамaмлаў"
                )}
            </button>


            <div className={`time ${getLanguageClass()}`}>
                {totalQuestions === 0 || timeLeft === null ? (
                    t.timeFormat
                ) : (
                    <>
                        <span className={`time-hh ${getLanguageClass()}`}>
                            {String(Math.floor(timeLeft / 3600)).padStart(2, "0")}
                            <p className={getLanguageClass()}>{t.hour}</p>
                        </span>
                        :
                        <span className={`time-mm ${getLanguageClass()}`}>
                            {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0")}
                            <p className={getLanguageClass()}>{t.minute}</p>
                        </span>
                        :
                        <span className={`time-ss ${getLanguageClass()}`}>
                            {String(timeLeft % 60).padStart(2, "0")}
                            <p className={getLanguageClass()}>{t.second}</p>
                        </span>
                    </>
                )}
            </div>

            <div className={`count-time ${getLanguageClass()}`}>
                <p className={getLanguageClass()}>{totalQuestions !== 0 ? currentIndex + 1 : 0}.</p>
                <div className={`time-mob ${getLanguageClass()}`}>
                    {totalQuestions === 0 || timeLeft === null ? (
                        t.timeFormat
                    ) : (
                        <>
                            <span className={`time-hh ${getLanguageClass()}`}>
                                {String(Math.floor(timeLeft / 3600)).padStart(2, "0")}
                            </span>
                            :
                            <span className={`time-mm ${getLanguageClass()}`}>
                                {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0")}
                            </span>
                            :
                            <span className={`time-ss ${getLanguageClass()}`}>
                                {String(timeLeft % 60).padStart(2, "0")}
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className={`end-modal-shape ${endModal ? "act" : ""}`}></div>
            <div className={`end-modal ${endModal ? "act" : ""}`}>
                <h3>Rostdan ham testni yakunlamoqchimisiz?</h3>
                <div className="end-btns">
                    <button onClick={() => setEndModal(false)}>{res ? t.analyzing : (
                        language === "uz" ? "Yo'q" :
                            language === "ru" ? "Нет" :
                                language === "en" ? "No" : "Жоқ"
                    )}</button>
                    <button onClick={calculateResults}
                        disabled={res}>
                        {res ? t.analyzing : (
                            language === "uz" ? "Ha" :
                                language === "ru" ? "Да" :
                                    language === "en" ? "Yes" : "Hа"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestHeader;