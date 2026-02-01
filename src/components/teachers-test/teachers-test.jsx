import React, { useState, useEffect } from 'react';
import "./teachers-test.scss";
import { Link } from 'react-router-dom';
import { api } from '../../App';
const TeachersTest = () => {
    const language = localStorage.getItem("language") || "uz";
    const [animatedSubjects, setAnimatedSubjects] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const translations = {
        uz: {
            testsCommon: [
                { type: "Fan bo‘yicha test", count: 35 },
                { type: "Pedagogik mahorat", count: 10 },
                { type: "Kasbiy standart", count: 5 }
            ],

            categoryNames: {
                humanities: { label: "Gumanitar", description: "Tarix, adabiyot va tillar" },
                natural: { label: "Tabiiy", description: "Tabiiy fanlar" },
                formal: { label: "Aniq", description: "Aniq fanlar" },
                social: { label: "Ijtimoiy", description: "Jamiyat fanlari" },
                technical: { label: "Texnik", description: "Texnologiya va informatika" }
            },

            title: "O‘qituvchilar uchun malaka (toifa) imtihonlari",
            description: "Barcha fan va yo‘nalishlar bo‘yicha testlar",
            viewAll: "Testlarga o'tish",

            subjects: {
                history: { label: "Tarix", icon: "fa-book", category: "Gumanitar" },
                geography: { label: "Geografiya", icon: "fa-globe", category: "Ijtimoiy" },
                chemistry: { label: "Kimyo", icon: "fa-flask", category: "Tabiiy" },
                biology: { label: "Biologiya", icon: "fa-leaf", category: "Tabiiy" },
                physics: { label: "Fizika", icon: "fa-atom", category: "Tabiiy" },
                informatics: { label: "Informatika", icon: "fa-laptop-code", category: "Texnik" },
                russian: { label: "Rus tili", icon: "fa-language", category: "Gumanitar" },
                german: { label: "Nemis tili", icon: "fa-language", category: "Gumanitar" },
                french: { label: "Fransuz tili", icon: "fa-language", category: "Gumanitar" },
                math: { label: "Matematika", icon: "fa-square-root-alt", category: "Aniq" },
                uzbek: { label: "O‘zbek tili va adabiyoti", icon: "fa-pen-nib", category: "Gumanitar" },
                english: { label: "Ingliz tili", icon: "fa-language", category: "Gumanitar" }
            }
        },

        kaa: {
            testsCommon: [
                { type: "Pän boyinsha test", count: 35 },
                { type: "Pedagogikalıq deñgey", count: 10 },
                { type: "Kásiptiy standart", count: 5 }
            ],

            categoryNames: {
                humanities: { label: "Gumanitar", description: "Tarıx, ádebiyat hám tiller" },
                natural: { label: "Tabiǵiy", description: "Tabiǵiy pánler" },
                formal: { label: "Anıq", description: "Matematika hám anıq pánler" },
                social: { label: "Álewmetlik", description: "Álewmetlik pánler" },
                technical: { label: "Texnikalıq", description: "Texnologiya hám informatika" }
            },

            title: "Oqıtwshılar ushın toypa imtixanları",
            description: "Barlıq pánler boyınsha testler",
            viewAll: "Testlerge ótish",

            subjects: {
                history: { label: "Taríx", icon: "fa-book", category: "Gumanitar" },
                geography: { label: "Geografiya", icon: "fa-globe", category: "Álewmetlik" },
                chemistry: { label: "Ximiya", icon: "fa-flask", category: "Tabiǵiy" },
                biology: { label: "Biologiya", icon: "fa-leaf", category: "Tabiǵiy" },
                physics: { label: "Fizika", icon: "fa-atom", category: "Tabiǵiy" },
                informatics: { label: "Informatika", icon: "fa-laptop-code", category: "Texnikalıq" },
                russian: { label: "Rus tili", icon: "fa-language", category: "Gumanitar" },
                german: { label: "Nemis tili", icon: "fa-language", category: "Gumanitar" },
                french: { label: "Fransuz tili", icon: "fa-language", category: "Gumanitar" },
                math: { label: "Matematika", icon: "fa-square-root-alt", category: "Anıq" },
                uzbek: { label: "Ózbek tili hám ádebiyatı", icon: "fa-pen-nib", category: "Gumanitar" },
                english: { label: "Ingliz tili", icon: "fa-language", category: "Gumanitar" }
            }
        },

        ru: {
            testsCommon: [
                { type: "Тест по предмету", count: 35 },
                { type: "Педагогическое мастерство", count: 10 },
                { type: "Профессиональный стандарт", count: 5 }
            ],

            categoryNames: {
                humanities: { label: "Гуманитарные", description: "История, языки и литература" },
                natural: { label: "Естественные", description: "Естественно-научные предметы" },
                formal: { label: "Точные", description: "Математика и точные науки" },
                social: { label: "Социальные", description: "Общество и социальные науки" },
                technical: { label: "Технические", description: "Технологии и информатика" }
            },

            title: "Квалификационные экзамены для учителей",
            description: "Тесты по всем предметам",
            viewAll: "Перейти к тестам",

            subjects: {
                history: { label: "История", icon: "fa-book", category: "Гуманитарные" },
                geography: { label: "География", icon: "fa-globe", category: "Социальные" },
                chemistry: { label: "Химия", icon: "fa-flask", category: "Естественные" },
                biology: { label: "Биология", icon: "fa-leaf", category: "Естественные" },
                physics: { label: "Физика", icon: "fa-atom", category: "Естественные" },
                informatics: { label: "Информатика", icon: "fa-laptop-code", category: "Технические" },
                russian: { label: "Русский язык", icon: "fa-language", category: "Гуманитарные" },
                german: { label: "Немецкий язык", icon: "fa-language", category: "Гуманитарные" },
                french: { label: "Французский язык", icon: "fa-language", category: "Гуманитарные" },
                math: { label: "Математика", icon: "fa-square-root-alt", category: "Точные" },
                uzbek: { label: "Узбекский язык и литература", icon: "fa-pen-nib", category: "Гуманитарные" },
                english: { label: "Английский язык", icon: "fa-language", category: "Гуманитарные" }
            }
        },

        en: {
            testsCommon: [
                { type: "Subject test", count: 35 },
                { type: "Pedagogical skills", count: 10 },
                { type: "Professional standard", count: 5 }
            ],

            categoryNames: {
                humanities: { label: "Humanities", description: "History, languages and literature" },
                natural: { label: "Natural Sciences", description: "Natural science subjects" },
                formal: { label: "Exact Sciences", description: "Mathematics and exact sciences" },
                social: { label: "Social Sciences", description: "Society and social studies" },
                technical: { label: "Technical", description: "Technology and informatics" }
            },

            title: "Qualification exams for teachers",
            description: "Tests for all subjects and categories",
            viewAll: "Go to tests",

            subjects: {
                history: { label: "History", icon: "fa-book", category: "Humanities" },
                geography: { label: "Geography", icon: "fa-globe", category: "Social Sciences" },
                chemistry: { label: "Chemistry", icon: "fa-flask", category: "Natural Sciences" },
                biology: { label: "Biology", icon: "fa-leaf", category: "Natural Sciences" },
                physics: { label: "Physics", icon: "fa-atom", category: "Natural Sciences" },
                informatics: { label: "Computer Science", icon: "fa-laptop-code", category: "Technical" },
                russian: { label: "Russian language", icon: "fa-language", category: "Humanities" },
                german: { label: "German language", icon: "fa-language", category: "Humanities" },
                french: { label: "French language", icon: "fa-language", category: "Humanities" },
                math: { label: "Mathematics", icon: "fa-square-root-alt", category: "Exact Sciences" },
                uzbek: { label: "Uzbek language and literature", icon: "fa-pen-nib", category: "Humanities" },
                english: { label: "English language", icon: "fa-language", category: "Humanities" }
            }
        }
    };



    const colors = [
        "purlpe",
        "green",
        "orange",
        "#FFD93D",
        "#pink",
        "red",
        "#00C9A7",
        "#FF6F91",
        "#FFC75F",
        "crimson",
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
    const getShortLabel = (label) => {
        if (label.length > 12) {
            return label.split(" ")[0];
        }
        return label;
    };
    useEffect(() => {
        const fetchTests = async () => {
            const token = localStorage.getItem("accessToken");
            setLoading(true);
            try {
                 const response = await fetch(`${api}/category_exams/testsubjects/`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                if (!response.ok) throw new Error("Network error");

                const data = await response.json();

                setSubjects(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);


    const languageClass = getLanguageClass();

    return (
        <div className={`t-tests ${languageClass}`} id='subject-tests'>

            <div className="t-tests-inner">
                <div className="tbrow">
                    <div className={`cell ${languageClass}`}>
                        <ul className={`subjects-list sl-3 ${languageClass}`}>
                            {Object.entries(t.subjects).filter(([key, subj]) => 
                                subjects.some(subject => subject.title.includes(subj.label))
                            ).map(([key, subj], index) => {
                                const matchingTest = subjects.find(subject => subject.title.includes(subj.label));
                                return (
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
                                                    <h4>{getShortLabel(subj.label)}</h4>

                                                    <span className="category" style={{ color: colors[index % colors.length] }}>
                                                        {subj.category || "Kategoriya"}
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="subject-desc">
                                                {t.testsCommon.map((test, i) => (
                                                    <li key={i}>
                                                        <span style={{ color: colors[index % colors.length] }}>• </span>
                                                        {test.type}: {test.count}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="btn-card">
                                                <Link to={`/toifa-imtihonlari/${matchingTest.guid}`} className={languageClass}>
                                                    <button style={{ background: colors[index % colors.length] }}>
                                                        {t.viewAll}
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            ) })}
                        </ul>
                        <p>
                            <Link to="/toifa-imtihonlari" className={languageClass}>
                                {t.viewAll}
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachersTest;