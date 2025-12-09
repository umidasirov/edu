import React, { useEffect, useState, useRef } from "react";
import "./lang.scss";

const LanguageSelector = () => {
  const validLanguages = ["uz", "ru", "en", 'kaa'];
  const storedLanguage = localStorage.getItem("language");
  const defaultLanguage = validLanguages.includes(storedLanguage) ? storedLanguage : "uz";
  
  const [language, setLanguage] = useState(defaultLanguage);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Body bosilganda dropdownni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    if (validLanguages.includes(lang)) {
      setLanguage(lang);
      localStorage.setItem("language", lang);
      window.location.reload();
    } else {
      // Fallback to Uzbek if invalid language
      setLanguage("uz");
      localStorage.setItem("language", "uz");
      window.location.reload();
    }
  };

  const getLangLabel = (lang) => {
    const langAssets = {
      uz: { label: "O'zbekcha", image: "/uz.svg", className: "" },
      kaa: { label: "Qora qalpoqcha", image: "/kaa.png", className: "ru" },
      ru: { label: "Русский", image: "/ru.png", className: "ru" },
      en: { label: "English", image: "/en.webp", className: "" },
    };
  
    // Fallback to Uzbek if invalid language
    const langData = langAssets[validLanguages.includes(lang) ? lang : "uz"];
  
    return (
      <span className={`set ${langData.className}`} onClick={() => setShowDropdown(!showDropdown)}>
        <img
          src={langData.image}
          alt={lang}
          className={langData.className}
        />
        <span className={langData.className}>{langData.label}</span>
      </span>
    );
  };

  return (
    <div 
      className={`currentLang ${language === "ru" ? "ru" : ""}`} 
      onClick={() => setShowDropdown(!showDropdown)}
      ref={dropdownRef}
    >
      {getLangLabel(language)}
        <div className={`lang-drop ${language === "ru" ? "ru" : ""} ${showDropdown ? "active" : ""}`}>
          {validLanguages
            .filter((lang) => lang !== language)
            .map((lang) => (
              <div
                key={lang}
                className={lang === "ru" ? "ru" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLanguageChange(lang);
                }}
              >
                {getLangLabel(lang)}
              </div>
            ))}
        </div>
    </div>
  );
};

export default LanguageSelector;