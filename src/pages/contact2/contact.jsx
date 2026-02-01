import React, { useContext, useState } from 'react';
import "./contact.scss";
import { Link } from 'react-router-dom';
import InputMask from "react-input-mask";
import { api } from '../../App';
import { AccessContext } from '../../AccessContext';


const Contact = ({ isHomepage = false }) => {
    const language = localStorage.getItem('language') || 'uz';
    const [phone, setPhone] = useState("");
    const translations = {
        kaa: {
            title: "Биз билан байланысыңыз",
            description: "Сиз бизге қандай да бір саволларингиз бўлса, ёки хизматимиз хақида қўшимча маълумот олмоқчи бўлсангиз, қуйидаги воситалар орқали биз билан боғланишингиз мумкин.",
            getInTouch: "Байланыс жасау",
            touchDesc: "Биз сизнинг саволларингизга жавоб бериш ва сизга кўмаклашиш учун дайимимз. Исталган вақт биз билан боғланишингиз мумкин.",
            address: "Адрес",
            location: "Тошкент шахар, Мирзо Улуғбек тумани, Университет кўчаси, 45-уй",
            phone: "Телефон номер",
            phoneNumber: "+998 95 398 81 98",
            email: "Электрон почта",
            emailAddress: "info@edumark.uz",
            bot: "Телеграм бот",
            botAddress: "@Edumarksupportbot",
            sendMessage: "Хабар жөнелтеу",
            namePlaceholder: "Аты-жөни *",
            emailPlaceholder: "Tелеграм почта манзили",
            messagePlaceholder: "Хабарингизни бу ерга ёзинг",
            submit: "Жөнелтеу",
            sending: "Жіберілуде...",
            successMessage: "Хабар сәтті жіберілді!",
            errorMessage: "Хабар жіберу кезінде қате орын алды!",
            networkError: "Желі қатесі. Кейінірек қайталап көріңіз."
        },
        ru: {
            title: "Свяжитесь с нами",
            description: "Если у вас есть какие-либо вопросы или вы хотите получить дополнительную информацию о наших услугах, вы можете связаться с нами следующими способами.",
            getInTouch: "Связаться",
            touchDesc: "Мы всегда готовы ответить на ваши вопросы и помочь вам. Вы можете связаться с нами в любое время.",
            address: "Адрес",
            location: "г. Ташкент, Мирзо Улугбекский район, ул. Университетская, дом 45",
            phone: "Телефон",
            phoneNumber: "+998 95 398 81 98",
            email: "Электронная почта",
            emailAddress: "info@edumark.uz",
            bot: "Телеграм бот",
            botAddress: "@Edumarksupportbot",
            sendMessage: "Отправить сообщение",
            namePlaceholder: "Ваше имя *",
            emailPlaceholder: "Адрес телеграм почты",
            messagePlaceholder: "Напишите ваше сообщение здесь",
            submit: "Отправить",
            sending: "Отправка...",
            successMessage: "Сообщение успешно отправлено!",
            errorMessage: "Произошла ошибка при отправке сообщения!",
            networkError: "Ошибка сети. Пожалуйста, попробуйте позже."
        },
        uz: {
            title: "Biz bilan bog'laning",
            description: "Agar sizda biron bir savollaringiz bo'lsa yoki xizmatlarimiz haqida qo'shimcha ma'lumot olishni istasangiz, quyidagi vositalar orqali biz bilan bog'lanishingiz mumkin.",
            getInTouch: "Bog'lanish",
            touchDesc: "Biz sizning savollaringizga javob berish va sizga yordam berish uchun doimo tayyormiz. Istalgan vaqt biz bilan bog'lanishingiz mumkin.",
            address: "Manzil",
            location: "Toshkent shahar, Mirzo Ulug'bek tumani, Universitet ko'chasi, 45-uy",
            phone: "Telefon raqam",
            phoneNumber: "+998 95 398 81 98",
            email: "Elektron pochta",
            emailAddress: "info@edumark.uz",
            bot: "Telegram bot",
            botAddress: "@Edumarksupportbot",
            sendMessage: "Xabar yuborish",
            namePlaceholder: "Ismingiz *",
            emailPlaceholder: "Telegram manzili",
            messagePlaceholder: "Xabaringizni shu yerga yozing",
            submit: "Yuborish",
            sending: "Yuborilmoqda...",
            successMessage: "Xabar muvaffaqiyatli yuborildi!",
            errorMessage: "Xabar yuborishda xatolik yuzaga keldi!",
            networkError: "Tarmoq xatosi. Iltimos, keyinroq qayta urinib ko'ring."
        },
        en: {
            title: "Contact Us",
            description: "If you have any questions or would like to get more information about our services, you can contact us through the following methods.",
            getInTouch: "Get In Touch",
            touchDesc: "We are always ready to answer your questions and assist you. You can contact us at any time.",
            address: "Address",
            location: "Tashkent city, Mirzo Ulugbek district, Universitetskaya street, house 45",
            phone: "Phone Number",
            phoneNumber: "+998 95 398 81 98",
            email: "E-mail",
            emailAddress: "info@edumark.uz",
            bot: "Telegram Bot",
            botAddress: "@Edumarksupportbot",
            sendMessage: "Send a Message",
            namePlaceholder: "Your Name *",
            emailPlaceholder: "Telegram Address",
            messagePlaceholder: "Write your message here",
            submit: "Submit",
            sending: "Sending...",
            successMessage: "Message sent successfully!",
            errorMessage: "Error occurred while sending message!",
            networkError: "Network error. Please try again later."
        }
    };
    const {
    profileData,
  } = useContext(AccessContext);

    const t = translations[language] || translations.uz;
    const isCyrillic = ['kaa', 'ru'].includes(language);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [msgLoad, setMsgLoad] = useState(false);

    function normalizePhoneNumber(phone) {
        return phone.replace(/[^\d]/g, '');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // setMsgLoad(true)
        const data = {
            user_id: profileData.id || null,
            ism: name,
            telefon: normalizePhoneNumber(phone),
            xabar: message,
        }
        // console.log(JSON.stringify({
        //             ...data
        //         }));
        try {
            const response = await fetch(`${api}/users/support/send/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    ...data
                }),
            });

            if (response.ok) {
                setSuccess(t.successMessage)
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
            } else {
                setError(t.errorMessage)
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError(t.networkError);
        } finally {
            setMsgLoad(false)
        }
    };

    const getLanguageClass = () => {
        return language === "ru" || language === "kaa" ? "ru" : "";
    };

    return (
        <div id='contact-2' className={isCyrillic ? 'ru' : ''}>
            <h1 className={`title ${isCyrillic ? 'ru' : ''} ${isHomepage ? 'dn' : ''}`}>{t.title}</h1>
            <p className={`des ${isCyrillic ? 'ru' : ''} ${isHomepage ? 'dn' : ''}`}>{t.description}</p>

            <div className={`cont-bg ${isHomepage ? "dn" : ""}`}>
                <div className={`contact-cont ${isHomepage ? "dn" : ""}`}>
                    <div className="cont-left">
                        <h1 className={isCyrillic ? 'ru' : ''}>{t.getInTouch}</h1>
                        <p id='des' className={isCyrillic ? 'ru' : ''}>{t.touchDesc}</p>

                        <ul>
                            <li>
                                <Link to="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                                        <path d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                                        <circle cx="256" cy="192" r="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                                    </svg>
                                    <div className={`cont-text ${isCyrillic ? 'ru' : ''}`}>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.address}</p>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.location}</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="tel:+998 95 398 81 98">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                                        <path d="M451 374c-15.88-16-54.34-39.35-73-48.76-24.3-12.24-26.3-13.24-45.4.95-12.74 9.47-21.21 17.93-36.12 14.75s-47.31-21.11-75.68-49.39-47.34-61.62-50.53-76.48 5.41-23.23 14.79-36c13.22-18 12.22-21 .92-45.3-8.81-18.9-32.84-57-48.9-72.8C119.9 44 119.9 47 108.83 51.6A160.15 160.15 0 0083 65.37C67 76 58.12 84.83 51.91 98.1s-9 44.38 23.07 102.64 54.57 88.05 101.14 134.49S258.5 406.64 310.85 436c64.76 36.27 89.6 29.2 102.91 23s22.18-15 32.83-31a159.09 159.09 0 0013.8-25.8C465 391.17 468 391.17 451 374z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />
                                    </svg>
                                    <div className={`cont-text ${isCyrillic ? 'ru' : ''}`}>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.phone}</p>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.phoneNumber}</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="mailto:info@edumark.uz">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                                        <rect x="48" y="96" width="416" height="320" rx="40" ry="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M112 160l144 112 144-112" />
                                    </svg>
                                    <div className={`cont-text ${isCyrillic ? 'ru' : ''}`}>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.email}</p>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.emailAddress}</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://t.me/Edumarksupportbot">
                                    <svg
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 122.88 93.04"
                                        style={{ enableBackground: "new 0 0 122.88 93.04" }}
                                        xmlSpace="preserve"
                                    >
                                        <g>
                                            <path d="M7.09,43.87h7.11v-1.65c0-2.2,0.44-4.3,1.24-6.22c0.83-1.99,2.04-3.79,3.55-5.29c1.5-1.5,3.3-2.72,5.29-3.55 c1.92-0.8,4.02-1.24,6.22-1.24h28.29l0-0.14V15.65c-0.46-0.17-0.9-0.38-1.32-0.62c-0.59-0.35-1.13-0.77-1.61-1.25 c-0.74-0.74-1.34-1.63-1.75-2.62c-0.39-0.95-0.61-2-0.61-3.08c0-1.09,0.22-2.13,0.61-3.08c0.41-0.99,1.01-1.88,1.75-2.62 c0.74-0.74,1.63-1.34,2.62-1.75c0.95-0.4,2-0.61,3.08-0.61s2.13,0.22,3.08,0.61c0.99,0.41,1.88,1.01,2.62,1.75 c0.74,0.74,1.34,1.63,1.75,2.62c0.39,0.95,0.61,2,0.61,3.08c0,1.09-0.22,2.13-0.61,3.08c-0.41,0.99-1.01,1.88-1.75,2.62l-0.04,0.04 c-0.47,0.46-1,0.87-1.57,1.21c-0.42,0.25-0.86,0.46-1.32,0.62v10.13l0,0.14h28.29c2.2,0,4.3,0.44,6.22,1.24 c2,0.83,3.79,2.04,5.29,3.55c1.5,1.5,2.72,3.3,3.55,5.29c0.8,1.92,1.24,4.02,1.24,6.22v1.65h6.86c0.95,0,1.87,0.19,2.71,0.54 c0.87,0.36,1.65,0.89,2.3,1.54l0.04,0.04c0.64,0.65,1.15,1.41,1.5,2.26c0.35,0.84,0.54,1.75,0.54,2.71v18.92 c0,0.95-0.19,1.87-0.54,2.71c-0.36,0.86-0.89,1.65-1.54,2.3l0,0c-1.28,1.28-3.06,2.08-5.01,2.08h-6.87 c-0.03,2.11-0.47,4.14-1.24,5.99c-0.83,2-2.04,3.79-3.55,5.29c-1.5,1.5-3.3,2.72-5.29,3.55c-1.92,0.8-4.02,1.24-6.22,1.24H30.5 c-2.2,0-4.3-0.44-6.22-1.24c-2-0.83-3.79-2.04-5.29-3.55c-1.5-1.5-2.72-3.3-3.55-5.29c-0.77-1.85-1.21-3.88-1.24-5.99H7.09 c-0.95,0-1.87-0.19-2.71-0.54c-0.87-0.36-1.65-0.89-2.3-1.54l-0.04-0.04c-0.64-0.65-1.15-1.41-1.5-2.26C0.19,71.75,0,70.83,0,69.88 V50.96c0-0.95,0.19-1.87,0.54-2.71c0.36-0.87,0.89-1.65,1.54-2.3l0,0c0.65-0.65,1.43-1.18,2.3-1.54 C5.22,44.06,6.13,43.87,7.09,43.87L7.09,43.87z M47,74.3c-0.14-0.11-0.26-0.23-0.37-0.37c-0.33-0.4-0.5-0.86-0.51-1.33 c-0.01-0.47,0.14-0.94,0.45-1.35c0.11-0.14,0.23-0.27,0.38-0.39c0.52-0.43,1.21-0.66,1.89-0.67c0.68-0.01,1.36,0.19,1.9,0.6 c1.86,1.43,3.7,2.47,5.52,3.16c1.8,0.68,3.58,1,5.34,0.98c1.77-0.02,3.56-0.39,5.39-1.08c1.85-0.7,3.71-1.75,5.6-3.1 c0.56-0.4,1.25-0.58,1.93-0.55c0.68,0.03,1.36,0.27,1.87,0.72c0.13,0.12,0.25,0.25,0.36,0.4c0.3,0.42,0.44,0.9,0.41,1.37 c-0.03,0.47-0.22,0.93-0.56,1.32c-0.12,0.13-0.26,0.26-0.42,0.37c-2.37,1.71-4.75,3.01-7.16,3.9c-2.42,0.89-4.87,1.36-7.35,1.39 c-2.49,0.03-4.95-0.39-7.4-1.28c-2.43-0.88-4.85-2.23-7.23-4.06L47,74.3L47,74.3z M40.77,43.72c0.6,0,1.2,0.06,1.77,0.18 c0.58,0.12,1.15,0.29,1.7,0.52c0.56,0.23,1.09,0.51,1.58,0.84c0.48,0.32,0.93,0.68,1.33,1.08l0.06,0.05 c0.42,0.42,0.8,0.88,1.13,1.38l0.02,0.03c0.32,0.48,0.6,1,0.82,1.55c0.23,0.55,0.4,1.12,0.52,1.7c0.11,0.58,0.18,1.17,0.18,1.77 c0,0.6-0.06,1.2-0.18,1.77c-0.12,0.58-0.29,1.15-0.52,1.71c-0.23,0.56-0.51,1.09-0.84,1.58c-0.34,0.51-0.72,0.97-1.13,1.38 c-0.83,0.83-1.84,1.51-2.97,1.97c-0.55,0.23-1.12,0.4-1.71,0.52c-0.58,0.11-1.17,0.17-1.77,0.17s-1.2-0.06-1.77-0.17 c-0.58-0.12-1.15-0.29-1.71-0.52c-0.56-0.23-1.09-0.51-1.58-0.84c-0.51-0.34-0.97-0.72-1.38-1.13c-0.42-0.42-0.8-0.88-1.13-1.38 l-0.02-0.03c-0.32-0.48-0.6-1-0.82-1.55c-0.23-0.55-0.4-1.12-0.52-1.7c-0.11-0.58-0.17-1.17-0.17-1.77c0-0.6,0.06-1.2,0.17-1.77 c0.12-0.58,0.29-1.15,0.52-1.7c0.23-0.56,0.51-1.09,0.84-1.58c0.34-0.51,0.72-0.97,1.13-1.38c0.42-0.42,0.88-0.8,1.38-1.13 l0.03-0.02c0.48-0.32,1-0.6,1.55-0.82c0.55-0.23,1.12-0.4,1.7-0.52C39.57,43.78,40.17,43.72,40.77,43.72L40.77,43.72z M42.73,48.1 c-0.3-0.12-0.62-0.22-0.95-0.29c-0.32-0.06-0.66-0.1-1.01-0.1c-0.35,0-0.69,0.03-1.01,0.1c-0.34,0.07-0.66,0.16-0.95,0.29 c-0.31,0.13-0.6,0.28-0.88,0.47c-0.27,0.18-0.53,0.4-0.78,0.65c-0.25,0.25-0.46,0.51-0.65,0.78c-0.19,0.28-0.34,0.57-0.47,0.87 c-0.12,0.3-0.22,0.62-0.29,0.95c-0.06,0.32-0.1,0.66-0.1,1.01s0.03,0.69,0.1,1.01c0.07,0.34,0.16,0.66,0.29,0.95 c0.13,0.31,0.28,0.6,0.47,0.87c0.18,0.27,0.4,0.53,0.65,0.78c0.25,0.25,0.51,0.46,0.78,0.65c0.27,0.18,0.57,0.34,0.88,0.47 l0.03,0.02c0.29,0.12,0.59,0.21,0.92,0.27c0.32,0.06,0.66,0.1,1.01,0.1c0.35,0,0.69-0.03,1.01-0.1c0.34-0.07,0.65-0.16,0.95-0.28 c0.31-0.13,0.6-0.29,0.88-0.47c0.27-0.18,0.53-0.4,0.78-0.65c0.25-0.25,0.46-0.51,0.65-0.78c0.19-0.28,0.34-0.57,0.47-0.87 c0.12-0.3,0.22-0.62,0.29-0.95c0.06-0.32,0.1-0.66,0.1-1.01c0-0.35-0.03-0.69-0.1-1.01c-0.07-0.34-0.16-0.66-0.29-0.95 c-0.13-0.31-0.28-0.6-0.47-0.88c-0.19-0.28-0.4-0.54-0.64-0.78l-0.05-0.05c-0.23-0.22-0.47-0.42-0.73-0.59 C43.34,48.38,43.04,48.22,42.73,48.1L42.73,48.1z M82.35,43.72c0.6,0,1.2,0.06,1.77,0.18c0.58,0.12,1.15,0.29,1.7,0.52 c0.56,0.23,1.09,0.51,1.58,0.84c0.47,0.32,0.91,0.67,1.31,1.07c0.02,0.02,0.05,0.04,0.07,0.06c0.42,0.42,0.8,0.88,1.13,1.38 l0.02,0.03c0.32,0.48,0.6,1,0.82,1.55c0.23,0.55,0.4,1.12,0.52,1.7c0.11,0.58,0.17,1.17,0.17,1.77c0,0.6-0.06,1.2-0.17,1.77 c-0.12,0.58-0.29,1.15-0.52,1.71c-0.23,0.56-0.51,1.09-0.84,1.58c-0.34,0.51-0.72,0.97-1.13,1.38c-0.42,0.42-0.88,0.8-1.38,1.13 l-0.03,0.02c-0.49,0.32-1,0.6-1.55,0.82c-0.55,0.23-1.12,0.4-1.71,0.52c-0.58,0.11-1.17,0.17-1.77,0.17c-0.6,0-1.2-0.06-1.77-0.17 c-0.58-0.12-1.15-0.29-1.71-0.52c-0.57-0.24-1.1-0.52-1.58-0.84l-0.05-0.04c-0.48-0.33-0.93-0.69-1.33-1.09 c-0.42-0.42-0.8-0.88-1.13-1.38l-0.02-0.03c-0.32-0.48-0.6-1-0.82-1.55c-0.23-0.55-0.4-1.12-0.52-1.7 c-0.11-0.58-0.18-1.17-0.18-1.77c0-0.6,0.06-1.2,0.18-1.77c0.12-0.58,0.29-1.15,0.52-1.7c0.23-0.56,0.51-1.09,0.84-1.58 c0.34-0.51,0.72-0.97,1.13-1.38c0.41-0.41,0.88-0.79,1.38-1.13c0.49-0.33,1.02-0.61,1.58-0.85c0.55-0.23,1.12-0.4,1.7-0.52 C81.16,43.78,81.75,43.72,82.35,43.72L82.35,43.72z M84.32,48.1c-0.3-0.12-0.62-0.22-0.95-0.29c-0.32-0.06-0.66-0.1-1.01-0.1 c-0.35,0-0.69,0.03-1.01,0.1c-0.34,0.07-0.66,0.16-0.95,0.29c-0.31,0.13-0.6,0.28-0.88,0.47c-0.27,0.18-0.53,0.4-0.78,0.65 c-0.25,0.25-0.46,0.51-0.65,0.78c-0.19,0.28-0.34,0.57-0.47,0.87c-0.12,0.3-0.22,0.62-0.29,0.95c-0.06,0.32-0.1,0.66-0.1,1.01 c0,0.35,0.03,0.69,0.1,1.01c0.07,0.34,0.16,0.66,0.29,0.95c0.13,0.31,0.28,0.6,0.47,0.87c0.18,0.27,0.4,0.53,0.65,0.78 c0.25,0.25,0.51,0.46,0.78,0.65c0.27,0.18,0.57,0.34,0.88,0.47l0.03,0.02c0.29,0.12,0.59,0.21,0.92,0.27 c0.32,0.06,0.66,0.1,1.01,0.1c0.35,0,0.69-0.03,1.01-0.1c0.34-0.07,0.65-0.16,0.95-0.28c0.31-0.13,0.6-0.29,0.88-0.47 c0.28-0.19,0.54-0.4,0.78-0.64v0c0.25-0.25,0.46-0.51,0.65-0.78c0.19-0.28,0.34-0.57,0.47-0.87c0.12-0.3,0.22-0.62,0.29-0.95 c0.06-0.32,0.1-0.66,0.1-1.01c0-0.35-0.03-0.69-0.1-1.01c-0.07-0.34-0.16-0.66-0.29-0.95c-0.13-0.31-0.28-0.6-0.47-0.88 c-0.19-0.28-0.4-0.54-0.64-0.78l-0.05-0.05c-0.23-0.22-0.47-0.42-0.73-0.59C84.92,48.38,84.63,48.22,84.32,48.1L84.32,48.1z M18.19,45.87v30.87c0,1.66,0.33,3.24,0.93,4.69c0.63,1.5,1.54,2.86,2.68,4c1.14,1.14,2.5,2.06,4,2.68 c1.44,0.6,3.03,0.93,4.69,0.93h62.13c1.66,0,3.24-0.33,4.69-0.93c1.5-0.63,2.86-1.54,4-2.68s2.06-2.5,2.68-4 c0.6-1.44,0.93-3.03,0.93-4.69V42.22c0-1.66-0.33-3.25-0.93-4.69c-0.63-1.5-1.54-2.86-2.68-4c-1.14-1.14-2.5-2.06-4-2.68 c-1.44-0.6-3.03-0.93-4.69-0.93H30.5c-1.66,0-3.24,0.33-4.69,0.93c-1.5,0.63-2.86,1.54-4,2.68c-1.14,1.14-2.06,2.5-2.68,4 c-0.6,1.44-0.93,3.03-0.93,4.69V45.87L18.19,45.87z M14.2,47.86H7.09c-0.42,0-0.82,0.08-1.18,0.23c-0.38,0.16-0.72,0.39-1.01,0.68 l-0.04,0.03c-0.27,0.28-0.49,0.61-0.64,0.97c-0.15,0.36-0.23,0.76-0.23,1.18v18.92c0,0.42,0.08,0.82,0.23,1.18 c0.16,0.38,0.39,0.72,0.68,1.01c0.56,0.56,1.33,0.91,2.18,0.91h7.11V47.86L14.2,47.86z M115.79,47.86h-6.86v25.11h6.86 c0.42,0,0.82-0.08,1.18-0.23c0.38-0.16,0.72-0.39,1.01-0.68c0.29-0.29,0.52-0.63,0.68-1.01c0.15-0.36,0.23-0.76,0.23-1.18V50.96 c0-0.42-0.08-0.82-0.23-1.18c-0.16-0.38-0.39-0.72-0.68-1.01l0,0c-0.29-0.29-0.63-0.52-1.01-0.68 C116.61,47.95,116.21,47.86,115.79,47.86L115.79,47.86z" />
                                        </g>
                                    </svg>
                                    <div className={`cont-text ${isCyrillic ? 'ru' : ''}`}>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.bot}</p>
                                        <p className={`${isCyrillic ? 'ru' : ''}`}>{t.botAddress}</p>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="cont-right">
                        <h1 className={isCyrillic ? 'ru' : ''}>{t.sendMessage}</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="input-row">
                                <input
                                    type="text"
                                    placeholder={t.namePlaceholder}
                                    className={isCyrillic ? 'ru' : ''}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-row">
                                <input
                                    type="text"
                                    placeholder={t.emailPlaceholder}
                                    className={isCyrillic ? 'ru' : ''}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-row">
                                <InputMask
                                    mask="+\9\9\8 (99) 999-99-99"
                                    placeholder="+998 (__) ___-__-__"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                >
                                    {(inputProps) => <input {...inputProps} type="text" />}
                                </InputMask>
                            </div>
                            <div className="input-row">
                                <textarea
                                    name=""
                                    id=""
                                    placeholder={t.messagePlaceholder}
                                    className={isCyrillic ? 'ru' : ''}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="input-row">
                                <button type="submit" disabled={msgLoad} className={isCyrillic ? 'ru' : ''}>
                                    {msgLoad ? t.sending : t.submit}
                                </button>
                            </div>
                        </form>

                        {
                            success && <p id="success-m">
                                {success}
                            </p>
                        }
                        {
                            error && <p id='err'>
                                {error}
                            </p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact;