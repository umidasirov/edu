import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./data.scss";
import bubbles from "./Bubbles.png";
import book from "./Book.png";
import threInOne from "./3in1.png";
import teacher from "./teacher.png";

const Data = () => {
  const [access, setAccess] = useState(false);
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      title: "Ma'lumot",
      heading: "Edu Mark sayti haqida batafsil ma'lumot",
      description: "Farzandingizning kelajagini biz bilan mustahkamlang! Maktabga tayyorgarlikning muhim bosqichi – sifatli ta'limdan boshlanadi. Bizning tayyorlov kurslarimiz bolangizning bilim va qobiliyatlarini rivojlantirishga, o'qish, yozish, mantiqiy fikrlash va mustaqil o'rganish ko'nikmalarini shakllantirishga yordam beradi.",
      usersTitle: "Sayt foydalanuvchilar ro'yxati",
      usersText: "Bu ro'yxatni ko'rish uchun admin bilan bog'lanishingiz zarur",
      details: "Batafsil",
      adminText: "Admin bilan bo'glanish uchun",
      click: "bosing",
      booksTitle: "Kitoblar",
      featureTitle: "Qulay va tushunarli",
      featureText: "Samarali va eco tizim barcha uchun tushunarli va qulay 24/7 ishlashingiz mumkin",
      questionsTitle: "Ustoz va adminlarga savollar bo'limi",
      questionsText: "Samarali va eco tizim barcha uchun tushunarli va qulay Samarali va eco tizim barcha uchun tushunarli va qulay"
    },
    kaa: {
      title: "Маълумот",
      heading: "Edu Mark сайты ҳаққылы батафсил маълумот",
      description: "Балаңыздың кележегин биз менен мустаҳкамлан! Мектепке даярлаўдың муһим баскычы – сапатлы таълимден башланады. Биздин даярлаў курсларымыз балаңыздың билим ҳәм қобилиятларын ривожландырыўға, оқыў, жазыў, мантиқий фикрлеў ҳәм мустақил үйрениў көникмелерин шаклландырыўға ярдам берады.",
      usersTitle: "Сайт пайдаланушылар рўйхаты",
      usersText: "Бул рўйхатты көриў үшін администратор менен байланысыңыз зарур",
      details: "Батафсил",
      adminText: "Администратор менен байланыс үшін",
      click: "басыңыз",
      booksTitle: "Китаплар",
      featureTitle: "Қулай ҳәм түсиникли",
      featureText: "Самарали ҳәм экологик тизим барша үшін түсиникли ҳәм қулай 24/7 ишлешиңиз мумкин",
      questionsTitle: "Устоз ҳәм администраторларға саволлар бөлими",
      questionsText: "Самарали ҳәм экологик тизим барша үшін түсиникли ҳәм қулай. Самарали ҳәм экологик тизим барша үшін түсиникли ҳәм қулай."
  },
    ru: {
      title: "Информация",
      heading: "Подробная информация о сайте Edu Mark",
      description: "Укрепите будущее вашего ребенка вместе с нами! Важный этап подготовки к школе начинается с качественного образования. Наши подготовительные курсы помогут развить знания и способности вашего ребенка, сформировать навыки чтения, письма, логического мышления и самостоятельного обучения.",
      usersTitle: "Список пользователей сайта",
      usersText: "Для просмотра этого списка необходимо связаться с администратором",
      details: "Подробнее",
      adminText: "Для связи с администратором",
      click: "нажмите",
      booksTitle: "Книги",
      featureTitle: "Удобный и понятный",
      featureText: "Эффективная и экологичная система понятна и удобна для всех, вы можете работать 24/7",
      questionsTitle: "Раздел вопросов для учителей и администраторов",
      questionsText: "Эффективная и экологичная система понятна и удобна для всех Эффективная и экологичная система понятна и удобна для всех"
    },
    en: {
      title: "Information",
      heading: "Detailed information about Edu Mark website",
      description: "Strengthen your child's future with us! The important stage of school preparation begins with quality education. Our preparatory courses will help develop your child's knowledge and abilities, form skills in reading, writing, logical thinking and independent learning.",
      usersTitle: "Site users list",
      usersText: "You need to contact the administrator to view this list",
      details: "Details",
      adminText: "To contact the administrator",
      click: "click",
      booksTitle: "Books",
      featureTitle: "Convenient and understandable",
      featureText: "Efficient and eco system is clear and convenient for everyone, you can work 24/7",
      questionsTitle: "Questions section for teachers and administrators",
      questionsText: "Efficient and eco system is clear and convenient for everyone Efficient and eco system is clear and convenient for everyone"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  useEffect(() => {
    const skeleton = document.querySelectorAll(".skeleton");
    window.addEventListener("load", () => {
      skeleton.forEach((item) => {
        item.classList.remove("skeleton");
      });
    });
  });

  return (
    <section id="data-section" className={getLanguageClass()}>
      <h1 id="text" className={getLanguageClass()}>{t.title}</h1>
      <div className={`data-container ${getLanguageClass()}`}>
        <div className={`data-item-1 ${getLanguageClass()}`}>
          <div className={`texts ${getLanguageClass()}`}>
            <h1 id="text-1" className={getLanguageClass()}>
              <span className={getLanguageClass()}>Edu</span> {t.heading.split(' ').slice(1).join(' ')}
            </h1>
            <p className={getLanguageClass()}>{t.description}</p>
          </div>
          <div className={`flex ${getLanguageClass()}`}>
            <div className={`data-item-1-inner-1 ${getLanguageClass()}`}>
              <h2 className={getLanguageClass()}>{t.usersTitle}</h2>
              <p className={getLanguageClass()}>
                <span className={getLanguageClass()}>{t.usersText}</span>
                <Link to="#" className={getLanguageClass()}>{t.details}</Link>
              </p>
              <div className={`skeleton-loading ${getLanguageClass()}`}>
                {access ? (
                  <>
                    <div className={`card-image ${getLanguageClass()}`}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
                        alt=""
                        className={getLanguageClass()}
                      />
                    </div>
                    <div className={`texts ${getLanguageClass()}`}>
                      <h3 className={getLanguageClass()}>Admin</h3>
                      <span className={getLanguageClass()}>
                        {t.adminText} <Link to="#" className={getLanguageClass()}>{t.click}</Link>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`card-image skeleton ${getLanguageClass()}`}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
                        alt=""
                        className={getLanguageClass()}
                      />
                    </div>
                    <div className={`texts ${getLanguageClass()}`}>
                      <h3 className={`skeleton ${getLanguageClass()}`}>Admin</h3>
                      <span className={`skeleton ${getLanguageClass()}`}>
                        {t.adminText} <Link to="#" className={getLanguageClass()}>{t.click}</Link>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={`data-item-1-inner-2 ${getLanguageClass()}`}>
              <h2 className={getLanguageClass()}>{t.booksTitle}</h2>
              <div className={`line ${getLanguageClass()}`}></div>
              <img id="book" src={book} alt="" className={getLanguageClass()}/>
              <img id="bubbles" src={bubbles} alt="" className={getLanguageClass()}/>
            </div>
          </div>
        </div>
        <div className={`data-item-2 ${getLanguageClass()}`}>
          <div className={`data-item-2-inner-1 ${getLanguageClass()}`}>
            <div className={`images-container ${getLanguageClass()}`}>
              <img src={threInOne} alt="" className={getLanguageClass()}/>
            </div>
            <h1 className={getLanguageClass()}>{t.featureTitle}</h1>
            <p className={getLanguageClass()}>{t.featureText}</p>
          </div>
          <div className={`data-item-2-inner-2 ${getLanguageClass()}`}>
            <div className={`inner-left ${getLanguageClass()}`}>
              <h1 className={getLanguageClass()}>{t.questionsTitle}</h1>
              <p className={getLanguageClass()}>{t.questionsText}</p>
            </div>
            <div className={`inner-right ${getLanguageClass()}`}>
              <img src={teacher} alt="" className={getLanguageClass()}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Data;