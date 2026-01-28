import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import { api } from "../../App";
import InputMask from "react-input-mask";
import { AccessContext } from "../../AccessContext";
import Success from "../../components/success-message/success";
import { reFormatPhone } from "../../utils/phoneFormatter";

const regionsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";
const districtsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/districts.json";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [smsErr, setSmsErr] = useState("");
  const [phone, setPhone] = useState("");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone: reFormatPhone(phone),
    email: "",
    birth_date: "",
    gender: "male",
    region: "",
    district: "",
    password: "",
    confirmPassword: ""
  });



  const [usernameError, setUsernameError] = useState('')

  const [code, setCode] = useState(Array(4).fill(""));
  const [countdown, setCountdown] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const language = localStorage.getItem("language") || "uz";
  const { successM, setSuccessM } = useContext(AccessContext);
  const navigate = useNavigate();

  const [offShow, setOffShow] = useState(false);
  const [offShowInp, setOffShowInp] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  const translations = {
    uz: {
      title: "Ro'yxatdan o'tish - Edu Mark",
      header: "O‘qituvchilar Attestatsiyasi – Kasbiy Yuksalish Yo‘lidagi Muhim",
      headerSpan: "Qadam",
      subheader: "Biz bilan birga o'rganing va muvaffaqiyatga erishing.",
      signupTitle: "Ro'yxatdan o'tish",
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
      submit: "Ro'yxatdan o'tish",
      submitting: "Ro'yxatdan o'tilmoqda...",
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
      header: "Oqıtıwshılar attestaciyası – Kásiplik rawajlanıw jolındaǵı máńizli",
      headerSpan: "Qadam",
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
      header: "Аттестация – Важный шаг на пути профессионального роста",
      headerSpan: "учителей",
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
      header: "Teacher Certification – An Important Step Toward Professional Growth",
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

  const [failed, setFailed] = useState(false);

  window.document.title = t.title;

  useEffect(() => {
    setFormData((prev) => ({ ...prev, phone: phone }));
  }, [phone]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(regionsURL);
        if (response.ok) {
          const data = await response.json();
          setRegions(data);
        } else {
          console.error(t.regionError);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchRegions();
  }, [t.regionError]);

  const handleRegionChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedRegion(selectedId);
    try {
      const response = await fetch(districtsURL);
      if (response.ok) {
        const data = await response.json();
        const regionDistricts = data.filter(
          (district) => district.region_id === Number(selectedId)
        );
        setDistricts(regionDistricts);
      } else {
        console.error(t.districtError);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setSelectedDistrict("");
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    if (name === "birth_date") {
      let parts = value.split(".");
      if (parts.length === 3) {
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parts[2].replace(/\D/g, "");
        const currentYear = new Date().getFullYear();
        if (day > 31) parts[0] = "31";
        if (day < 1) parts[0] = "01";
        if (month > 12) parts[1] = "12";
        if (month < 1) parts[1] = "01";
        if (year.length === 4) {
          let fullYear = parseInt(year, 10);
          if (fullYear < 1900) {
            parts[2] = "1900";
          } else if (fullYear > currentYear) {
            parts[2] = currentYear.toString();
          } else {
            parts[2] = year;
          }
        } else {
          parts[2] = year;
        }
        newValue = parts.join(".");
      }
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  
  const validateDate = (date) => {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = date.match(regex);
    if (!match) return t.dateFormatError;
    let [_, day, month, year] = match;
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    if (day < 1 || day > 31) return t.dayError;
    if (month < 1 || month > 12) return t.monthError;
    if (year < 1900 || year > currentYear) return t.yearError(currentYear);
    return "";
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.first_name.trim()) errors.name = t.nameError;
    if (!formData.last_name.trim()) errors.surname = t.surnameError;
    if (!formData.username.trim()) errors.username = t.usernameError;
    if (!formData.birth_date.trim() || formData.birth_date.includes("_")) {
      errors.birth_date = t.ageError;
    } else {
      let ageError = validateDate(formData.birth_date);
      if (ageError) errors.age = ageError;
    }
    if (formData.password.length < 6) {
      errors.password = t.passwordError;
    }

    // Parollarni solishtirish tekshiruvi
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t.confirmPasswordError;
    }
    if (!selectedRegion) errors.region = t.regionError;
    if (!selectedDistrict) errors.district = t.districtError;
    if (!offShowInp) errors.inpErr = "Offerta shartlariga rozilik bildirish shart!";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const selectedRegionName = regions.find(region => region.id === Number(selectedRegion));
      const regionName = selectedRegionName ? (language === "ru" ? selectedRegionName.name_ru : selectedRegionName.name_uz.replace(/�/g, "'")) : "";

      // Phone raqamini tozalash: +998 (95) 702-10-99 -> 998957021012
      const cleanPhone = phone.replace(/\D/g, "");

      // Birth date formatini konvertqilish: DD.MM.YYYY -> YYYY-MM-DD
      const [day, month, year] = formData.birth_date.split(".");
      const formattedBirthDate = `${year}-${month}-${day}`;

      // confirmPassword, region, district ni o'chirip POST ga jo'natamiz
      const { confirmPassword, region, district, birth_date, ...dataToSend } = formData;

      const response = await fetch(`${api}/users/signup/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dataToSend,
          phone: cleanPhone,
          birth_date: formattedBirthDate,
          region: regionName,
          district: selectedDistrict,
        }),
      });
      console.log({...dataToSend,
          phone: cleanPhone,
          birth_date: formattedBirthDate,
          region: regionName,
          district: selectedDistrict,});
      
      if (response.ok) {
        const data = await response.json();
        navigate("/login");
        setSuccessM(true);
        setTimeout(() => {
          setSuccessM(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        setUsernameError(errorData.username)
        setFailed(true);
        setTimeout(() => {
          setFailed(false);
        }, 5000);
      }
    } catch (error) {
      alert(t.networkError);
      console.log(error);

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

  const sendSMS = async () => {
    setLoading(true);
    setSmsLimitError(""); // Xatoliklarni tozalash
    try {
      const cleanedPhone = reFormatPhone(phone);
      const res = await fetch(`${api}/users/signup/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanedPhone }),
      });

      const data = await res.json(); // Javobni JSON formatida olish

      if (res.ok) {
        setStep(2);
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

  const handleResendCode = async () => {
    if (!canResend) return;
    setLoading(true);
    setSmsLimitError(""); // Xatoliklarni tozalash
    try {
      const cleanedPhone = reFormatPhone(phone);
      const res = await fetch(`${api}/users/signup/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanedPhone }),
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

    try {
      const cleanedPhone = reFormatPhone(phone);
      const res = await fetch(`${api}/users/signup/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanedPhone, code: code.join("") }),
      });
      console.log(JSON.stringify({ phone: cleanedPhone, code: code.join("") }));
      
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
      {failed && <Success text={usernameError} status={false} />}
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

        <div className={`offerta ${offShow ? "active" : ""}`}>
          <div className="textsss">
            <p>FOYDALANUVCHI OFFERTA SHARTNOMASI</p>
            <p>Ushbu hujjat Test Platformasidan (keyingi o‘rinlarda “Platforma” deb yuritiladi) foydalanish shartlarini belgilaydi va har bir foydalanuvchi mazkur platformaga ro‘yxatdan o‘tgan paytdan boshlab quyidagi shartlarga avtomatik ravishda rozilik bildiradi.</p>

            <h3>1. UMUMIY QOIDALAR</h3>
            <p>
              1.1. Ushbu offerta Platformadan foydalanish tartibi, xizmatlar uchun to‘lov shartlari, foydalanuvchi majburiyatlari va javobgarlik masalalarini tartibga soladi.

            </p>
            <p>
              1.2. Platformada ro‘yxatdan o‘tgan har bir foydalanuvchi mazkur offerta shartlariga to‘liq rozilik bildirgan hisoblanadi.
            </p>

            <h3>
              2. TESTLARDAN FOYDALANISH QOIDALARI
            </h3>
            <p>2.1. Har bir test bir martalik foydalanish uchun mo‘ljallangan.</p>
            <p>2.2. Foydalanuvchi testni bilmagan holda yakunlab yuborsa, ushbu test qaytadan yechish uchun ochilmaydi.</p>
            <p>2.3. Testni qayta ishlash uchun foydalanuvchi uni yangidan sotib olishi lozim.</p>
            <p>2.4. Testlar boshlangach, vaqt tugagan bo‘lsa yoki foydalanuvchi uni istalgan vaqtda yakunlasa, bu test yechilgan deb hisoblanadi.</p>

            <h3>3. TO‘LOVLAR VA QAYTARILMASLIK SIYOSATI</h3>
            <p>3.1. Platformaga to‘ldirilgan mablag‘lar foydalanuvchi hisobiga tushiriladi va faqat testlar yechishda foydalaniladi.</p>
            <p>3.2. To‘ldirilgan mablag‘lar hech qanday holatda foydalanuvchiga qaytarib berilmaydi.</p>
            <p>3.3. Mablag‘ faqat testlar uchun sarflanishi mumkin.</p>
            <p>3.4. Noto‘g‘ri to‘lov holatlari yuzasidan murojaatlar maxsus ko‘rib chiqiladi, lekin Platforma o‘z xohishiga ko‘ra qaror chiqaradi.</p>

            <h3>4. TEXNIK NOSOZLIKLAR</h3>
            <p>4.1. Test yechish jarayonida yuzaga keladigan texnik muammolar (elektr o‘chishi, internet uzilishi, brauzer xatolari va boshqalar) uchun Platforma javobgar emas.</p>
            <p>4.2. Foydalanuvchi texnik imkoniyatlarni (barqaror internet, yangilangan qurilma va brauzer) ta’minlashi shart.</p>

            <h3>5. FOYDALANUVCHI MA'LUMOTLARI</h3>
            <p>5.1. Foydalanuvchining shaxsiy ma’lumotlari (ism, telefon raqam, email) faqat xizmat ko‘rsatish va ichki tizim tahlili uchun ishlatiladi.</p>
            <p>5.2. Foydalanuvchi ma’lumotlari uchinchi shaxslarga berilmaydi, lekin qonun talab qilgan hollarda tegishli organlarga taqdim etilishi mumkin.</p>

            <h3>6. FOYDALANUVCHI MAJBURIYATLARI</h3>
            <p>6.1. Foydalanuvchi Platformadan faqat qonuniy maqsadlarda foydalanishi shart.</p>
            <p>6.2. Platformaning intellektual mulkiga zarar yetkazuvchi harakatlar (testlarni nusxalash, tarqatish, buzish, kirish huquqini buzish) taqiqlanadi.</p>
            <p>6.3. Har qanday buzilish aniqlansa, foydalanuvchining akkaunti to‘sib qo‘yilishi va huquqiy choralar ko‘rilishi mumkin.</p>

            <h3>7. YAKUNIY QOIDALAR</h3>
            <p>
              7.1. Ushbu Offerta har qanday vaqtda yangilanishi mumkin. O‘zgarishlar Platformada e’lon qilingan paytdan boshlab kuchga kiradi.
            </p>
            <p>
              7.2. Foydalanuvchi muntazam ravishda Offertaning yangilangan versiyasi bilan tanishib borishi lozim.
            </p>
            <p>
              7.3. Platforma o‘z xizmatlarini takomillashtirish yoki o‘zgartirish huquqiga ega.
            </p>
            <div className="off-check">
              <input type="checkbox" name="" id="off-check-off" hidden />
              <label htmlFor="off-check-off" onClick={() => {
                setOffShow(false)
                setOffShowInp(!offShowInp)
              }}>
                <span></span>
                Shartlarga rozilik bildirish</label>
            </div>
          </div>

        </div>

        {step === 3 && (
          <form onSubmit={handleSubmit} className={getLanguageClass()}>
            <div className={`content ${getLanguageClass()}`}>
              <div className={`input-row ${errors.name ? "err-border" : ""} ${getLanguageClass()}`}>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={getLanguageClass()}
                />
                {errors.name && <span className={`error ${getLanguageClass()}`}>{errors.name}</span>}
              </div>
              <div className={`input-row ${errors.surname ? "err-border" : ""} ${getLanguageClass()}`}>
                <input
                  type="text"
                  placeholder={t.surnamePlaceholder}
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={getLanguageClass()}
                />
                {errors.surname && <span className={`error ${getLanguageClass()}`}>{errors.surname}</span>}
              </div>
              <div className={`input-row ${errors.username ? "err-border" : ""} ${getLanguageClass()}`}>
                <input
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={getLanguageClass()}
                />
                {errors.username && <span className={`error ${getLanguageClass()}`}>{errors.username}</span>}
              </div>
              <div className={`input-row ${errors.age ? "err-border" : ""} ${getLanguageClass()}`}>
                <InputMask
                  mask="99.99.9999"
                  placeholder={t.agePlaceholder}
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className={getLanguageClass()}
                >
                  {(inputProps) => <input {...inputProps} type="text" className={getLanguageClass()} />}
                </InputMask>
                {errors.age && <span className={`error ${getLanguageClass()}`}>{errors.age}</span>}
              </div>
              <div className={`input-row ${getLanguageClass()}`}>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getLanguageClass()}
                />
              </div>
              <div className={`input-row ${errors.password ? "err-border" : ""} ${getLanguageClass()}`}>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  name="password"
                  value={formData.password}
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
              <div className={`input-row ${getLanguageClass()}`}>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={getLanguageClass()}
                >
                  <option value="male" className={getLanguageClass()}>{t.male}</option>
                  <option value="female" className={getLanguageClass()}>{t.female}</option>
                </select>
              </div>
              <div className={`input-row ${errors.region ? "err-border" : ""} ${getLanguageClass()}`}>
                <select
                  id="regionSelect"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className={getLanguageClass()}
                >
                  <option value="" disabled className={getLanguageClass()}>
                    {t.regionPlaceholder}
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id} className={getLanguageClass()}>
                      {language === "ru" ? region.name_ru : region.name_uz.replace(/�/g, "'")}
                    </option>
                  ))}
                </select>
                {errors.region && <span className={`error ${getLanguageClass()}`}>{errors.region}</span>}
              </div>
              <div className={`input-row ${errors.district ? "err-border" : ""} ${getLanguageClass()}`}>
                <select
                  id="districtSelect"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className={getLanguageClass()}
                >
                  <option value="" disabled className={getLanguageClass()}>
                    {t.districtPlaceholder}
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name_uz} className={getLanguageClass()}>
                      {language === "ru" ? district.name_ru : district.name_uz.replace(/�/g, "'")}
                    </option>
                  ))}
                </select>
                {errors.district && <span className={`error ${getLanguageClass()}`}>{errors.district}</span>}
              </div>
              <div className="input-row off-check">
                <input type="checkbox" name="" id="off-check" hidden checked={offShowInp} required={offShowInp} />
                <label htmlFor="off-check" onClick={() => setOffShow(true)}>
                  <span></span>
                  Shartlarga rozilik bildirish</label>
                <p>
                  {errors.inpErr && <span className={`error ${getLanguageClass()}`}>{errors.inpErr}</span>}
                </p>
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

export default Signup;