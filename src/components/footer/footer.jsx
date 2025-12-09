import React from "react";
import { Link } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
  const language = localStorage.getItem("language") || "uz";
  
  const translations = {
    uz: {
      about: {
        title: "Biz haqimizda",
        links: [
          "Kompaniya haqida ma'lumot",
          "Foydalanuvchi shartnomasi",
          "Ijtimoiy tarmoqlarimiz"
        ]
      },
      sections: {
        title: "Bo'limlar",
        links: [
          "Bosh sahifa",
          "Testlar",
          "Yangiliklar",
          "Bog'lanish"
        ]
      },
      contact: {
        title: "Biz bilan aloqa",
        phone: "Tel:",
        email: "Email:"
      },
      rights: "All rights reserved"
    },
    kaa: {
      about: {
        title: "Биз ҳақымызда",
        links: [
          "Компания ҳаққында ма'lumot",
          "Пайдаланыўшы шарtнамаси",
          "Ижтимаий тармакларымыз"
        ]
      },
      sections: {
        title: "Бөлимлер",
        links: [
          "Бас бет",
          "Тестлер",
          "Жаңалықлар",
          "Байланыс"
        ]
      },
      contact: {
        title: "Биз менен алоқа",
        phone: "Тел:",
        email: "Эл. почта:"
      },
      rights: "Барлық құқықлар ҳуқук иеси тарафынан қорғалған"
    },
    ru: {
      about: {
        title: "О нас",
        links: [
          "Информация о компании",
          "Пользовательское соглашение",
          "Наши социальные сети"
        ]
      },
      sections: {
        title: "Разделы",
        links: [
          "Главная страница",
          "Тесты",
          "Новости",
          "Контакты"
        ]
      },
      contact: {
        title: "Свяжитесь с нами",
        phone: "Тел:",
        email: "Email:"
      },
      rights: "Все права защищены"
    },
    en: {
      about: {
        title: "About Us",
        links: [
          "Company information",
          "User agreement",
          "Our social networks"
        ]
      },
      sections: {
        title: "Sections",
        links: [
          "Home",
          "Tests",
          "News",
          "Contact"
        ]
      },
      contact: {
        title: "Contact Us",
        phone: "Phone:",
        email: "Email:"
      },
      rights: "All rights reserved"
    }
  };

  const t = translations[language] || translations["uz"];
  
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  return (
    <footer className={getLanguageClass()}>
      <div className={`line ${getLanguageClass()}`}></div>
      <div className={`footer-container ${getLanguageClass()}`}>
        <ul className={getLanguageClass()}>
          <h2 className={getLanguageClass()}>{t.about.title}</h2>
          {t.about.links.map((link, index) => (
            <li 
              key={index} 
              className={`${index === 0 ? 'first-child' : ''} ${getLanguageClass()}`}
            >
              <Link to="#" className={getLanguageClass()}>{link}</Link>
            </li>
          ))}
          <li className={`social-links ${getLanguageClass()}`}>
            <Link to="#" className={getLanguageClass()}>
              <img
                id="instagram"
                src="https://cdn-icons-png.flaticon.com/512/5968/5968776.png"
                alt=""
                className={getLanguageClass()}
              />
            </Link>
            <Link to="#" className={getLanguageClass()}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png"
                alt=""
                className={getLanguageClass()}
              />
            </Link>
            <Link to="#" className={getLanguageClass()}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/480px-2023_Facebook_icon.svg.png"
                alt=""
                className={getLanguageClass()}
              />
            </Link>
          </li>
        </ul>
        <ul className={getLanguageClass()}>
          <h2 className={getLanguageClass()}>{t.sections.title}</h2>
          {t.sections.links.map((link, index) => (
            <li 
              key={index} 
              className={`${index === 0 ? 'first-child' : ''} ${getLanguageClass()}`}
            >
              <Link 
                to={index === 0 ? "/" : 
                    index === 1 ? "/school/tests" : 
                    index === 2 ? "/news" : "/contact"} 
                className={getLanguageClass()}
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
        <ul className={getLanguageClass()}>
          <h2 className={getLanguageClass()}>{t.contact.title}</h2>
          <li className={getLanguageClass()}>
            {t.contact.phone} <a href="tel:+998953988198" className={getLanguageClass()}>+998 95 398 81 98</a>
          </li>
          <li className={getLanguageClass()}>
            {t.contact.email} <a href="mailto:info@edumark.uz" className={getLanguageClass()}>info@edumark.uz</a>
          </li>
        </ul>
      </div>
      <div className={`created-by ${getLanguageClass()}`}>
        {t.rights}
      </div>
    </footer>
  );
};

export default Footer;