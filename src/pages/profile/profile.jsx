import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import defaultImage from "../../assets/user.png";
import "./profile.scss";
import settings from "./settings.png";
import mathImage from "../../assets/math.jpg";
import englishImage from "../../assets/english.jpg";
import phisicImage from "../../assets/phisic.jpg";
import arrow_image from "../../assets/arrow-image.png";
import video from "./test-video.mp4";
import ProfileStatistics from "../../components/profil-statistics/profile-statistics";
import Rating from "../../components/rating/rating";
import { api } from "../../App";
import Loading from "../../components/loading/loading";
import ComplatedTests from "../../components/complatedTests/complatedTests";
import { formatPhoneToUzbekFormat } from "../../utils/phoneFormatter";
import UserData from "../toifa-testing/user-data";
const Profile = () => {
  const {
    access,
    setPayedCourses,
    setOlympic,
    logout,
    randomNumber,
    profileData,
    allUsers,
    profileLoading
  } = useContext(AccessContext);

  const navigate = useNavigate();
  const [mod, setMod] = useState(false);
  const language = localStorage.getItem("language") || "uz";

  const phone = formatPhoneToUzbekFormat(profileData.phone)

  const translations = {
    uz: {
      title: "Shaxsiy kabinet - Edu Mark",
      breadcrumb: "Bosh sahifa / Shaxsiy kabinet",
      rating: "Reyting",
      levelUp: "Darajangizni ko'taring",
      start: "Boshlang",
      editProfile: "Profilni taxrirlash",
      logout: "Chiqish",
      logoutConfirm: "Haqiqatdan ham hisobingizdan chiqmoqchimisiz?",
      cancel: "Bekor qilish",
      loginPrompt: "Iltimos oldin shaxsiy xisobingizga kiring"
    },
    ru: {
      title: "Личный кабинет - Edu Mark",
      breadcrumb: "Главная страница / Личный кабинет",
      rating: "Рейтинг",
      levelUp: "Повысьте свой уровень",
      start: "Начать",
      editProfile: "Редактировать профиль",
      logout: "Выйти",
      logoutConfirm: "Вы действительно хотите выйти из аккаунта?",
      cancel: "Отмена",
      loginPrompt: "Пожалуйста, войдите в личный кабинет"
    },
    en: {
      title: "Personal Account - Edu Mark",
      breadcrumb: "Home / Personal Account",
      rating: "Rating",
      levelUp: "Upgrade your level",
      start: "Start",
      editProfile: "Edit Profile",
      logout: "Logout",
      logoutConfirm: "Are you sure you want to log out?",
      cancel: "Cancel",
      loginPrompt: "Please log in to your personal account"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  window.document.title = t.title;

  const friends = [
    {
      image: defaultImage,
      firstName: "Maqsadbek",
      username: "Impulse",
      percent: 96,
    },
    {
      image: defaultImage,
      firstName: "Jasur",
      username: "NewJasJan",
      percent: 76,
    },
    {
      image: defaultImage,
      firstName: "Izzatillo",
      username: "Developer  ",
      percent: 82,
    },
    {
      image: defaultImage,
      firstName: "Izzatillo",
      username: "Developer",
      percent: 52,
    },
  ];

  const [userRank, setUserRank] = useState(null);




  if (profileLoading) {
    return <Loading />
  }

  return (
    <section id="profile-section" className={getLanguageClass()}>
      {access ? (
        <div className={`profile-container ${getLanguageClass()}`}>
          <div className={`profile-header ${getLanguageClass()}`}>
            <div className={`profile-header-inner ${getLanguageClass()}`}>
              <Link to="/" className={getLanguageClass()}>{t.breadcrumb.split(" / ")[0]}</Link> / {t.breadcrumb.split(" / ")[1]}
            </div>
          </div>
          <div className={`profile-content ${getLanguageClass()}`}>
            <div className={`left ${getLanguageClass()}`}>
              <Rating
                userId={profileData}
                allUsers={allUsers}
                balance={profileData.balance}
              />
              <div className={`left-inner-1 mob-ver ${getLanguageClass()}`}>
                <ProfileStatistics />
              </div>
              <div className={`left-inner-2 mob-ver ${getLanguageClass()}`}>
                <div className={`your-friend ${getLanguageClass()}`}>
                  <h1 className={getLanguageClass()}>{t.rating}</h1>
                  <div className={`your-friends ${getLanguageClass()}`}>
                    {friends.map((item, index) => (
                      <div key={index} className={`friend ${getLanguageClass()}`}>
                        <img src={item.image} alt={item.firstName} className={getLanguageClass()} />
                        <div className={`texts ${getLanguageClass()}`}>
                          <h2 className={getLanguageClass()}>{item.firstName}</h2>
                          <p className={getLanguageClass()}>
                            <span className={`username ${getLanguageClass()}`}>{item.username}</span>
                            <span className={`percent ${getLanguageClass()}`}>{item.percent}%</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`start-now mob-ver ${getLanguageClass()}`}>
                <div className={`now-left ${getLanguageClass()}`}>
                  {t.levelUp}
                  <img src={arrow_image} alt="" className={getLanguageClass()} />
                </div>
                <Link to="/schools/toifa-imtihonlari" className={getLanguageClass()}>{t.start}</Link>
              </div>

              <ComplatedTests id={profileData.id} data={profileData.attempts_data} />

              {/* {profileData.worked_tests && profileData.worked_tests.length > 0 && (
                <div className="worked-tests">
                  <h2>Ishlangan testlar</h2>
                  {profileData.worked_tests.map(test => (
                    <div key={test.test_guid} className="worked-test-item">
                      <h3>{test.test_name}</h3>
                      <p>Urinishlar soni: {test.attempts.length}</p>
                      <div className="attempts">
                        {test.attempts.slice(0, 3).map((attempt, index) => (
                          <div key={index} className="attempt">
                            <span>{attempt.percent}%</span>
                            <span>{new Date(attempt.finished_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )} */}
            </div>
            <div className={`right ${getLanguageClass()}`}>
              <div className={`user-profile ${getLanguageClass()}`}>
                <div>
                  <div className={`inner ${getLanguageClass()}`}>
                    {profileData.image ? (
                      <img
                        id="user-img"
                        src={profileData.image}
                        alt="Rasm yetib kelmadi"
                        className={getLanguageClass()}
                      />
                    ) : (
                      <img
                        id="user-img"
                        src={defaultImage}
                        alt="Rasm yetib kelmadi"
                        className={getLanguageClass()}
                      />
                    )}
                    <div className={`texts ${getLanguageClass()}`}>
                      <h1 className={`first-last-name ${getLanguageClass()}`}>
                        {profileData.last_name || "Yuklanmoqda..."} {profileData.first_name}
                      </h1>
                      <p className={`phone ${getLanguageClass()}`}>{phone || "Yuklanmoqda..."}</p>
                      <p className={`username ${getLanguageClass()}`}>{profileData.username}</p>
                    </div>
                  </div>
                  {/* <div className={`percent ${getLanguageClass()}`}>
                    <div className={`count ${getLanguageClass()}`}>{userRank?.percent || 0}%</div>
                    <div className={`line ${getLanguageClass()}`}>
                      <div
                        className={`line-inner ${getLanguageClass()}`}
                        style={{ width: `${userRank?.percent || 0}%` }}
                      ></div>
                    </div>
                  </div> */}
                  <div className={`logout-edit ${getLanguageClass()}`}>
                    <Link to="/edit-profile" className={getLanguageClass()}>{t.editProfile}</Link>
                    <button
                      id="logout"
                      onClick={() => { setMod(true); }}
                      className={getLanguageClass()}
                    >
                      {t.logout}
                    </button>
                    {mod && <div className={`m-shape ${getLanguageClass()}`}></div>}
                    <div className={`opened-modal ${mod ? "active" : ""} ${getLanguageClass()}`}>
                      <p className={getLanguageClass()}>{t.logoutConfirm}</p>
                      <div className={getLanguageClass()}>
                        <button
                          type="button"
                          onClick={() => { setMod(false); }}
                          className={getLanguageClass()}
                        >
                          {t.cancel}
                        </button>
                        <button type="button" onClick={handleLogout} className={getLanguageClass()}>
                          {t.logout}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`left-inner-2 ${getLanguageClass()}`}>
                <div className={`your-friend ${getLanguageClass()}`}>
                  <h1 className={getLanguageClass()}>{t.rating}</h1>
                  <div className={`your-friends ${getLanguageClass()}`}>
                    {friends.map((item, index) => (
                      <div key={index} className={`friend ${getLanguageClass()}`}>
                        <img src={item.image} alt={item.firstName} className={getLanguageClass()} />
                        <div className={`texts ${getLanguageClass()}`}>
                          <h2 className={getLanguageClass()}>{item.firstName}</h2>
                          <p className={getLanguageClass()}>
                            <span className={`username ${getLanguageClass()}`}>{item.username}</span>
                            <span className={`percent ${getLanguageClass()}`}>{item.percent}%</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`start-now ${getLanguageClass()}`}>
                <div className={`now-left ${getLanguageClass()}`}>
                  {t.levelUp}
                  <img src={arrow_image} alt="" className={getLanguageClass()} />
                </div>
                <Link to="/toifa-imtihonlari" className={getLanguageClass()}>{t.start}</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className={getLanguageClass()}>{t.loginPrompt}</h1>
      )}
    </section>
  );
};

export default Profile;