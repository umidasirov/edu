import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../App";
import { AccessContext } from "../../AccessContext";
import "./login.scss";
import Success from "../../components/success-message/success";
import InputMask from "react-input-mask";

const Login = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAccess, setSuccess, success, setToken, successM } = useContext(AccessContext);
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "uz";
  const [mode, setMode] = useState("username"); // "username" yoki "phone"


  const translations = {
    uz: {
      title: "Kirish - Edu Mark",
      header: "Prezident Maktablariga Qabul – Yangi Avlod Iqtidorlari Uchun Ilk",
      headerSpan: "Qadam",
      subheader: "Biz bilan birga o'rganing va muvaffaqiyatga erishing.",
      loginTitle: "Kirish",
      usernamePlaceholder: "Foydalanuvchi nomi yoki Email",
      phonePlaceholder: "Telefon",
      passwordPlaceholder: "Parol",
      loginButton: loading ? "Kirilmoqda..." : "Kirish",
      registerPrompt: "Agar siz ro'yxatdan o'tmagan bo'lsangiz:",
      registerLink: "Ro'yxatdan o'tish",
      successRegister: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      successLogin: "Muvaffaqiyatli kirildi",
      errorMessage: "Foydalanuvchi nomi yoki parol xato kiritildi!"
    },
    kaa: {
      title: "Кириў - Edu Mark",
      header: "Президент Мектеплерине Қабул – Яңы Авлод Иқтидорлары Үшин Илк",
      headerSpan: "Қадам",
      subheader: "Биз менен бирге ўргениңиз ҳәм муваффақиятқа еришиңиз.",
      loginTitle: "Кириў",
      usernamePlaceholder: "Пайдаланувшы аты",
      phonePlaceholder: "Телефон",
      passwordPlaceholder: "Пароль",
      loginButton: loading ? "Кирилмокда..." : "Кириў",
      registerPrompt: "Эгер сиз тизмеден отмеген болсанъыз:",
      registerLink: "Тизмеден отўў",
      successRegister: "Муваффақиятлы тизмеден отдинъиз!",
      successLogin: "Муваффақиятлы кирилди",
      errorMessage: "Пайдаланувчы аты не пароль қате киритилди!"
    },
    ru: {
      title: "Вход - Edu Mark",
      header: "Поступление в Президентские школы – Первый",
      headerSpan: "Шаг",
      subheader: "Учитесь и достигайте успеха вместе с нами.",
      loginTitle: "Вход",
      usernamePlaceholder: "Имя пользователя",
      phonePlaceholder: "Телефон",
      passwordPlaceholder: "Пароль",
      loginButton: loading ? "Вход..." : "Войти",
      registerPrompt: "Если вы не зарегистрированы:",
      registerLink: "Регистрация",
      successRegister: "Вы успешно зарегистрировались!",
      successLogin: "Успешный вход",
      errorMessage: "Неверное имя пользователя или пароль!"
    },
    en: {
      title: "Login - Edu Mark",
      header: "Admission to Presidential Schools - First",
      headerSpan: "Step",
      subheader: "Learn and achieve success with us.",
      loginTitle: "Login",
      usernamePlaceholder: "Username",
      phonePlaceholder: "Phone",
      passwordPlaceholder: "Password",
      loginButton: loading ? "Logging in..." : "Login",
      registerPrompt: "If you're not registered:",
      registerLink: "Register",
      successRegister: "You have successfully registered!",
      successLogin: "Logged in successfully",
      errorMessage: "Invalid username or password!"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };
  window.document.title = t.title;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      identifier: mode === "username" ? username : phone,
      password: password,
      last_login: new Date().toISOString(),
    };
    
    setLoading(true);
    try {
      const response = await fetch(`${api}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(t.errorMessage);
      }
      const accessToken = result.access || result.refresh;
      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      setSuccess(t.successLogin);
      setError(null);
      setAccess(true);
      navigate("/", { state: { success: t.successLogin } });
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <section id="login-section" className={getLanguageClass()}>
      <div className={`section-header ${getLanguageClass()}`}>
        <h1 className={getLanguageClass()}>
          {t.header} <span>{t.headerSpan}</span>
        </h1>
        <p className={getLanguageClass()}>{t.subheader}</p>
      </div>
      {success && <Success text={success}/>}
      {successM && <Success text={t.successRegister} />}
      <div className={`login-container ${getLanguageClass()}`}>
        <h1 className={getLanguageClass()}>{t.loginTitle}</h1>
        <div className={`line ${getLanguageClass()}`}></div>
        <form onSubmit={handleSubmit} className={getLanguageClass()}>
          <div className={`content login-content ${getLanguageClass()}`}>
            <div className="login-tabs">
              <button
                type="button"
                className={mode === "username" ? "active" : ""}
                onClick={() => setMode("username")}
              >
                {t.usernamePlaceholder}
              </button>
              <button
                type="button"
                className={mode === "phone" ? "active" : ""}
                onClick={() => setMode("phone")}
              >
                {t.phonePlaceholder}
              </button>
            </div>

            <div className={`left ${getLanguageClass()}`}>
              {mode === "username" && (
                <input
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={getLanguageClass()}
                />
              )}

              {mode === "phone" && (
                <InputMask
                  mask="+\9\9\8 (99) 999-99-99"
                  placeholder="+998 (__) ___-__-__"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={getLanguageClass()}
                >
                  {(inputProps) => <input {...inputProps} type="text" className={getLanguageClass()} />}
                </InputMask>
              )}

              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={getLanguageClass()}
              />
            </div>
          </div>
          {error && (
            <div className={`alert ${getLanguageClass()}`} role="alert">
              {error}
            </div>
          )}

          {success && <div className={`success-message ${getLanguageClass()}`}>{success}</div>}
          <div className={`forgot-pass ${getLanguageClass()}`}>
            <p className={getLanguageClass()}>
              {t.registerPrompt} <Link to="/signup" className={getLanguageClass()}>{t.registerLink}</Link>
            </p>
            <p>Parolni unutdingizmi: <Link to="/pass-recovery">shu yerni bosing</Link></p>
          </div>
          <button type="submit" disabled={loading} className={getLanguageClass()}>
            {t.loginButton}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;