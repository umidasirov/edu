import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../App";
import "./paid_courses.scss";

const PaidCourses = () => {
  const [sciences, setSciences] = useState([]);
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      title: "Bepul testlar",
      courses: [
        {
          name: "Bepul testlar – bilimlaringizni sinovdan o‘tkazing!",
          description: "Eng sara saralangan testlar",
          amenities: [
            "Intellektual testlar – eng dolzarb va kerakli fanlardan tuzilgan.",
            "Har safar yangi savollar – randomizatsiya orqali testlar yangilanib turadi.",
            "Real imtihon muhiti – DTM va Prezident maktablari formatiga moslashtirilgan.",
            "Barcha fanlar qamrovi – Matematika, Ona tili, Ingliz tili, Tabiiy fanlar va boshqalar.",
          ],
          button: "Boshlash"
        },
        {
          name: "Saralangan testlar",
          description: "30 ta test savolidan iborat blokli testlar",
          amenities: [
            "Sara testlar — kuchli tayyorgarlik uchun!",
            "30 ta savoldan iborat blokli testlar — har biri o‘z faniga mos, aniq tuzilgan.",
            "\"Cambridge assessment\" xalqaro tashkiloti standartlariga mos — real imtihon formatida.",
            "Professional ustozlar tomonidan ishlab chiqilgan.Bepul va ochiq – har kim sinab ko‘rishi mumkin!"
          ],
          button: "Boshlash"
        }
      ]
    },
    kaa: {
      "title": "Тегис тестлер",
      "courses": [
        {
          "name": "Тегис тестлер – билимлеринъизди сынаўдан өткезиңиз!",
          "description": "Эң сара сараланған тестлер",
          "amenities": [
            "Интеллектуал тестлер – эң долзарб ва керекли фанлардан тузилған.",
            "Ҳар сафар яңы саўаллар – рандомизация арқалы тестлер яңыланады.",
            "Реал имтиҳан муҳити – ДТМ ва Президент мектеплери форматына мосластырылған.",
            "Барша фанлар қамровы – Математика, Ана тили, Ағылшын тили, Табиий фанлар ва башқалар."
          ],
          "button": "Башлаў"
        },
        {
          "name": "Сараланған тестлер",
          "description": "30 та тест саўалынан иборат блоқлы тестлер",
          "amenities": [
            "Сара тестлер — күшли тайяргарлық үшін!",
            "30 та саўалдан иборат блоқлы тестлер — ҳәр бири өз фанына мос, анық тузилған.",
            "\"Cambridge assessment\" халқара ташкилаты стандартларына мос — реал имтиҳан форматында.",
            "Профессионал устозлар томоннан ишлаб чиқылған. Тегис ва ашық — ҳәр ким сынап көре алады!"
          ],
          "button": "Башлаў"
        }
      ]
    },
    ru: {
      "title": "Бесплатные тесты",
      "courses": [
        {
          "name": "Бесплатные тесты – проверьте свои знания!",
          "description": "Лучшие отобранные тесты",
          "amenities": [
            "Интеллектуальные тесты – составлены из самых актуальных и нужных предметов.",
            "Новые вопросы каждый раз – тесты обновляются через рандомизацию.",
            "Реальная экзаменационная среда – адаптирована под формат DTM и Президентских школ.",
            "Охват всех предметов – Математика, Родной язык, Английский язык, Естественные науки и другие."
          ],
          "button": "Начать"
        },
        {
          "name": "Отобранные тесты",
          "description": "Блочные тесты из 30 вопросов",
          "amenities": [
            "Лучшие тесты – для сильной подготовки!",
            "Блочные тесты из 30 вопросов – каждый по своему предмету, четко структурированы.",
            "Соответствует стандартам международной организации \"Cambridge assessment\" – в формате реального экзамена.",
            "Разработаны профессиональными преподавателями. Бесплатно и открыто – каждый может попробовать!"
          ],
          "button": "Начать"
        }
      ]
    },
    en: {
      "title": "Free tests",
      "courses": [
        {
          "name": "Free tests – test your knowledge!",
          "description": "The best curated tests",
          "amenities": [
            "Intellectual tests – compiled from the most relevant and necessary subjects.",
            "New questions every time – tests are updated via randomization.",
            "Real exam environment – adapted to the format of DTM and Presidential Schools.",
            "Coverage of all subjects – Mathematics, Native Language, English, Natural Sciences, and others."
          ],
          "button": "Start"
        },
        {
          "name": "Selected tests",
          "description": "Block tests consisting of 30 questions",
          "amenities": [
            "Premium tests – for strong preparation!",
            "Block tests of 30 questions – each tailored to its subject, clearly structured.",
            "Aligned with \"Cambridge assessment\" international standards – in a real exam format.",
            "Developed by professional teachers. Free and open – anyone can try!"
          ],
          "button": "Start"
        }
      ]
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sciencesResponse = await fetch(`${api}/fan/`);
        if (!sciencesResponse.ok) {
          throw new Error("Network error");
        }
        const sciencesData = await sciencesResponse.json();
        setSciences(sciencesData);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [api]);

  const formatLink = (text) => {
    return text.replace(/'/g, "").replace(/\s+/g, "-").toLowerCase();
  };

  const data = [
    {
      image: "https://www.figma.com/file/4YhRxQJ08I87UzgBVKolGq/image/e9f6f914ff96905cfa66f84d9884c3f30c15423a",
      fan_name: t.courses[0].name,
      fan_description: t.courses[0].description,
      amenities: t.courses[0].amenities,
      link: sciences.length > 0 ? `/sciences/${formatLink(sciences[0].title)}` : "#"
    },
    {
      image: "https://www.figma.com/file/4YhRxQJ08I87UzgBVKolGq/image/e9f6f914ff96905cfa66f84d9884c3f30c15423a",
      fan_name: t.courses[1].name,
      fan_description: t.courses[1].description,
      amenities: t.courses[1].amenities,
      link: sciences.length > 0 ? `/sciences/${formatLink(sciences[0].title)}` : "#"
    }
  ];

  // Format amenity text to bold part before dash
  const formatAmenity = (text) => {
    const delimiters = [" — ", " - ", " – ", "—"];
    for (const delimiter of delimiters) {
      const parts = text.split(delimiter);
      if (parts.length > 1) {
        return (
          <>
            <span className={getLanguageClass()}>{parts[0]}</span>{delimiter}{parts.slice(1).join(delimiter)}
          </>
        );
      }
    }
    return text;
  };

  return (
    <section id="paid-courses-section" className={getLanguageClass()}>
      <h1 className={getLanguageClass()}>
        <span className={getLanguageClass()}>{t.title.split(' ')[0]}</span> {t.title.split(' ').slice(1).join(' ')}
      </h1>
      <div className={`paid-courses-container ${getLanguageClass()}`}>
        {data.map((item, index) => (
          <div className={`container-item ${getLanguageClass()}`} key={index}>
            <div className={`item-header ${getLanguageClass()}`}>
              <img src={item.image} alt="" className={getLanguageClass()} />
              <div className={`item-text ${getLanguageClass()}`}>
                <h2 className={getLanguageClass()}>{item.fan_name}</h2>
                <p className={getLanguageClass()}>{item.fan_description}</p>
              </div>
            </div>
            <ul className={getLanguageClass()}>
              {item.amenities.map((amenity, i) => (
                <li key={i} className={getLanguageClass()}>
                  <img
                    src="https://www.figma.com/file/4YhRxQJ08I87UzgBVKolGq/image/3e1e7bd21622434cb4da159751b4b4d97e89fae6"
                    alt=""
                    className={getLanguageClass()}
                  />
                  <p className={getLanguageClass()}>{formatAmenity(amenity)}</p>
                </li>
              ))}
            </ul>
            <Link to={item.link} className={getLanguageClass()}>
              {t.courses[index].button}
              <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 12-6-6m6 6-6 6m6-6H5" /></svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaidCourses;