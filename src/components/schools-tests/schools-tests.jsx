import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./schools-tests.scss";
import { api } from "../../App";
import Loading from "../loading/loading";

const SchoolsTests = () => {
  const [schools, setSchools] = useState([]);
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const language = localStorage.getItem("language") || "uz";

  // Translations for static texts
  const translations = {
    uz: {
      titlePart1: "Prezident",
      titlePart2: "maktablariga kirish uchun rasmiy va ishonchli tayyorlov testlari",
      subtitle: "Eng yuqori sifatli, amaliy va real imtihonlarga mos testlar to‘plami",
      loadingText: "Maktablar yuklanmoqda...",
      errorText: "Xatolik:",
      testCount: "ta",
    },
    kaa: {
      titlePart1: "Президент",
      titlePart2: "мектеплерге кириў ушын расмий ве ишенимли тайёрлаў тестлери",
      subtitle: "Эң жокъары сапалы, амалий ве хақиқий имтиҳанларға уйқас тестлер жыйнағы",
      loadingText: "Мектеплер жүкленмекте...",
      errorText: "Хато:",
      testCount: "та",
    },
    ru: {
      titlePart1: "Президент",
      titlePart2: "официальные и надежные подготовительные тесты для поступления в школы",
      subtitle: "Набор тестов высочайшего качества, практических и соответствующих реальным экзаменам",
      loadingText: "Школы загружаются...",
      errorText: "Ошибка:",
      testCount: "шт",
    },
    en: {
      titlePart1: "President",
      titlePart2: "official and reliable preparatory tests for school admissions",
      subtitle: "A collection of the highest quality, practical, and exam-realistic tests",
      loadingText: "Schools are loading...",
      errorText: "Error:",
      testCount: "pcs",
    },
  };

  const t = translations[language] || translations["uz"];

  // Function to add language class for Russian
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, testsResponse] = await Promise.all([
          fetch(`${api}/category-test-count/`),
          fetch(`${api}/tests_title/`),
        ]);

        if (!categoriesResponse.ok || !testsResponse.ok) {
          throw new Error("Network error");
        }

        const categoriesData = await categoriesResponse.json();
        const testsData = await testsResponse.json();

        const testsArray = testsData.tests || [];

        const enrichedCategories = categoriesData.slice(0, 4).map(category => {
          const categoryTests = testsArray.filter(
            test => test.category === category.id
          );

          return {
            ...category,
            tests: categoryTests,
            testsCount: categoryTests.length
          };
        });

        setSchools(enrichedCategories);
      } catch (error) {
        setError(error.message);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLink = (text) => {
    return text
      .replace(/'/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  return (
    <div className={`schools-tests ${getLanguageClass()}`} id="schools-tests">
      <h1 className={getLanguageClass()}>
        <span className={getLanguageClass()}>{t.titlePart1}</span> {t.titlePart2}
      </h1>
      <h2 className={getLanguageClass()}>{t.subtitle}</h2>
      {loading && (
        <div className={`test-loading ${getLanguageClass()}`}>
          <div className="test-spinner"></div>
          <span className={getLanguageClass()}>{t.loadingText}</span>
        </div>
      )}
      {errors && (
        <p className={getLanguageClass()}>
          {t.errorText} <span className={getLanguageClass()}>{errors}</span>
        </p>
      )}
      <div className={`schools-cards`}>
        {schools.map((school, index) => {
          // Statik test sonlarini belgilash
          const staticTestCounts = [14, 185, 9, 9];
          const testCount = staticTestCounts[index] || school.test_count;

          return (
            <Link
              to={`schools/${formatLink(school.category_title)}`}
              key={index}
              className={getLanguageClass()}
            >
              <div className={`school-card ${getLanguageClass()}`}>
                <img
                  src={`${school?.category_img}`}
                  alt={school.category_title}
                  className={getLanguageClass()}
                />
                <p>{school.category_title}</p>
                <span className={getLanguageClass()}>
                  {testCount} {t.testCount}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SchoolsTests;