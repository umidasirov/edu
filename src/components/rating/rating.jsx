import React, { useEffect, useState } from 'react';
import crown from "../../assets/crown.png";
import "./rating.scss";
import BalanceTopUp from '../top-up-balance/top-up-balance';
import { api } from '../../App';

const Rating = ({ userId, allUsers, balance }) => {
  const [userRank, setUserRank] = useState(null);
  const [results, setResults] = useState([]);
  const language = localStorage.getItem("language") || "uz";
  
  const translations = {
    uz: {
      amongUsers: "ta foydalanuvchilar ichida",
      yourPosition: "O'rindasiz",
      myBalance: "Mening balansim",
      currency: "so'm"
    },
    ru: {
      amongUsers: "пользователей среди",
      yourPosition: "Место",
      myBalance: "Мой баланс",
      currency: "сум"
    },
    en: {
      amongUsers: "users among",
      yourPosition: "Position",
      myBalance: "My balance",
      currency: "UZS"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  // useEffect(() => {
  //   fetch(`${api}/user_rank/${userId.id}/`)
  //     .then(response => response.json()) 
  //     .then(data => {
  //       setUserRank(data); 
  //       setResults(data.results || []); 
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user rank:', error);  
  //     });
  // }, [userId.id]); 

  const formattedNumber = new Intl.NumberFormat('ru-RU').format(balance ? balance : 0);

  return (
    <div id='rating' className={getLanguageClass()}>
      <div className={`ichi ${getLanguageClass()}`}>
        {userRank && (
          <>
            <p className={getLanguageClass()}>{allUsers.user_count} {t.amongUsers}</p>
            <p className={getLanguageClass()}>
              <img src={crown} alt="crown" className={getLanguageClass()}/>
              <span className={getLanguageClass()}>{userRank?.rank || 0}</span>
            </p>
            <p className={getLanguageClass()}>{t.yourPosition}</p>
          </>
        )}
      </div>
      <div className={`line ${getLanguageClass()}`}></div>
      <div className={`ni ${getLanguageClass()}`}>
        <p id='f-p' className={getLanguageClass()}>{t.myBalance}</p>
        <div className={`results-cont ${getLanguageClass()}`}>
          <p className={getLanguageClass()}>{formattedNumber} {t.currency}</p>
          <BalanceTopUp user={userId}/>
        </div>
      </div>
    </div>
  );
};

export default Rating;