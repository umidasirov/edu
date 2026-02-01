import React, { useEffect, useState, useContext } from "react";
import { Line } from "react-chartjs-2";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { api } from "../../App";
import { AccessContext } from "../../AccessContext";
import "./profile-statistics.scss";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ProfileStatistics = () => {
  const { profileData } = useContext(AccessContext);
  const [sciences, setSciences] = useState([]);
  const [tests, setTests] = useState([]);
  const [testActivityLog, setTestActivityLog] = useState([]);
  const [loginActivityLog, setLoginActivityLog] = useState([]);
  const [selectedScience, setSelectedScience] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

  const language = localStorage.getItem("language") || "uz";
  const tokenn = localStorage.getItem("accessToken");

  const translations = {
    uz: {
      chartTitle: "Test natijalari statistikasi",
      percentage: "Foiz (%)",
      activityYear: "Faollik yili:",
      scienceError: "Fanlar ro'yxatini olishda xatolik!",
      loginError: "Login faolligini olishda xatolik!",
      userError: "Foydalanuvchi topilmadi.",
      testError: "Testlarni olishda xatolik!",
      statsError: "Statistikani olishda xatolik!",
      tooltipDate: "Sana",
      tooltipAttempts: "Urinishlar",
      correctAnswers: "To'g'ri",
      time: "Vaqt"
    },
    ru: {
      chartTitle: "Статистика результатов тестов",
      percentage: "Процент (%)",
      activityYear: "Год активности:",
      scienceError: "Ошибка при получении списка предметов!",
      loginError: "Ошибка при получении активности входа!",
      userError: "Пользователь не найден.",
      testError: "Ошибка при получении тестов!",
      statsError: "Ошибка при получении статистики!",
      tooltipDate: "Дата",
      tooltipAttempts: "Попытки",
      correctAnswers: "Правильно",
      time: "Время"
    },
    en: {
      chartTitle: "Test Results Statistics",
      percentage: "Percentage (%)",
      activityYear: "Activity Year:",
      scienceError: "Error fetching subjects list!",
      loginError: "Error fetching login activity!",
      userError: "User not found.",
      testError: "Error fetching tests!",
      statsError: "Error fetching statistics!",
      tooltipDate: "Date",
      tooltipAttempts: "Attempts",
      correctAnswers: "Correct",
      time: "Time"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };


  useEffect(() => {
    const fetchLoginActivity = async () => {
      try {
        const response = await fetch(`${api}/users/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenn}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Tarmoq xatosi: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!data) {
          console.error(t.userError);
          return;
        }
        
        const loginDate = data.last_login.split("T")[0];
        const formattedLoginActivityLog = [
          {
            date: loginDate,
            count: 1,
          },
        ];
        const year = new Date(loginDate).getFullYear();
        setLoginActivityLog(formattedLoginActivityLog);
        setAvailableYears((prevYears) =>
          prevYears.includes(year) ? prevYears : [...prevYears, year]
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchLoginActivity();
  }, [profileData.id, t.loginError, t.userError]);

  // useEffect(() => {
  //   if (selectedScience) {
  //     const fetchTests = async () => {
  //       try {
  //         const response = await fetch(
  //           `${api}/tests/?science=${selectedScience}`
  //         );
  //         if (!response.ok) throw new Error(t.testError);
  //         const data = await response.json();
  //         setTests(data);
  //       } catch (error) {
  //         console.error(error.message);
  //       }
  //     };
  //     fetchTests();
  //   } else {
  //     setTests([]);
  //   }
  // }, [selectedScience, t.testError]);

  useEffect(() => {
    const fetchTestStats = async () => {
      try {
        const response = await fetch(`${api}/users/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenn}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(t.statsError);
        
        const data = await response.json();
        
        // attempts_data'dan grafikka joylash uchun ma'lumot tayyorlash
        if (data.attempts_data && Array.isArray(data.attempts_data)) {
          const formattedTestActivityLog = data.attempts_data
            .filter(attempt => attempt.finished_at) // Tugatilgan urinishlarni olish
            .map((attempt) => {
              const finishedDate = new Date(attempt.finished_at);
              return {
                date: finishedDate.toISOString().split("T")[0],
                dateTime: finishedDate,
                scorePercentage: attempt.percent || 0,
                testName: attempt.test_name || "Noma'lum test",
                totalTime: `${Math.round((new Date(attempt.ends_at) - new Date(attempt.started_at)) / 1000 / 60)} min`,
                totalQuestions: attempt.total_questions,
                correctAnswers: attempt.correct_answers,
                earnedScore: attempt.earned_score,
                totalScore: attempt.total_score,
                status: attempt.status,
                priceCharged: attempt.price_charged,
              };
            })
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)); // Eng eski birinchi
          
          setTestActivityLog(formattedTestActivityLog);
          
          // Yillarni to'plash
          const years = new Set(formattedTestActivityLog.map(log => new Date(log.dateTime).getFullYear()));
          setAvailableYears(Array.from(years).sort((a, b) => b - a));
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTestStats();
  }, [profileData.id, t.statsError, tokenn]);

  const lineChartData = {
    labels: testActivityLog.map((log) => log.date),
    datasets: [
      {
        label: "Test Natijalari (%)",
        data: testActivityLog.map((log) => ({
          x: log.date,
          y: log.scorePercentage,
          additionalInfo: log,
        })),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: testActivityLog.map((log) => {
          if (log.scorePercentage >= 80) return "rgba(75, 192, 75, 1)"; // Yashil - yaxshi
          if (log.scorePercentage >= 50) return "rgba(255, 193, 7, 1)"; // Sariq - o'rtacha
          return "rgba(255, 99, 99, 1)"; // Qizil - yomon
        }),
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "black",
        pointHoverBorderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={`profile-statistics ${getLanguageClass()}`}>
      <div className={`line-chart ${getLanguageClass()}`}>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: t.percentage,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const pointData = tooltipItem.raw.additionalInfo;
                    return `${pointData.testName
                      }: ${pointData.scorePercentage.toFixed(2)}%`;
                  },
                  afterBody: function (tooltipItem) {
                    const pointData = tooltipItem[0].raw.additionalInfo;
                    return [
                      `${t.correctAnswers}: ${pointData.correctAnswers} / ${pointData.totalQuestions}`,
                      `${t.time}: ${pointData.totalTime}`,
                    ];
                  },
                },
              },
            },
          }}
        />
      </div>
      {/* <div className={`for-width ${getLanguageClass()}`}>
        <div className={`calendar-heatmap ${getLanguageClass()}`}>
          <div className={`year-filter ${getLanguageClass()}`}>
            <label htmlFor="year-select" className={getLanguageClass()}>{t.activityYear}</label>
            <select
              id="year-select"
              value={calendarYear}
              onChange={(e) => setCalendarYear(e.target.value)}
              className={getLanguageClass()}
            >
              {availableYears.map((year) => (
                <option key={year} value={year} className={getLanguageClass()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div style={{ position: "relative" }} className={getLanguageClass()}>
            <CalendarHeatmap
              startDate={new Date(`${calendarYear}-01-01`)}
              endDate={new Date(`${calendarYear}-12-31`)}
              values={loginActivityLog.filter(
                (log) =>
                  new Date(log.date).getFullYear().toString() ===
                  calendarYear.toString()
              )}
              classForValue={(value) => {
                if (!value || value.count === 0) {
                  return "color-empty";
                }
                if (value.count >= 5) return "color-github-4";
                if (value.count >= 3) return "color-github-3";
                if (value.count >= 2) return "color-github-2";
                return "color-github-1";
              }}
              tooltipDataAttrs={(value) => {
                if (!value || !value.date) return null;
                return {
                  "data-tip": `${t.tooltipDate}: ${value.date}, ${t.tooltipAttempts}: ${value.count}`,
                };
              }}
              showWeekdayLabels={true}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileStatistics;
