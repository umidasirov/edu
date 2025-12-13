import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import Logo from "./Logo.png";
import profileImage from "../../assets/user.png";
import "./header.scss";
import SearchBtn from "../search-btn/searchBtn";
import "boxicons";
import LangSelector from "../langs/lang";

const Header = () => {
  const { access, success, setSuccess, profileData } = useContext(AccessContext);
  const [offcanvas, setOffCanvas] = useState(false);
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      navItems: [
        { name: "Bosh sahifa", link: "/" },
        { name: "Testlar", link: "/toifa-imtihonlari" },
        // { name: "Video kurslar", link: "/video-courses/" },
        { name: "Bog'lanish", link: "contact" },
      ],
      contact: "Bog'lanish",
      login: "Kirish",
      signup: "Ro'yxatdan o'tish",
      adminPanel: "Admin panel",
      personalCabinet: "Shaxsiy kabinet",
      marqueeText: "Platforma sinov tariqasida ishga tushirilgan",
      sum: "so'm",
    },
    kaa: {
      navItems: [
        { name: "Бас бет", link: "/" },
        { name: "Тестлер", link: "/toifa-imtihonlari" },
        // { name: "Пәнлер", link: "sciences/matematika" },
        { name: "Байланыс", link: "contact" }, // Qoraqalpoqcha - to'g'ri tarjima
      ],
      contact: "Байланыс",
      login: "Кириў",
      signup: "Дизимнен өтиў",
      adminPanel: "Админ панель",
      personalCabinet: "Жәнеки кабинет",
      marqueeText: "Платформа сынаў жолы менен исге түсирилди",
      sum: "сум",
    },
    ru: {
      navItems: [
        { name: "Главная", link: "/" },
        { name: "Тесты", link: "/toifa-imtihonlari" },
        // { name: "Предметы", link: "sciences/matematika" },
        { name: "Контакты", link: "contact" }, // Ruscha - to'g'ri tarjima
      ],
      contact: "Контакты",
      login: "Войти",
      signup: "Регистрация",
      adminPanel: "Админ панель",
      personalCabinet: "Личный кабинет",
      marqueeText: "Платформа запущена в тестовом режиме",
      sum: "сум",
    },
    en: {
      navItems: [
        { name: "Home", link: "/" },
        { name: "Tests", link: "/toifa-imtihonlari" },
        // { name: "Subjects", link: "sciences/matematika" },
        { name: "Contact", link: "sciences/matematika" },
      ],
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      adminPanel: "Admin panel",
      personalCabinet: "Personal cabinet",
      marqueeText: "The platform has been launched in test mode",
      sum: "sum",
    },
  };

  const t = translations[language] || translations["uz"];

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  const location = useLocation();
  const isTestsPage = location.pathname === "/signup";

  // Har bir matn elementi uchun class nomini aniqlash
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  return (
    <>
      <marquee className={`header-top ${getLanguageClass()}`} behavior="" direction="">
        <span className={getLanguageClass()}>{t.marqueeText}</span>
      </marquee>
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="nav-menu">
            <ul>
              {t.navItems.map((data, index) => (
                <li key={index}>
                  <NavLink
                    to={data.link}
                    className={({ isActive }) =>
                      `${isActive ? "active-link" : ""} ${getLanguageClass()}`
                    }
                  >
                    <span className={getLanguageClass()}>{data.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="search-signup">
            <LangSelector />
            {access ? (
              <div className="align-items">
                {success && (
                  <div
                    className={`header-success-message ${getLanguageClass()}`}
                    style={{ zIndex: 999999 }}
                  >
                    <span className={getLanguageClass()}>{success}</span>
                  </div>
                )}
                <Link to="/top-up-balance" className={`user-balance profile ${getLanguageClass()}`}>
                  <span className={getLanguageClass()}>
                    {new Intl.NumberFormat('ru-RU').format(profileData.balance || 0)} {t.sum}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="ionicon"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      fill="none"
                      stroke="currentColor"
                      stroke-miterlimit="10"
                      stroke-width="32"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                      d="M256 176v160M336 256H176"
                    />
                  </svg>
                </Link>
                <Link
                  className={`profile ${getLanguageClass()}`}
                  to={profileData.is_superuser ? "/admin/sciences/" : "profile"}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.23438 19.5C4.55979 17.2892 7.46466 15.7762 11.9967 15.7762C16.5286 15.7762 19.4335 17.2892 20.7589 19.5M15.5967 8.1C15.5967 10.0882 13.9849 11.7 11.9967 11.7C10.0084 11.7 8.39665 10.0882 8.39665 8.1C8.39665 6.11177 10.0084 4.5 11.9967 4.5C13.9849 4.5 15.5967 6.11177 15.5967 8.1Z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={getLanguageClass()}>
                    {profileData.is_superuser ? t.adminPanel : t.personalCabinet}
                  </span>
                </Link>
              </div>
            ) : (
              <>
                {isTestsPage || location.pathname === "/login" ? (
                  ""
                ) : (
                  <Link id="login" to="/login" className={getLanguageClass()}>
                    <span className={getLanguageClass()}>{t.login}</span>
                  </Link>
                )}
                <Link
                  id="signup"
                  to={isTestsPage ? "/login" : "/signup"}
                  className={getLanguageClass()}
                >
                  <span className={getLanguageClass()}>
                    {isTestsPage ? t.login : t.signup}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="menu-icon" onClick={() => setOffCanvas(true)}>
          <svg
            width="53"
            height="36"
            viewBox="0 0 53 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H49"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M4 18H49"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M4 32H49"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className={`menu-container ${offcanvas ? "active" : ""}`}>
          <ul>
            <li onClick={() => setOffCanvas(false)}>
              <box-icon name="plus" color="#fff"></box-icon>
            </li>
            {t.navItems.map((data, index) => (
              <li key={index} onClick={() => setOffCanvas(false)}>
                <NavLink
                  to={data.link}
                  className={({ isActive }) =>
                    `${isActive ? "active-link" : ""} ${getLanguageClass()}`
                  }
                >
                  <span className={getLanguageClass()}>{data.name}</span>
                </NavLink>
              </li>
            ))}
            {/* <li onClick={() => setOffCanvas(false)}>
              <a href="/#contact" className={getLanguageClass()}>
                <span className={getLanguageClass()}>{t.contact}</span>
              </a>
            </li> */}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;