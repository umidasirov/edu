import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AccessContext } from "../../AccessContext";

// Styles
import "./for-students.scss";

// Images
import arrow from "./arrow.png";
import duble_arrow from "./duble-arrow.png";
import bg from "./Rectangle 4.png";
import boy from "./Download_premium_png_of_PNG_Reading_holding_student_book_by_Ketsarin_about_student_png__student__document__student_kid_png__and_boy_12086883-removebg-preview 1.png";
import qiyshiq_arrow from "./arr.png";
import arr2 from "./arr2.png";
import green_point from "./green_point.png";
import active_user from "./active-users.jpg";

const ForStudents = () => {
  const isDisabled = true;
  const { access, allUsers } = useContext(AccessContext);
  const [count, setCount] = useState(0);

  const language = localStorage.getItem("language") || "uz";

const translations = {
  uz: {
    heading: "O‘qituvchilar uchun eng sifatli, amaliy va real attestatsiya imtihonlariga mos testlar",
    description:
      "Barcha fan o‘qituvchilari uchun malaka (toifa) attestatsiyasiga tayyorlov va o'z bilimlarini baholash jarayonlari uchun kerakli testlar — barchasi bir platformada.",
    buttonDetails: "Batafsil",
    buttonStart: "Testni boshlash",
    login: "Kirish",
    signup: "Ro'yxatdan o'tish",
    userCountLabel: "Foydalanuvchilar",
    features: [
      "Attestatsiya uchun qulay va tushunarli testlar",
      "Barcha fan o‘qituvchilari uchun mos",
      "Bilimingizni oshiring, mustahkamlang va natijani ko'rsating",
    ],
  },

  kaa: {
    heading:
      "Оқытыўшылар үшин ең сапалы, амалий және реал аттестация имтиханларына мос тестлер",
    description:
      "Барлық оқытыўшыларға мос. Таийфе (аттестация) имтиханлары, қайта даярлаў және бағалау процессине арналған тестлер — һәммеси бир платформада.",
    buttonDetails: "Батафсил",
    buttonStart: "Тестти бастаў",
    login: "Кириў",
    signup: "Рўйхаттан өтиў",
    userCountLabel: "Пайдаланушылар",
    features: [
      "Аттестация ушын қулай және түшинирли тестлер",
      "Барлық пән оқытыўшыларға мос",
      "Билимиңди арттыр, мустаһкамла һәм натижәңди көзет",
    ],
  },

  ru: {
    heading:
      "Качественные, практичные и соответствующие реальным аттестационным экзаменам тесты",
    description:
      "Подходит для всех учителейНеобходимые тесты для подготовки к аттестации квалификации (категории) для всех учителей-предметников и процессы оценки их знаний-все на одной платформе. Тесты для прохождения квалификационной аттестации, повышения категории и повторной подготовки — всё на одной платформе.",
    buttonDetails: "Подробнее",
    buttonStart: "Начать тест",
    login: "Вход",
    signup: "Регистрация",
    userCountLabel: "Пользователи",
    features: [
      "Удобные и понятные тесты для аттестации",
      "Подходит для учителей всех предметов",
      "Повышайте знания, укрепляйте их и отслеживайте результаты",
    ],
  },

  en: {
    heading: "High-quality, practical, and teacher-certification-aligned test collections",
    description:
      "Necessary tests for the preparation of qualification (category) certificates for all science teachers and their knowledge assessment processes - all on one platform.",
    buttonDetails: "Details",
    buttonStart: "Start Test",
    login: "Login",
    signup: "Sign Up",
    userCountLabel: "Users",
    features: [
      "Easy and clear tests for certification",
      "Suitable for teachers of all subjects",
      "Improve your knowledge, strengthen it, track your results",
    ],
  },
};


  const t = translations[language] || translations["uz"];

  // Function to determine if we should add 'ru' class
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount >= allUsers.user_count) {
          clearInterval(interval);
          return allUsers.user_count;
        }
        return prevCount + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [allUsers.user_count]);

  return (
    <section className={`firstSection ${getLanguageClass()}`}>
      <div className={`big-container ${getLanguageClass()}`}>
        <h1 className={getLanguageClass()}>
          <span className={getLanguageClass()}>
            {t.heading.split(" ").slice(0, 2).join(" ")}
          </span>{" "}
          <span className={getLanguageClass()}>
            {t.heading.split(" ").slice(2).join(" ")}
          </span>
        </h1>

        <p id="text-1" className={getLanguageClass()}>
          {t.subHeading}
        </p>
        <div className={`container ${getLanguageClass()}`}>
          <div className={`container-item container-item-first ${getLanguageClass()}`}>
            <p id="text-2" className={getLanguageClass()}>
              <span className={getLanguageClass()}>{t.description}</span>
              <img src={arrow} alt="" />
            </p>

            <div className={`container-item-links ${getLanguageClass()}`}>
              {access ? (
                <>
                  <a href="#subject-tests" className={getLanguageClass()}>
                    <span className={getLanguageClass()}>{t.buttonStart}</span>
                  </a>
                </>
              ) : (
                <>
                  <Link to="/login" className={getLanguageClass()}>
                    <span className={getLanguageClass()}>{t.login}</span>
                  </Link>
                  <Link
                    to="/signup"
                    className={getLanguageClass()}
                  >
                    <span className={getLanguageClass()}>{t.signup}</span>
                  </Link>
                </>
              )}
            </div>
            <img id="duble-arrow" src={duble_arrow} alt="" />
          </div>
          <div className={`container-item container-item-second ${getLanguageClass()}`}>
            <img src={bg} alt="" />
            <div className="boy-image">
              <img src={boy} alt="" />
            </div>
          </div>
          <div className={`container-item container-item-third ${getLanguageClass()}`}>
            <img
              id="arr"
              className={language === "ru" ? "rutop-1" : (language === "kaa" ? "kaatop-1" : "")}
              src={qiyshiq_arrow}
              alt=""
            />
            <img id="arr2" className={`${language === "ru" ? "rutop-2" : (language === "kaa" ? "kaatop-2" : "")} ${language === "en" ? "en-top" : ""}`} src={arr2} alt="" />
            <div className={`green-texts ${getLanguageClass()} ${language === "ru" ? "rutop-3" : (language === "kaa" ? "kaatop-3" : "")}`}>
              {t.features.map((title, index) => (
                <span key={index} className={getLanguageClass()}>
                  <img src={green_point} alt="" />
                  <span className={getLanguageClass()}>{title}</span>
                </span>
              ))}
            </div>
            <div className={`active-users ${getLanguageClass()} ${language === "ru" ? "rutop-4" : (language === "kaa" ? "kaatop-4" : "")}`}>
              <div className={`users-image ${getLanguageClass()}`}>
                <img src={active_user} alt="" />
                <img src={active_user} alt="" />
                <img src={active_user} alt="" />
              </div>
              <div className={`users-count ${getLanguageClass()}`}>
                <h2 className={getLanguageClass()}>
                  {count > 10 ? `${count}+` : count}
                </h2>
                <p className={getLanguageClass()}>
                  {t.userCountLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForStudents;