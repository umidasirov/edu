import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { api } from "../../App";
import "./high-rating.scss";
import rating from "./rating.png";
import active_users from "./active-users.jpg";
import big_boy from "./3.jpg";

const High_rating = () => {
  const language = localStorage.getItem("language") || "uz";

const translations = {
  uz: {
    heading: "Ustozlar reytingi",
    description:
      "Bu bo‘limda platformamizdagi eng faol, bilimli va yuksak natijalarga erishgan ustozlar ro‘yxati jamlangan. Siz ham muntazam rivojlansangiz, ushbu ro‘yxatdan munosib o‘rin olishingiz mumkin!",
    knowledgeTitle: "Bilim va malaka",
    knowledgeText:
      "📘 Bilim va malaka — ustozning kasbiy yuksalishi uchun mustahkam poydevor. Pedagogning o‘z ustida ishlashi dars sifati va ta’lim jarayonining samaradorligini oshiradi. Biz sizning dars berish, tahlil qilish, kommunikatsiya va metodik yondashuv kabi ko‘nikmalaringizni rivojlantirishga xizmat qiladigan interaktiv vositalarni taqdim etamiz.",
    features: [
      "Interaktiv metodik materiallar — zamonaviy ta’limga mos darslar va testlar",
      "Tajribali mutaxassislar maslahatlari — ustozning kasbiy o‘sishini qo‘llab-quvvatlash",
      "Individual rivojlanish rejasi — o‘z tezligingizda samarali o‘qish imkoniyati",
      "Bilimlarni amalda qo‘llash",
      "Kasbiy rivoj uchun amaliy topshiriqlar",
      "Sog‘lom ish uslubi"
    ],
    moreBtn: "Ko'proq",
    startTestBtn: "Sinovni boshlash"
  },

  kaa: {
    heading: "Устазлар рейтинги",
    description:
      "Бу жерде платформамыздағы ең фаол, билимли және жоқарғы натижелерге жеткен устазлар тізими берилген. Сиз де өз үстіңізде ишлеп, бу тізимнен лайықлы орын алыўыңыз мүмкин!",
    knowledgeTitle: "Билим және малака",
    knowledgeText:
      "📘 Билим және малака — устаздың касбий өсиўи ушын мықты пойдевор. Педагогтың өз устинде даўамлы ишлеўи дарс сапасын және оқуў жараянының самарадорлығын арттырады. Биз сиздиң оқытыў, анализлеў, мулақат және методикалық усыллар бойынша қобилетлериңизди ривожландырыўға ярдам беретуғын интерактив материалларды усынамыз.",
    features: [
      "Интерактив методикалық материаллар — заманагөй талапларға лайық дарстар және тестлер",
      "Тәжрийбели мутахассислер кеңеси — устаздың касбий өсиўин қоллап-қуатлаў",
      "Индивидуал өсиў жоспары — өз тезлигиңизде самаралы үйрениў имканияты",
      "Билимлерди амалда қолланыў",
      "Касбий өсиў ушын амали tapsırıqlar",
      "Соғлом иш услығы"
    ],
    moreBtn: "Көпрок",
    startTestBtn: "Сынаўды башлаў"
  },

  ru: {
    heading: "Рейтинг преподавателей",
    description:
      "Здесь представлен список самых активных, компетентных и добившихся высоких результатов преподавателей нашей платформы. Если вы будете развиваться и работать над собой, вы также сможете занять достойное место в этом списке!",
    knowledgeTitle: "Знания и квалификация",
    knowledgeText:
      "📘 Знания и профессиональные навыки — прочный фундамент для роста педагога. Постоянное саморазвитие повышает эффективность занятий и качество образовательного процесса. Мы предоставляем интерактивные инструменты, которые помогают развивать ваши навыки преподавания, анализа, общения и методического подхода.",
    features: [
      "Интерактивные методические материалы — уроки и тесты, соответствующие современным требованиям",
      "Консультации опытных специалистов — поддержка вашего профессионального роста",
      "Индивидуальные планы развития — обучение в удобном темпе",
      "Практическое применение знаний",
      "Практические задания для повышения квалификации",
      "Здоровые и эффективные рабочие привычки"
    ],
    moreBtn: "Подробнее",
    startTestBtn: "Начать тест"
  },

  en: {
    heading: "Teachers Rating",
    description:
      "Here you can see the list of the most active, knowledgeable, and high-achieving teachers on our platform. With continuous self-development, you can also earn your place among the best!",
    knowledgeTitle: "Knowledge and Qualification",
    knowledgeText:
      "📘 Knowledge and professional skills are the foundation of a teacher’s career growth. Continuous improvement enhances class effectiveness and the overall quality of education. We provide interactive tools designed to develop your teaching, analytical, communication, and methodological abilities.",
    features: [
      "Interactive methodological materials — lessons and tests aligned with modern educational standards",
      "Guidance from experienced specialists — support for your professional development",
      "Individual development plans — learn at your own pace",
      "Application of knowledge in practice",
      "Practical tasks for skill improvement",
      "Healthy and productive work habits"
    ],
    moreBtn: "More",
    startTestBtn: "Start Test"
  }
};


  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  const pupils = [
    { name: "Sardor Qobulov", percent: "97" },
    { name: "Ali Shokirov", percent: "96" },
    { name: "Akmal G'ayratov", percent: "93" }
  ]

  // State to track which features are expanded
  const [expandedFeatures, setExpandedFeatures] = useState([]);

  // Toggle feature expansion
  const toggleFeature = (index) => {
    if (expandedFeatures.includes(index)) {
      setExpandedFeatures(expandedFeatures.filter(i => i !== index));
    } else {
      setExpandedFeatures([...expandedFeatures, index]);
    }
  };

  // Function to split feature text at the first dash-like character
  const splitFeature = (feature) => {
    const delimiters = [" – ", " - ", " — ", "—", "–"];
    for (const delimiter of delimiters) {
      const index = feature.indexOf(delimiter);
      if (index > -1) {
        return {
          before: feature.substring(0, index),
          after: feature.substring(index + delimiter.length)
        };
      }
    }
    return { before: feature, after: "" };
  };

  return (
    <section id="high-section" className={getLanguageClass()}>
      <div className={`for-with ${getLanguageClass()}`}>
        <h1 id="heading-1" className={getLanguageClass()}>
          {t.heading} <img src={rating} alt="" className={getLanguageClass()} />
        </h1>
        <p id="text-1" className={getLanguageClass()}>
          {t.description}
        </p>

        <div className={`pupils-container ${getLanguageClass()}`}>
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className={`mySwiper ${getLanguageClass()}`}
            breakpoints={{
              0: { slidesPerView: 1 },
              400: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {pupils.map((data, index) => (
              <SwiperSlide key={index} className={getLanguageClass()}>
                <div className={`pupils-item ${getLanguageClass()}`}>
                  <img src={active_users} alt="" className={getLanguageClass()} />
                  <p className={`active-user-name ${getLanguageClass()}`}>{data.name}</p>
                  <span className={`his-percent ${getLanguageClass()}`}>{data.percent}%</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={`pupils-news-container ${getLanguageClass()}`}>
          <div className={`news-inner-1 ${getLanguageClass()}`}>
            <h1 className={getLanguageClass()}>{t.knowledgeTitle}</h1>
            <p className={getLanguageClass()}>
              {t.knowledgeText}
            </p>
            <div className={`spans ${getLanguageClass()}`}>
              {t.features.slice(0, 3).map((feature, index) => {
                const { before, after } = splitFeature(feature);
                return (
                  <div
                    className={`feature-container ${getLanguageClass()} ${expandedFeatures.includes(index) ? 'expanded' : ''}`}
                    key={index}
                  >
                    <span
                      className={`span ${getLanguageClass()}`}
                      onClick={() => toggleFeature(index)}
                    >
                      <div className={`green`}></div>
                      <p className={`${getLanguageClass()} lin`}>
                      <p className={`${getLanguageClass()} qal`}>{before}</p>
                        <span className="toggle-indicator">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`ionicon ${expandedFeatures.includes(index) ? "active" : ""}`} viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 112v288M400 256H112" /></svg>
                        </span>
                      </p>
                    </span>
                    <div className={`feature-details ${getLanguageClass()} ${after && expandedFeatures.includes(index) ? "active" : ""}`}>
                      {after}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`news-inner-2 ${getLanguageClass()}`}>
            <img src={big_boy} alt="" className={getLanguageClass()} />
          </div>
          <div className={`toplam ${getLanguageClass()}`}>
          <div className={`spans mobile-version ${getLanguageClass()}`}>
              {t.features.slice(0, 3).map((feature, index) => {
                const { before, after } = splitFeature(feature);
                return (
                  <div
                    className={`feature-container ${getLanguageClass()} ${expandedFeatures.includes(index) ? 'expanded' : ''}`}
                    key={index}
                  >
                    <span
                      className={`span ${getLanguageClass()}`}
                      onClick={() => toggleFeature(index)}
                    >
                      <div className={`green ${getLanguageClass()}`}></div>
                      <p className={`${getLanguageClass()} lin`}>
                        <p className={`${getLanguageClass()} qal`}>{before}</p>
                        <span className="toggle-indicator">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`ionicon ${expandedFeatures.includes(index) ? "active" : ""}`} viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 112v288M400 256H112" /></svg>
                        </span>
                      </p>
                    </span>
                    <div className={`feature-details ${getLanguageClass()} ${after && expandedFeatures.includes(index) ? "active" : ""}`}>
                      {after}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <Link
              to="/schools/prezident-maktablari"
              className={`more-btn-link mobile-version ${getLanguageClass()}`}
            >
              {t.startTestBtn}
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default High_rating;