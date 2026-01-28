import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./passRecovery.scss";
import { api } from "../../App";
import InputMask from "react-input-mask";
import { AccessContext } from "../../AccessContext";
import { reFormatPhone } from "../../utils/phoneFormatter";

const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [smsErr, setSmsErr] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: reFormatPhone(phone),
    new_password: "",
    confirmPassword: '',
  });

  const [code, setCode] = useState(Array(4).fill(""));
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const language = localStorage.getItem("language") || "uz";
  const { successM, setSuccessM, setSuccess } = useContext(AccessContext);
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };


  const translations = {
    uz: {
      title: "Parolni tiklash - Edu Mark",
      header: "Prezident Maktablariga Qabul – Yangi Avlod Iqtidorlari Uchun Ilk",
      headerSpan: "Qadam",
      subheader: "Biz bilan birga o'rganing va muvaffaqiyatga erishing.",
      signupTitle: "Parolni tiklash",
      phonePlaceholder: "Telefon raqami",
      registerPrompt: "Agar siz ro'yxatdan o'tgan bo'lsangiz",
      loginLink: "shu yerni bosing",
      sendCode: "Kod yuborish",
      sendingCode: "Kod yuborilmoqda...",
      verifyTitle: "SMS kodni kiriting",
      back: "Ortga",
      verify: "Tasdiqlash",
      verifying: "Tasdiqlanmoqda...",
      namePlaceholder: "Ism",
      surnamePlaceholder: "Familiya",
      usernamePlaceholder: "Foydalanuvchi nomi",
      agePlaceholder: "DD.MM.YYYY",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Parol",
      regionPlaceholder: "Viloyatni tanlang",
      districtPlaceholder: "Tumanni tanlang",
      male: "Erkak",
      female: "Ayol",
      submit: "Parolni tiklash",
      submitting: "Parol tiklanmoqda...",
      smsError: "Sms kodi xato!",
      networkError: "Tarmoq xatosi! Qayta urinib ko'ring.",
      nameError: "Ism kiritish shart!",
      surnameError: "Familiya kiritish shart!",
      usernameError: "Foydalanuvchi nomi kiritish shart!",
      ageError: "Tug'ilgan sanani to'liq kiriting!",
      dateFormatError: "Sana formati noto'g'ri! DD.MM.YYYY kiriting.",
      dayError: "Kun faqat 01-31 oralig'ida bo'lishi kerak!",
      monthError: "Oy faqat 01-12 oralig'ida bo'lishi kerak!",
      yearError: (currentYear) => `Yil 1900 va ${currentYear} oralig'ida bo'lishi kerak!`,
      regionError: "Viloyatni tanlang!",
      districtError: "Tuman tanlash shart!",
      passwordError: "Parol kamida 6 ta belgi bo'lishi kerak!",
      unknownError: "Noma'lum xato",
      resendCode: "Qayta kod yuborish",
      countdownText: (time) => `Qayta kod yuborish ${time} daqiqadan so'ng`,
      resendPrompt: "Sms kodini qayta yuborish uchun: ",
      resendButton: "Qayta yuborish",
      confirmPasswordPlaceholder: "Parolni tasdiqlang",
      confirmPasswordError: "Parollar mos kelmadi!",
    },
    kaa: {
      title: "Тизмеден отўў - Edu Mark",
      header: "Президент Мектеплерине Қабул – Яңы Авлод Иқтидорлары Үшин Илк",
      headerSpan: "Қадам",
      subheader: "Биз менен бирге ўргениңиз ҳәм муваффақиятқа еришиңиз.",
      signupTitle: "Тизмеден отўў",
      phonePlaceholder: "Телефон номери",
      registerPrompt: "Эгер сиз тизмеден откен болсанъыз",
      loginLink: "бул жерге басыңыз",
      sendCode: "Код жўнатиў",
      sendingCode: "Код жўнатилмокда...",
      verifyTitle: "SMS кодды киритиңиз",
      back: "Артқа",
      verify: "Тастықлаў",
      verifying: "Тастықланмокда...",
      namePlaceholder: "Атым",
      surnamePlaceholder: "Фамилия",
      usernamePlaceholder: "Пайдаланувшы аты",
      agePlaceholder: "КК.АА.ЖЖЖЖ",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Пароль",
      regionPlaceholder: "Облысты танлаңыз",
      districtPlaceholder: "Ауданы танлаңыз",
      male: "Еркек",
      female: "Айел",
      submit: "Тизмеден отўў",
      submitting: "Тизмеден отылмокда...",
      smsError: "SMS коды қате!",
      networkError: "Тарыма қатеси! Қайта урынып көриңиз.",
      nameError: "Атымды киритиў керек!",
      surnameError: "Фамилияны киритиў керек!",
      usernameError: "Пайдаланувшы атын киритиў керек!",
      ageError: "Туғылған сананы толық киритиңиз!",
      dateFormatError: "Сана форматы қате! КК.АА.ЖЖЖЖ форматында киритиңиз.",
      dayError: "Кун 01-31 аралығында болыўы керек!",
      monthError: "Ай 01-12 аралығында болыўы керек!",
      yearError: (currentYear) => `Жыл 1900 және ${currentYear} аралығында болыўы керек!`,
      regionError: "Облысты танлаңыз!",
      districtError: "Ауданды танлаў керек!",
      passwordError: "Пароль кеминде 6 тамғадан туратыўы керек!",
      unknownError: "Белгисиз қате",
      resendCode: "Қайта код жўнатиў",
      countdownText: (time) => `Қайта код жўнатиў ${time} минутдан соң`,
      resendPrompt: "СМС кодин қайта жибериў учун: ",
      resendButton: "Қайта жибериў",
      confirmPasswordPlaceholder: "Парольды тастықлаңыз",
      confirmPasswordError: "Паролдар сай келмейди!",
    },
    ru: {
      title: "Регистрация - Edu Mark",
      header: "Поступление в Президентские школы – Первый",
      headerSpan: "Шаг",
      subheader: "Учитесь и достигайте успеха вместе с нами.",
      signupTitle: "Регистрация",
      phonePlaceholder: "Номер телефона",
      registerPrompt: "Если вы уже зарегистрированы",
      loginLink: "нажмите здесь",
      sendCode: "Отправить код",
      sendingCode: "Отправка кода...",
      verifyTitle: "Введите SMS код",
      back: "Назад",
      verify: "Подтвердить",
      verifying: "Подтверждение...",
      namePlaceholder: "Имя",
      surnamePlaceholder: "Фамилия",
      usernamePlaceholder: "Имя пользователя",
      agePlaceholder: "ДД.ММ.ГГГГ",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Пароль",
      regionPlaceholder: "Выберите область",
      districtPlaceholder: "Выберите район",
      male: "Мужчина",
      female: "Женщина",
      submit: "Зарегистрироваться",
      submitting: "Регистрация...",
      smsError: "Неверный код SMS!",
      networkError: "Ошибка сети! Попробуйте снова.",
      nameError: "Имя обязательно!",
      surnameError: "Фамилия обязательна!",
      usernameError: "Имя пользователя обязательно!",
      ageError: "Введите полную дату рождения!",
      dateFormatError: "Неверный формат даты! Введите ДД.ММ.ГГГГ.",
      dayError: "День должен быть между 01-31!",
      monthError: "Месяц должен быть между 01-12!",
      yearError: (currentYear) => `Год должен быть между 1900 и ${currentYear}!`,
      regionError: "Выберите область!",
      districtError: "Выберите район!",
      passwordError: "Пароль должен содержать минимум 6 символов!",
      unknownError: "Неизвестная ошибка",
      resendCode: "Отправить код повторно",
      countdownText: (time) => `Повторная отправка кода через ${time} минут`,
      resendPrompt: "Для повторной отправки SMS кода: ",
      resendButton: "Отправить повторно",
      confirmPasswordPlaceholder: "Подтвердите пароль",
      confirmPasswordError: "Пароли не совпадают!",
    },
    en: {
      title: "Sign Up - Edu Mark",
      header: "Admission to Presidential Schools - First",
      headerSpan: "Step",
      subheader: "Learn and achieve success with us.",
      signupTitle: "Sign Up",
      phonePlaceholder: "Phone number",
      registerPrompt: "If you're already registered",
      loginLink: "click here",
      sendCode: "Send Code",
      sendingCode: "Sending code...",
      verifyTitle: "Enter SMS code",
      back: "Back",
      verify: "Verify",
      verifying: "Verifying...",
      namePlaceholder: "Name",
      surnamePlaceholder: "Surname",
      usernamePlaceholder: "Username",
      agePlaceholder: "DD.MM.YYYY",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      regionPlaceholder: "Select region",
      districtPlaceholder: "Select district",
      male: "Male",
      female: "Female",
      submit: "Sign Up",
      submitting: "Registering...",
      smsError: "Invalid SMS code!",
      networkError: "Network error! Please try again.",
      nameError: "Name is required!",
      surnameError: "Surname is required!",
      usernameError: "Username is required!",
      ageError: "Enter full birth date!",
      dateFormatError: "Invalid date format! Enter DD.MM.YYYY.",
      dayError: "Day must be between 01-31!",
      monthError: "Month must be between 01-12!",
      yearError: (currentYear) => `Year must be between 1900 and ${currentYear}!`,
      regionError: "Select region!",
      districtError: "Select district!",
      passwordError: "Password must be at least 6 characters!",
      unknownError: "Unknown error",
      resendCode: "Resend code",
      countdownText: (time) => `Resend code in ${time} minutes`,
      resendPrompt: "To resend SMS code: ",
      resendButton: "Resend",
      confirmPasswordPlaceholder: "Confirm password",
      confirmPasswordError: "Passwords don't match!",
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  window.document.title = t.title;

  useEffect(() => {
    setFormData((prev) => ({ ...prev, phone: phone }));
  }, [phone]);

  const validateForm = () => {
    let errors = {};
    if (formData.new_password.length < 6) {
      errors.new_password = t.passwordError;
    }

    // Parollarni solishtirish tekshiruvi
    if (formData.new_password !== formData.confirmPassword) {
      errors.confirmPassword = t.confirmPasswordError;
    }
    if (formData.new_password.length < 6) errors.new_password = t.passwordError;
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    console.log(formData);
    const phoneFormat = reFormatPhone(formData.phone)
    try {
      const response = await fetch(`${api}/users/password/reset/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone:phoneFormat, 
          password:formData.new_password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/login");
        setSuccess("Parol muvaffaqiyatli yangilandi!")
        setTimeout(() => {
          setSuccessM(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || t.unknownError));
      }
    } catch (error) {
      alert(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const [smsLimitError, setSmsLimitError] = useState("");
  const reFormPh = reFormatPhone(phone)
  const sendSMS = async () => {
    setLoading(true);
    setSmsLimitError("");
    
    try {
      const res = await fetch(`${api}/users/password/reset/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone:reFormPh }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setCountdown(180);
        setCanResend(false);
      } else {
        setSmsLimitError(data.error || t.smsError);
      }
    } catch (error) {
      setSmsLimitError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setLoading(true);
    setSmsLimitError(""); // Xatoliklarni tozalash
    const phoneFormatted = reFormatPhone(phone)
    try {
      const res = await fetch(`${api}/users/password/reset/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone:phoneFormatted }),
      });

      const data = await res.json(); // Javobni JSON formatida olish

      if (res.ok) {
        setCountdown(180);
        setCanResend(false);
      } else {
        // Agar API dan xato kelsa
        setSmsLimitError(data.error || t.smsError);
      }
    } catch (error) {
      setSmsLimitError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setSmsErr("");
    const reFormPh = reFormatPhone(phone)
    try {
      const res = await fetch(`${api}/users/password/reset/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone:reFormPh, code: code.join("") }),
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setSmsErr(data.message || t.smsError);
      }
    } catch (error) {
      setSmsErr(t.networkError);
    }

    setLoading(false);
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <section id="signup-section" className={getLanguageClass()}>
      <div className={`section-header ${getLanguageClass()}`}>
        <h1 className={getLanguageClass()}>
          {t.header} <span>{t.headerSpan}</span>
        </h1>
        <p className={getLanguageClass()}>{t.subheader}</p>
      </div>
      <div className={`signup-container ${getLanguageClass()}`}>
        <h1 className={getLanguageClass()}>{t.signupTitle}</h1>
        <div className={`line ${getLanguageClass()}`}></div>

        {step === 1 && (
          <div className={`steps ${getLanguageClass()}`}>
            <h2 className={getLanguageClass()}>{t.phonePlaceholder}</h2>
            <InputMask
              mask="+\9\9\8 (99) 999-99-99"
              placeholder={t.phonePlaceholder}
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={getLanguageClass()}
            >
              {(inputProps) => <input {...inputProps} type="text" className={getLanguageClass()} />}
            </InputMask>

            {/* SMS limit xatosini ko'rsatish */}
            {smsLimitError && <p className={`sms-limit-error ${getLanguageClass()}`}>{smsLimitError}</p>}

            <div className={`forgot-pass ${getLanguageClass()}`}>
              <p className={getLanguageClass()}>
                {t.registerPrompt} <Link to="/login" className={getLanguageClass()}>{t.loginLink}</Link>
              </p>
            </div>
            <div className={`to-right ${getLanguageClass()}`}>
              <button
                disabled={loading}
                className={getLanguageClass()}
                onClick={sendSMS}
              >
                {loading ? t.sendingCode : t.sendCode}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`steps ${getLanguageClass()}`}>
            <h2 className={getLanguageClass()}>{t.verifyTitle}</h2>
            <div className={`code-field ${getLanguageClass()}`}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  placeholder="*"
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={getLanguageClass()}
                />
              ))}
            </div>

            {/* Yangilangan resend section */}
            <div className={`resend-section ${getLanguageClass()}`}>
              <p className={`countdown-text ${getLanguageClass()}`}>
                {countdown > 0
                  ? t.countdownText(formatTime(countdown))
                  : t.resendPrompt}
              </p>

              {countdown === 0 && (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className={`resend-btn ${getLanguageClass()}`}
                >
                  {t.resendButton}
                </button>
              )}
            </div>

            {smsErr && <p id="sms-err" className={getLanguageClass()}>{smsErr}</p>}
            <div className={`to-right ${getLanguageClass()}`}>
              <button type="button" id="back" onClick={() => setStep(1)} className={getLanguageClass()}>
                {t.back}
              </button>
              <button
                disabled={loading}
                className={getLanguageClass()}
                onClick={verifyCode}
              >
                {loading ? t.verifying : t.verify}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className={getLanguageClass()}>
            <div className={`content ${getLanguageClass()}`}>
              <div className={`input-row ${errors.new_password ? "err-border" : ""} ${getLanguageClass()}`}>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className={getLanguageClass()}
                />
                {errors.password && <span className={`error ${getLanguageClass()}`}>{errors.password}</span>}
              </div>
              <div className={`input-row ${errors.confirmPassword ? "err-border" : ""} ${getLanguageClass()}`}>
                <input
                  type="password"
                  placeholder={t.confirmPasswordPlaceholder}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={getLanguageClass()}
                />
                {errors.confirmPassword && (
                  <span className={`error ${getLanguageClass()}`}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className={getLanguageClass()}>
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default PasswordRecovery;