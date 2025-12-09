import React, { useState, useEffect } from 'react';
import "./teachers-test.scss";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faGlobe, faFlask, faLeaf, faAtom, faLaptopCode, faLanguage, faSquareRootAlt, faPenNib } from '@fortawesome/free-solid-svg-icons';
const TeachersTest = () => {
    const language = localStorage.getItem("language") || "uz";
    const [animatedSubjects, setAnimatedSubjects] = useState([]);

    const translations = {
        uz: {
            categoryNames: {
                humanities: { label: "Gumanitar", description: "Tarix, adabiyot va tillar bilan bog'liq fanlar" },
                natural: { label: "Tabiiy", description: "Tabiatshunoslik va ilmiy fanlar" },
                formal: { label: "Aniq", description: "Matematika va mantiqiy fanlar" },
                social: { label: "Ijtimoiy", description: "Jamiyat va ijtimoiy fanlar" },
                technical: { label: "Texnik", description: "Texnologiya va informatika bilan bog'liq fanlar" }
            },
            title: "O‘qituvchilar uchun malaka (toifa) imtihonlari",
            description: "Barcha fan va toifa yo‘nalishlari bilan tanishing",
            viewAll: "Testlarga o'tish",
            subjects: {
                history: { label: "Tarix", icon: "fa-book", category: "Gumanitar", count: 20, time: "1:30" },
                geography: { label: "Geografiya", icon: "fa-globe", category: "Ijtimoiy", count: 20, time: "1:30" },
                chemistry: { label: "Kimyo", icon: "fa-flask", category: "Tabiiy", count: 20, time: "1:30" },
                biology: { label: "Biologiya", icon: "fa-leaf", category: "Tabiiy", count: 20, time: "1:30" },
                physics: { label: "Fizika", icon: "fa-atom", category: "Tabiiy", count: 20, time: "1:30" },
                informatics: { label: "Informatika", icon: "fa-laptop-code", category: "Texnik", count: 20, time: "1:30" },
                russian: { label: "Rus tili", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" },
                german: { label: "Nemis tili", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" },
                french: { label: "Fransuz tili", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" },
                math: { label: "Matematika", icon: "fa-square-root-alt", category: "Aniq", count: 20, time: "1:30" },
                uzbek: { label: "O'zbek tili va adabiyoti", icon: "fa-pen-nib", category: "Gumanitar", count: 20, time: "1:30" },
                english: { label: "Ingliz tili", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" }
            }
        },

        kaa: {
            categoryNames: {
                humanities: { label: "Gumanitar", description: "Тарих, адабият және тиллер" },
                natural: { label: "Tabиғый", description: "Табиғат және ғылыми фанлар" },
                formal: { label: "Дәлелли", description: "Математика және логикалық фанлар" },
                social: { label: "Ижтимаий", description: "Жамият және ижтимаий фанлар" },
                technical: { label: "Техникалық", description: "Технология және информатика" }
            },
            title: "Мұғаллимлер үшін сапат (тоипа) сынақлары",
            description: "Барлық пән hәм тоипа бағытлары менен танысыңыз",
            viewAll: "Тестлерге өту",
            subjects: {
                history: { label: "Тарих", icon: "fa-book", category: "Gumanitar", count: 20, time: "1:30" },
                geography: { label: "География", icon: "fa-globe", category: "Ижтимаий", count: 20, time: "1:30" },
                chemistry: { label: "Химия", icon: "fa-flask", category: "Tabиғый", count: 20, time: "1:30" },
                biology: { label: "Биология", icon: "fa-leaf", category: "Tabиғый", count: 20, time: "1:30" },
                physics: { label: "Физика", icon: "fa-atom", category: "Tabиғый", count: 20, time: "1:30" },
                informatics: { label: "Информатика", icon: "fa-laptop-code", category: "Техникалық", count: 20, time: "1:30" },
                russian: { label: "Орыс тили", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" },
                german: { label: "Немис тили", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" },
                french: { label: "Франсуз тили", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" },
                math: { label: "Математика", icon: "fa-square-root-alt", category: "Дәлелли", count: 20, time: "1:30" },
                uzbek: { label: "Өзбек тили ҳәм адабияты", icon: "fa-pen-nib", category: "Gumanitar", count: 20, time: "1:30" },
                english: { label: "Ағылшын тили", icon: "fa-language", category: "Gumanitar", count: 20, time: "1:30" }
            }
        },

        ru: {
            categoryNames: {
                humanities: { label: "Гуманитарные", description: "История, литература и языки" },
                natural: { label: "Естественные", description: "Естественно-научные дисциплины" },
                formal: { label: "Точные", description: "Математика и логика" },
                social: { label: "Социальные", description: "Общество и социальные науки" },
                technical: { label: "Технические", description: "Технологии и информатика" }
            },
            title: "Квалификационные (категорийные) экзамены для учителей",
            description: "Oзнакомьтесь со всеми предметными и категорийными направлениями",
            viewAll: "Перейти к тестам",
            subjects: {
                history: { label: "История", icon: "fa-book", category: "Гуманитарные", count: 20, time: "1:30" },
                geography: { label: "География", icon: "fa-globe", category: "Социальные", count: 20, time: "1:30" },
                chemistry: { label: "Химия", icon: "fa-flask", category: "Естественные", count: 20, time: "1:30" },
                biology: { label: "Биология", icon: "fa-leaf", category: "Естественные", count: 20, time: "1:30" },
                physics: { label: "Физика", icon: "fa-atom", category: "Естественные", count: 20, time: "1:30" },
                informatics: { label: "Информатика", icon: "fa-laptop-code", category: "Технические", count: 20, time: "1:30" },
                russian: { label: "Русский язык", icon: "fa-language", category: "Гуманитарные", count: 20, time: "1:30" },
                german: { label: "Немецкий язык", icon: "fa-language", category: "Гуманитарные", count: 20, time: "1:30" },
                french: { label: "Французский язык", icon: "fa-language", category: "Гуманитарные", count: 20, time: "1:30" },
                math: { label: "Математика", icon: "fa-square-root-alt", category: "Точные", count: 20, time: "1:30" },
                uzbek: { label: "Узбекский язык и литература", icon: "fa-pen-nib", category: "Гуманитарные", count: 20, time: "1:30" },
                english: { label: "Английский язык", icon: "fa-language", category: "Гуманитарные", count: 20, time: "1:30" }
            }
        },

        en: {
            categoryNames: {
                humanities: { label: "Humanities", description: "History, literature, and languages" },
                natural: { label: "Natural", description: "Science and nature-related subjects" },
                formal: { label: "Formal", description: "Mathematics and logic" },
                social: { label: "Social", description: "Society and social sciences" },
                technical: { label: "Technical", description: "Technology and informatics" }
            },
            title: "Qualification (category) exams for teachers",
            description: "Explore all subject and category directions",
            viewAll: "Go to tests",
            subjects: {
                history: { label: "History", icon: "fa-book", category: "Humanities", count: 20, time: "1:30" },
                geography: { label: "Geography", icon: "fa-globe", category: "Social", count: 20, time: "1:30" },
                chemistry: { label: "Chemistry", icon: "fa-flask", category: "Natural", count: 20, time: "1:30" },
                biology: { label: "Biology", icon: "fa-leaf", category: "Natural", count: 20, time: "1:30" },
                physics: { label: "Physics", icon: "fa-atom", category: "Natural", count: 20, time: "1:30" },
                informatics: { label: "Informatics", icon: "fa-laptop-code", category: "Technical", count: 20, time: "1:30" },
                russian: { label: "Russian", icon: "fa-language", category: "Humanities", count: 20, time: "1:30" },
                german: { label: "German", icon: "fa-language", category: "Humanities", count: 20, time: "1:30" },
                french: { label: "French", icon: "fa-language", category: "Humanities", count: 20, time: "1:30" },
                math: { label: "Mathematics", icon: "fa-square-root-alt", category: "Formal", count: 20, time: "1:30" },
                uzbek: { label: "Uzbek language and literature", icon: "fa-pen-nib", category: "Humanities", count: 20, time: "1:30" },
                english: { label: "English", icon: "fa-language", category: "Humanities", count: 20, time: "1:30" }
            }
        }
    };


    const colors = [
        "#FF6B6B",
        "#6BCB77",
        "#4D96FF",
        "#FFD93D",
        "#845EC2",
        "#FF9671",
        "#00C9A7",
        "#FF6F91",
        "#FFC75F",
        "#F9F871",
        "#D65DB1",
        "#0081CF"
    ];
    const t = translations[language] || translations["uz"];

    const getLanguageClass = () => {
        return language === "ru" || language === "kaa" ? "ru" : "";
    };

    const formatLink = (text) => {
        return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
    };



    const languageClass = getLanguageClass();

    return (
        <div className={`t-tests ${languageClass}`}>
            <h1 className={languageClass}>{t.title}</h1>

            <p className={languageClass}>
                {t.description}
                <Link to="/toifa-imtihonlari" className={languageClass}>
                    {t.viewAll}
                </Link>
            </p>

            <div className="t-tests-inner">
                <div className="tbrow">
                    <div className={`cell ${languageClass}`}>
                        <ul className={`subjects-list sl-3 ${languageClass}`}>
                            {Object.entries(t.subjects).map(([key, subj], index) => (
                                <li
                                    key={key}
                                    className="subject-card"
                                    style={{ color: colors[index % colors.length] }}
                                >
                                    <div className='cont-card'>
                                        <div className="card-content">
                                            <div style={{ display: 'flex' }} className='main-d'>
                                                <div style={{ background: colors[index % colors.length] }} className="icon-wrapper">
                                                    <i className={`fa-solid ${subj.icon}`}></i>
                                                </div>
                                                <div className='left-d'>
                                                    <h4>{subj.label.slice(0, 12)}</h4>
                                                    <span className="category" style={{ color: colors[index % colors.length] }}>
                                                        {subj.category || "Kategoriya"}
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="subject-desc">
                                                {subj.description && (
                                                    <li>
                                                        <span style={{ color: colors[index % colors.length] }}>• </span>
                                                        {subj.description}
                                                    </li>
                                                )}
                                                {subj.time && (
                                                    <li>
                                                        <span style={{ color: colors[index % colors.length] }}>• </span>
                                                        Vaqt: {subj.time}
                                                    </li>
                                                )}
                                                {subj.count && (
                                                    <li>
                                                        <span style={{ color: colors[index % colors.length] }}>• </span>
                                                        Savollar soni: {subj.count}
                                                    </li>
                                                )}
                                            </ul>

                                            <div className="btn-card">
                                                <Link to={`/toifa-imtihonlari/${formatLink(subj.label)}`} className={languageClass}>
                                                    <button style={{ background: colors[index % colors.length] }}>
                                                        {t.viewAll}
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachersTest;