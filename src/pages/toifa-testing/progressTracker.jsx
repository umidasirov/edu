import "./toifa.scss";
import { useEffect, useState } from 'react';
import { api } from '../../App';

const ProgressTracker = ({
  test,
  selectedAnswers,
  currentQuestionIndex,
  isTestFinished,
  setCurrentQuestionIndex,
  groupedQuestions
}) => {
  const [sciences, setSciences] = useState([]);
  const [loading, setLoading] = useState(true);
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      loading: "Fanlar yuklanmoqda...",
      questionsCount: "savol",
      professionalStandard: " (Kasbiy standart)",
      pedagogicalSkill: " (Pedagogik mahorat)",
      error: "Fanlarni olishda xatolik yuz berdi"
    },
    kaa: {
      loading: "Фанлар жүктелип атыр... ",
      questionsCount: "сўрақ",
      professionalStandard: " (Кәсбий стандарт) ",
      pedagogicalSkill: " (Педагогик маһарат) ",
      error: "Фанларды алыўда қате болдı"
    },
    ru: {
      loading: "Загрузка предметов...",
      questionsCount: "вопросов",
      professionalStandard: " (Профстандарт)",
      pedagogicalSkill: " (Педагогическое мастерство)",
      error: "Ошибка при получении предметов"
    },
    en: {
      loading: "Loading subjects...",
      questionsCount: "questions",
      professionalStandard: " (Professional standard)",
      pedagogicalSkill: " (Pedagogical skill)",
      error: "Error fetching subjects"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  useEffect(() => {
    const fetchSciences = async () => {
      try {
        if (!test?.science) return;
        
        const response = await fetch(`${api}/sciences/`);
        if (!response.ok) throw new Error(t.error);
        const data = await response.json();
        const filteredSciences = data.filter(science =>
          test.science.includes(science.id)
        );

        setSciences(filteredSciences);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSciences();
  }, [test?.science, t.error]);

  const groupQuestionsByScience = () => {
    if (!test?.questions_grouped_by_science) return [];
    
    const grouped = [];
    let currentIndex = 0;

    // Iterate through questions_grouped_by_science in the original order
    Object.entries(test.questions_grouped_by_science).forEach(([scienceName, questions]) => {
      const group = {
        name: scienceName,
        questions: questions,
        count: questions.length,
        startIndex: currentIndex
      };
      
      grouped.push(group);
      currentIndex += group.count;
    });

    return grouped;
  };

  const getQuestionStatus = (question, index) => {
    let status = "neutral";
    const answer = selectedAnswers?.find((ans) => ans.questionId === question.id);
    const isAnswered = !!answer;
    let answerText = "";

    if (isAnswered && answer?.id) {
      const selectedOptionIndex = question.options?.findIndex(
        (opt) => opt.id === answer.id
      );
      if (selectedOptionIndex !== -1) {
        answerText = String.fromCharCode(65 + selectedOptionIndex);
      }
    }

    if (isTestFinished) {
      if (isAnswered) {
        status = answer.is_staff ? "correct" : "incorrect";
      } else {
        status = "unanswered";
      }
    } else {
      if (isAnswered) {
        status += " bel";
      }
    }

    return { status, answerText };
  };

  const formatScienceTitle = (title) => {
    if (!title) return "";
    
    if (title.startsWith("Barchasi")) {
      if (title.includes("Pedmahorat") || title.includes("_ped_mahorat")) {
        return `Barchasi${t.pedagogicalSkill}`;
      } else if (title.includes("Kasbiy") || title.includes("_kasbiy")) {
        return `Barchasi${t.professionalStandard}`;
      }
    }

    if (title.includes("_kasbiy_stan") || title.includes("Kasbiy_standart")) {
      return `${title.split('_')[0]}${t.professionalStandard}`;
    } else if (title.includes("_ped_mahorat") || title.includes("Pedmahorat")) {
      return `${title.split('_')[0]}${t.pedagogicalSkill}`;
    } else {
      return title.split("_")[0];
    }
  };

  const scienceGroups = groupQuestionsByScience();
  if (!scienceGroups.length) return null;

  return (
    <div className={`progress-trackerr ${getLanguageClass()}`}>
      {scienceGroups.map((science, scienceIndex) => (
        <div key={scienceIndex} className={`subject-section ${getLanguageClass()}`}>
          <div className={`subject-header ${getLanguageClass()}`}>
            <h3 className={getLanguageClass()}>{formatScienceTitle(science.name, scienceIndex)}</h3>
            <span className={`question-count ${getLanguageClass()}`}>
              {science.count} {t.questionsCount}
            </span>
          </div>
          <div className={`subject-questions ${getLanguageClass()}`}>
            {science.questions?.map((question, index) => {
              const globalIndex = science.startIndex + index;
              const { status, answerText } = getQuestionStatus(question, globalIndex);

              return (
                <div
                  key={globalIndex}
                  className={`circle ${status} ${getLanguageClass()}`}
                  onClick={() => setCurrentQuestionIndex(globalIndex)}
                  style={{ cursor: "pointer" }}
                >
                  {globalIndex + 1}
                  {answerText && `-${answerText}`}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;