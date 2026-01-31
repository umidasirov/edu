import React, { useRef, useState, useEffect } from "react";
import "./toifa.scss";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";
import { api } from "../../App";

const Question = ({
  question,
  selectedAnswers,
  setSelectedAnswers,
  currentIndex,
  currentQuestionIndex,
  test,
  setCurrentQuestionIndex,
  res,
  handleNextQuestion,
  handlePreviousQuestion,
  calculateResults,
  timeLeft
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [initialDistance, setInitialDistance] = useState(null);
  useEffect(() => {
    if (!isZoomed) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomed]);
  useEffect(() => {
    if (isZoomed) {
      window.history.pushState({ isZoomed: true }, '');
      window.addEventListener('popstate', handleBackButton);
    } else {
      window.removeEventListener('popstate', handleBackButton);
    }

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isZoomed]);
  const handleBackButton = (event) => {
    if (isZoomed) {
      event.preventDefault();
      toggleZoom();
      if (window.history.state?.isZoomed) {
        window.history.back();
      }
    }
  };
  const language = localStorage.getItem("language") || "uz";
  const translations = {
    uz: {
      noQuestions: "Savollar mavjud emas!",
      questionNumber: "Savol №",
      timeUp: "Vaqt tugadi natijalar taxlil qilinmoqda...",
      previous: "Oldingi",
      next: "Keyingi",
      seeResults: "Natijani Ko'rish",
      analyzing: "Taxlil qilinmoqda...",
      of: "/",
      zoom: "Kattalashtirish"
    },
    kaa: {
      noQuestions: "Сўрақлар мавжут емес!",
      questionNumber: "Сўрақ №",
      timeUp: "Уақыт түгеди, нәтийжелер талдау этилмақта...",
      previous: "Алдыңғы",
      next: "Кейингi",
      seeResults: "Нәтийжени көриў",
      analyzing: "Талдау этилмақта...",
      of: "/",
      zoom: "Көбейтиў"
    },
    ru: {
      noQuestions: "Вопросы отсутствуют!",
      questionNumber: "Вопрос №",
      timeUp: "Время вышло, результаты анализируются...",
      previous: "Предыдущий",
      next: "Следующий",
      seeResults: "Посмотреть результаты",
      analyzing: "Анализируется...",
      of: "/",
      zoom: "Увеличить"
    },
    en: {
      noQuestions: "No questions available!",
      questionNumber: "Question №",
      timeUp: "Time's up, analyzing results...",
      previous: "Previous",
      next: "Next",
      seeResults: "See Results",
      analyzing: "Analyzing...",
      of: "/",
      zoom: "Zoom"
    }
  };
  const t = translations[language] || translations["uz"];
  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };
  const cleanText = (text) => {
    if (typeof text !== "string") return "";

    // Matematik formulalarni aniqlash
    const mathRegex = /\$[^$]*\$|\\\([^\)]*\\\)|\\\[[^\]]*\\\]/g;
    let formulas = [];
    let index = 0;

    // Formulalarni vaqtincha almashtirish
    text = text.replace(mathRegex, (match) => {
      formulas.push(match);
      return `__FORMULA_${index++}__`;
    });

    // Formulalarni qayta joylashtirish
    formulas.forEach((formula, i) => {
      text = text.replace(`__FORMULA_${i}__`, formula);
    });

    return text;
  };
  const fixImageTags = (text) => {
    return text.replace(/<img([^>]+)>/g, (match, attributes) => {
      // 'alt' va 'style' atributlarini olib tashlash
      attributes = attributes.replace(/\s*alt=["'][^"']*["']/g, "");
      attributes = attributes.replace(/\s*style=["'][^"']*["']/g, "");
      return `<img ${attributes} />`;
    });
  };
  const fixImageUrl = (text) => {
    if (typeof text !== "string") return "";
    const baseUrl = api;
    return text.replace(
      /<img\s+([^>]*?)src=["'](\/media[^"']+)["']([^>]*)>/g,
      (match, before, path, after) => {
        // `alt="QuestionImage"` va `style="..."` atributlarini olib tashlash
        const cleanedBefore = before
          .replace(/\balt=["'][^"']*["']/g, "") // alt atributini olib tashlash
          .replace(/\bstyle=["'][^"']*["']/g, "") // style atributini olib tashlash
          .trim(); // Bo‘sh joylarni tozalash

        return `<img ${cleanedBefore} src="${baseUrl}${path}" ${after}>`;
      }
    );
  };
  const renderMath = (text) => {
    if (typeof text !== "string") return "";

    // <img> teglarini vaqtincha saqlash uchun joy
    const imgPlaceholders = [];
    let imgIndex = 0;

    // <img> teglarini vaqtincha almashtirish
    text = text.replace(/<img\s+[^>]*>/g, (match) => {
      imgPlaceholders.push(match); // Tegni saqlash
      return `@@IMG${imgIndex++}@@`; // Tegni vaqtincha almashtirish
    });

    // Matematik formulalarni aniqlash
    const mathRegex =
      /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div|a\d|⍟/g;

    // Formulalarni ajratib, ularni KaTeX orqali ko'rsatish
    text = text.replace(mathRegex, (match) => {
      try {
        // a2, a3 kabi ifodalarni a^2, a^3 ga o'zgartirish
        if (match.startsWith('a')) {
          return katex.renderToString(match.replace('a', 'a^'), { throwOnError: false });
        }
        // ⍟ belgisini KaTeXda to'g'ri ko'rsatish
        if (match === '⍟') {
          return katex.renderToString('\\star', { throwOnError: false });
        }
        // Boshqa matematik formulalarni render qilish
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    // <img> teglarini qayta joylashtirish
    text = text.replace(/@@IMG(\d+)@@/g, (match, index) => {
      return imgPlaceholders[Number(index)]; // Tegni qaytarish
    });

    return text;
  };
  const fixBrokenImageTags = (text) => {
    return text.replace(
      /alt=["']?Question Image["']?\s*style=["'][^"']*["']?\s*\/?>/g,
      ""
    );
  };
  const renderQuestionText = (text) => {
    if (typeof text !== "string") return "";

    const baseUrl = api;

    // <img> teglarini vaqtincha saqlash uchun joy
    const imgPlaceholders = [];
    let imgIndex = 0;

    // <img> teglarini vaqtincha almashtirish
    text = text.replace(/<img\s+[^>]*>/g, (match) => {
      imgPlaceholders.push(match); // Tegni saqlash
      return `@@IMG${imgIndex++}@@`; // Tegni vaqtincha almashtirish
    });

    // Matematik formulalarni aniqlash va to'g'ri ko'rsatish
    const mathRegex =
      /\\frac\{.*?\}\{.*?\}|\\sum|\\sqrt|\\left|\\right|\\times|\\div|a\d|⍟/g;
    text = text.replace(mathRegex, (match) => {
      try {
        // a2, a3 kabi ifodalarni a^2, a^3 ga o'zgartirish
        if (match.startsWith("a")) {
          return katex.renderToString(match.replace("a", "a^"), {
            throwOnError: false,
          });
        }
        // ⍟ belgisini KaTeXda to'g'ri ko'rsatish
        // if (match === '⍟') {
        //   return katex.renderToString('\\star', { throwOnError: false });
        // }
        return katex.renderToString(match, { throwOnError: false });
      } catch (error) {
        console.error("KaTeX render error:", error);
        return match;
      }
    });

    // <img> teglarini qayta joylashtirish
    text = text.replace(/@@IMG(\d+)@@/g, (match, index) => {
      const imgTag = imgPlaceholders[Number(index)]; // Tegni olish
      // Rasm manzilini to'g'rilash
      return imgTag.replace(
        /<img\s+src=["'](\/media[^"']+)["']/g,
        (match, path) => `<img src="${baseUrl}${path}" />`
      );
    });

    // Noto'g'ri img taglarini to'g'rilash
    text = fixBrokenImageTags(text);

    return text;
  };
  const handleOptionSelect = (option) => {
    const updatedAnswers = selectedAnswers.filter(
      (answer) => answer.questionGuid !== question.guid
    );
    updatedAnswers.push({ questionGuid: question.guid, selectedOptionGuid: option.guid });
    setSelectedAnswers(updatedAnswers);
  };


  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  const handleZoomIn = (e) => {
    e.stopPropagation();
    const newZoom = Math.min(zoomLevel + 0.5, 3);
    setZoomLevel(newZoom);
    adjustPositionForZoom(newZoom);
  };
  const handleZoomOut = (e) => {
    e.stopPropagation();
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);

    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      adjustPositionForZoom(newZoom);
    }
  };
  const adjustPositionForZoom = (newZoom) => {
    if (imageRef.current && containerRef.current) {
      const imgWidth = imageRef.current.offsetWidth * newZoom;
      const imgHeight = imageRef.current.offsetHeight * newZoom;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
      const maxY = Math.max(0, (imgHeight - containerHeight) / 2);

      setPosition(prev => ({
        x: Math.min(Math.max(prev.x, -maxX), maxX),
        y: Math.min(Math.max(prev.y, -maxY), maxY)
      }));
    }
  };
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };
  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    if (imageRef.current && containerRef.current) {
      const imgWidth = imageRef.current.offsetWidth * zoomLevel;
      const imgHeight = imageRef.current.offsetHeight * zoomLevel;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
      const maxY = Math.max(0, (imgHeight - containerHeight) / 2);
      setPosition({
        x: Math.min(Math.max(newX, -maxX), maxX),
        y: Math.min(Math.max(newY, -maxY), maxY)
      });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
      setIsDragging(false);
    } else if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setStartPos({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      if (initialDistance) {
        const scale = 1 + (currentDistance - initialDistance) / initialDistance * 0.3;
        const newZoom = Math.min(Math.max(zoomLevel * scale, 1), 3);
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        const newPosition = {
          x: centerX - (centerX - position.x) * (newZoom / zoomLevel),
          y: centerY - (centerY - position.y) * (newZoom / zoomLevel)
        };

        setZoomLevel(newZoom);
        setPosition(newPosition);
        setInitialDistance(currentDistance);
      }
    } else if (isDragging && e.touches.length === 1) {
      const newX = e.touches[0].clientX - startPos.x;
      const newY = e.touches[0].clientY - startPos.y;

      if (imageRef.current && containerRef.current) {
        const imgWidth = imageRef.current.offsetWidth * zoomLevel;
        const imgHeight = imageRef.current.offsetHeight * zoomLevel;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
        const maxY = Math.max(0, (imgHeight - containerHeight) / 2);

        setPosition({
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        });
      }
    }
  };
  
  const handleTouchEnd = (e) => {
    if (e.touches.length === 1) {
      setInitialDistance(null);
    } else {
      setIsDragging(false);
      setInitialDistance(null);
    }
  };
  if (!question) {
    return (
      <div className={`testing-container ${getLanguageClass()}`}>
        <div className={`testing-container-inner ${getLanguageClass()}`}>
          <div className={`question-container ${getLanguageClass()}`}>
            <p className={getLanguageClass()}>{t.noQuestions}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`testing-container ${getLanguageClass()}`}>
      {isZoomed && (
        <div className={`zoom-modal`} onClick={toggleZoom}>
          <div
            className={`zoom-modal-content`}
            onClick={e => e.stopPropagation()}
            ref={containerRef}
          >
            <div className="zoom-controls">
              <button className="zoom-in" onClick={handleZoomIn}>+</button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="zoom-out" onClick={handleZoomOut}>-</button>
              <button className="close-zoom" onClick={toggleZoom}>×</button>
            </div>
            <div
              className={`zoomed-image-container`}
              onMouseDown={zoomLevel > 1 ? handleMouseDown : undefined}
              onMouseMove={zoomLevel > 1 ? handleMouseMove : undefined}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div
                className="zoomed-image-wrapper"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                  transition: 'transform 0.1s ease-out'
                }}
                ref={imageRef}
              >
                {parse(renderQuestionText(question.text))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`testing-container-inner ${getLanguageClass()}`}>
        <div className={`current-question-count ${getLanguageClass()}`}>
          {t.questionNumber} {currentIndex + 1}
          <button
            className={`zoom-button ${getLanguageClass()}`}
            onClick={toggleZoom}
            title={t.zoom}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{ fill: 'rgba(0, 0, 0, 1)', transform: '', msfilter: '' }}><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" /></svg>
          </button>
        </div>
        <div className={`question-container ${getLanguageClass()}`}>
          <div className={`question-container-inner-1 ${getLanguageClass()}`}>
            <div className={`question-text ${getLanguageClass()}`} onClick={toggleZoom}>
              {parse(renderQuestionText(question.text))}
            </div>
          </div>
        </div>
        <div className={`options ${getLanguageClass()}`}>
          {question.options.map((option, index) => (
            <div key={index} className={`options-1 ${getLanguageClass()}`}>
              <div className={`option ${getLanguageClass()}`}>
                <input
                  className={`option ${getLanguageClass()}`}
                  type="radio"
                  id={`option-${option.guid}`}
                  name={`option-${option.guid}`}
                  onChange={() => handleOptionSelect(option)}
                  checked={
                    selectedAnswers.find(
                      (answer) =>
                        answer.questionGuid === question.guid &&
                        answer.selectedOptionGuid === option.guid
                    )
                      ? true
                      : false
                  }
                />
                <label
                  htmlFor={`option-${option.guid}`}
                  className={getLanguageClass()}
                  dangerouslySetInnerHTML={{
                    __html: `<strong class="chart">${String.fromCharCode(
                      65 + index
                    )}) </strong> ${fixImageTags(
                      fixImageUrl(renderMath(cleanText(option.text)))
                    )}`,
                  }}
                ></label>
              </div>
            </div>
          ))}
        </div>

        {timeLeft === 0 && (
          <div className={`left-loading ${getLanguageClass()}`}>
            <p className={getLanguageClass()}>{t.timeUp}</p>
          </div>
        )}

        {Object.values(test?.questions || {}).flat().length ? (
          <div id="flex" className={getLanguageClass()}>
            <>
              {currentQuestionIndex > 0 && (
                <button
                  onClick={handlePreviousQuestion}
                  className={getLanguageClass()}
                >
                  {t.previous}
                </button>
              )}
              <p className={getLanguageClass()}>
                {currentQuestionIndex + 1} {t.of} {Object.values(test?.questions || {}).flat().length}
              </p>
              {currentQuestionIndex < Object.values(test?.questions || {}).flat().length - 1 ? (
                <button
                  className={`next ${getLanguageClass()}`}
                  onClick={handleNextQuestion}
                >
                  {t.next}
                </button>
              ) : (
                <button
                  onClick={calculateResults}
                  disabled={res}
                  className={getLanguageClass()}
                >
                  {res ? t.analyzing : t.seeResults}
                </button>
              )}
            </>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Question;
