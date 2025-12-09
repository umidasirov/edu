import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./sciences-detail.scss";
import { api } from "../../App";
import Loading from "../../components/loading/loading";

const SciencesDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [sciences, setSciences] = useState([]);
  const [allSciences, setAllSciences] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [time, setTime] = useState(5);
  const [questionCount, setQuestionCount] = useState(20);
  const [checkedTopics, setCheckedTopics] = useState([]);
  
  const language = localStorage.getItem("language") || "uz";
  
  const translations = {
    uz: {
      title: (subject) => `${subject} testi`,
      settings: "Test sozlamalari",
      selectSubject: "Tanlang",
      topics: "Mavzular",
      noTopics: "Mavzular mavjud emas!",
      duration: "Davomiylik (vaqt)",
      minutes: (min) => `${min} daqiqa`,
      questionCount: "Savollar soni",
      questions: (count) => `${count} ta`,
      startButton: "Boshlash",
      noSubjects: "Fanlar mavjud emas!",
      selectTopicError: "Iltimos, kamida bitta mavzu tanlang!",
      fetchError: "Ma'lumotlarni olishda xatolik yuz berdi."
    },
    kaa: {
      title: (subject) => `${subject} тести`,
      settings: "Тест соўламалары",
      selectSubject: "Таңлаң",
      topics: "Маўзўлар",
      noTopics: "Маўзўлар мәмжўт емес!",
      duration: "Дауамлылығы (уақыты)",
      minutes: (min) => `${min} минут`,
      questionCount: "Сауаллар саны",
      questions: (count) => `${count} та`,
      startButton: "Баслаў",
      noSubjects: "Фанлар мәмжўт емес!",
      selectTopicError: "Илтимас, әне бир маўзў таңаң!",
      fetchError: "Ма'лўматлар алыўда қаталық юз берди."
    },    
    ru: {
      title: (subject) => `Тесты по ${subject}`,
      settings: "Настройки теста",
      selectSubject: "Выберите",
      topics: "Темы",
      noTopics: "Темы недоступны!",
      duration: "Продолжительность (время)",
      minutes: (min) => `${min} минут`,
      questionCount: "Количество вопросов",
      questions: (count) => `${count} вопросов`,
      startButton: "Начать",
      noSubjects: "Предметы недоступны!",
      selectTopicError: "Пожалуйста, выберите хотя бы одну тему!",
      fetchError: "Произошла ошибка при получении данных."
    },
    en: {
      title: (subject) => `${subject} Tests`,
      settings: "Test Settings",
      selectSubject: "Select",
      topics: "Topics",
      noTopics: "No topics available!",
      duration: "Duration (time)",
      minutes: (min) => `${min} minutes`,
      questionCount: "Number of questions",
      questions: (count) => `${count} questions`,
      startButton: "Start",
      noSubjects: "No subjects available!",
      selectTopicError: "Please select at least one topic!",
      fetchError: "An error occurred while fetching data."
    }
  };

  const t = translations[language] || translations["uz"];
  
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sciencesResponse, departmentsResponse] = await Promise.all([
          fetch(`${api}/fan/`),
          fetch(`${api}/test_thema/`),
        ]);
        if (!sciencesResponse.ok || !departmentsResponse.ok) {
          throw new Error(t.fetchError);
        }
        const sciencesData = await sciencesResponse.json();
        const departmentsData = await departmentsResponse.json();
        const formattedName = formatLink(name);
        const fdata = sciencesData.filter(
          (e) => formatLink(e.title) === formattedName
        );
        setSciences(fdata);
        setAllSciences(
          sciencesData.filter((e) => formatLink(e.title) !== formattedName)
        );
        if (fdata.length > 0) {
          const scienceId = Number(fdata[0]?.id);
          const depOfScience = departmentsData.filter(
            (e) => Number(e.fan) === scienceId
          );
          setDepartments(depOfScience);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api, name, t.fetchError]);

  const handleTopicChange = (topicId) => {
    setCheckedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkedTopics.length === 0) {
      alert(t.selectTopicError);
      return;
    }
    localStorage.setItem("checkedTopics", JSON.stringify(checkedTopics));
    navigate(`/sciences/${name}/test/${questionCount}/${time}`);
  };

  const reverseFormatLinkAndCapitalize = (text) => {
    return text
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) return <Loading />;

  return (
    <div id="science-detail" className={getLanguageClass()}>
      <div className={`science-detail-container ${getLanguageClass()}`}>
        <h1 className={getLanguageClass()}>{t.title(reverseFormatLinkAndCapitalize(name))}</h1>
        <div className={`detail-inner ${getLanguageClass()}`}>
          <h2 className={getLanguageClass()}>{t.settings}</h2>
          <div className={`linee ${getLanguageClass()}`}></div>
          {sciences.length > 0 ? (
            <>
              {sciences.map((item, index) => (
                <form onSubmit={handleSubmit} key={index} className={getLanguageClass()}>
                  <div className={`input-row ${getLanguageClass()}`}>
                    <span className={getLanguageClass()}>{t.selectSubject}</span>
                    <select
                      className={getLanguageClass()}
                      onChange={(e) => {
                        if (e.target.value) {
                          window.location.href = `/sciences/${formatLink(
                            e.target.value
                          )}`;
                        }
                      }}
                    >
                      <option value={item.title}>{item.title}</option>
                      {allSciences.map((science, index) => (
                        <option key={index} value={science.title}>
                          {science.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`input-row ${getLanguageClass()}`}>
                    <span className={getLanguageClass()}>{t.topics}</span>
                    <div className={`themes ${getLanguageClass()}`}>
                      {departments.length > 0 ? (
                        departments.map((dep, index) => (
                          <div className={`theme-row ${getLanguageClass()}`} key={index}>
                            <input
                              type="checkbox"
                              id={`input-${index}`}
                              checked={checkedTopics.includes(dep.id)}
                              onChange={() => handleTopicChange(dep.id)}
                              className={getLanguageClass()}
                            />
                            <label htmlFor={`input-${index}`} className={getLanguageClass()}>
                              {dep.title}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className={getLanguageClass()}>{t.noTopics}</p>
                      )}
                    </div>
                  </div>
                  <div className={`input-row ${getLanguageClass()}`}>
                    <span className={getLanguageClass()}>{t.duration}</span>
                    <label htmlFor="" className={`replaced-input ${getLanguageClass()}`}>
                      {t.minutes(time)}
                      <div className={`buttons ${getLanguageClass()}`}>
                        <span onClick={() => setTime(Math.max(5, time - 5))} className={getLanguageClass()}>
                          -
                        </span>
                        <span className={getLanguageClass()}>5</span>
                        <span onClick={() => setTime(Math.min(60, time + 5))} className={getLanguageClass()}>
                          +
                        </span>
                      </div>
                    </label>
                    <input
                      className={`d-none ${getLanguageClass()}`}
                      type="text"
                      value={time}
                      readOnly
                    />
                  </div>
                  <div className={`input-row ${getLanguageClass()}`}>
                    <span className={getLanguageClass()}>{t.questionCount}</span>
                    <label htmlFor="" className={`replaced-input ${getLanguageClass()}`}>
                      {t.questions(questionCount)}
                      <div className={`buttons ${getLanguageClass()}`}>
                        <span
                          onClick={() =>
                            setQuestionCount(Math.max(5, questionCount - 5))
                          }
                          className={getLanguageClass()}
                        >
                          -
                        </span>
                        <span className={getLanguageClass()}>5</span>
                        <span
                          onClick={() =>
                            setQuestionCount(Math.min(30, questionCount + 5))
                          }
                          className={getLanguageClass()}
                        >
                          +
                        </span>
                      </div>
                    </label>
                    <input
                      className={`d-none ${getLanguageClass()}`}
                      type="text"
                      value={questionCount}
                      readOnly
                    />
                  </div>
                  <div className={`input-row ${getLanguageClass()}`}>
                    <button type="submit" className={getLanguageClass()}>{t.startButton}</button>
                  </div>
                </form>
              ))}
            </>
          ) : (
            <div style={{textAlign: 'center'}} className={getLanguageClass()}>{t.noSubjects}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SciencesDetail;