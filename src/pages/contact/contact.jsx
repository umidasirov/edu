import React from "react";
import "./contact.scss";
import { Link } from "react-router-dom";
import tg from "../../assets/tg.png";

const Contact = () => {
  const language = localStorage.getItem("language") || "uz";
  
  const translations = {
    uz: {
      title: "Bog'lanish",
      form: {
        firstName: "Ism",
        lastName: "Familiya",
        email: "Email",
        question: "Savol:",
        submit: "Jo'natish"
      },
      contactInfo: {
        address: "Manzil:",
        addressText: "O'zbekiston, Toshkent shahri, Mustaqillik ko'chasi, 12-uy",
        phone: "Telefon:",
        phoneText: "+998 95 398 81 98",
        email: "Email:",
        emailText: "info@edumark.uz",
        message: "Biz bilan bog'laning - har qanday savollaringizga mamnuniyat bilan javob beramiz! 😊",
        telegram: "Telegram orqali bog'lanish"
      }
    },
    kaa: {
      title: "Байланыс",
      form: {
        firstName: "Аты",
        lastName: "Фамилиясы",
        email: "Эл. почта",
        question: "Сұрау:",
        submit: "Жөнетў"
      },
      contactInfo: {
        address: "Мәнзил:",
        addressText: "Ўзбекистон, Ташкент қаласы, Мустақиллик көшеўси, 12-үй",
        phone: "Телефон:",
        phoneText: "+998 95 398 81 98",
        email: "Эл. почта:",
        emailText: "info@edumark.uz",
        message: "Биз менен байланысыңыз – ҳәр ќандай сұраўларыңызға мәмнүнийет менен жауап беремиз! 😊",
        telegram: "Telegram арқалы байланысыў"
      }
    },    
    ru: {
      title: "Контакты",
      form: {
        firstName: "Имя",
        lastName: "Фамилия",
        email: "Email",
        question: "Вопрос:",
        submit: "Отправить"
      },
      contactInfo: {
        address: "Адрес:",
        addressText: "Узбекистан, город Ташкент, улица Мустакиллик, дом 12",
        phone: "Телефон:",
        phoneText: "+998 95 398 81 98",
        email: "Email:",
        emailText: "info@edumark.uz",
        message: "Свяжитесь с нами - мы с радостью ответим на любые ваши вопросы! 😊",
        telegram: "Связаться через Telegram"
      }
    },
    en: {
      title: "Contact",
      form: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        question: "Question:",
        submit: "Submit"
      },
      contactInfo: {
        address: "Address:",
        addressText: "Uzbekistan, Tashkent city, Mustaqillik street, house 12",
        phone: "Phone:",
        phoneText: "+998 95 398 81 98",
        email: "Email:",
        emailText: "info@edumark.uz",
        message: "Contact us - we'll be happy to answer any of your questions! 😊",
        telegram: "Contact via Telegram"
      }
    }
  };

  const t = translations[language] || translations["uz"];
  
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  return (
    <div id="contact" className={getLanguageClass()}>
      <h1 className={getLanguageClass()}>{t.title}</h1>
      <div className={`contact-inner ${getLanguageClass()}`}>
        <div className={`contact-inner-left ${getLanguageClass()}`}>
          <form action="">
            <div className={`input-row w-50 ${getLanguageClass()}`}>
              <input type="text" placeholder={t.form.firstName} required className={getLanguageClass()}/>
            </div>
            <div className={`input-row w-50 ${getLanguageClass()}`}>
              <input type="text" placeholder={t.form.lastName} required className={getLanguageClass()}/>
            </div>
            <div className={`input-row ${getLanguageClass()}`}>
              <input type="email" placeholder={t.form.email} required className={getLanguageClass()}/>
            </div>
            <div className={`input-row ${getLanguageClass()}`}>
              <textarea name="" id="" placeholder={t.form.question} className={getLanguageClass()}></textarea>
            </div>
            <div className={`input-row btn ${getLanguageClass()}`}>
              <button className={getLanguageClass()}>{t.form.submit}</button>
            </div>
          </form>
        </div>
        <div className={`contact-inner-right ${getLanguageClass()}`}>
          <p className={getLanguageClass()}>
            <span className={getLanguageClass()}>{t.contactInfo.address}</span> {t.contactInfo.addressText}
          </p>
          <p className={getLanguageClass()}>
            <span className={getLanguageClass()}>{t.contactInfo.phone}</span> {t.contactInfo.phoneText}
          </p>
          <p className={getLanguageClass()}>
            <span className={getLanguageClass()}>{t.contactInfo.email}</span> {t.contactInfo.emailText}
          </p>
          <p className={getLanguageClass()}>
            {t.contactInfo.message}
          </p>
          <Link to="https://t.me/" className={getLanguageClass()}>
            <img src={tg} alt="" className={getLanguageClass()}/> {t.contactInfo.telegram}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;