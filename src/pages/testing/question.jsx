import React, { useState, useRef, useEffect } from "react";
import "./test-detail.scss";
import ProgressTracker from "./proccessTracker";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";

const Question = ({
  question,
  selectedAnswers,
  setSelectedAnswers,
  currentIndex,
  currentQuestionIndex,
  test,
  setCurrentQuestionIndex,
}) => {

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [initialDistance, setInitialDistance] = useState(null); // <- Bu qatorni qo'shing


  useEffect(() => {
    if (!isZoomed) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomed]);

  useEffect(() => {
    if (isZoomed) {
      // Zoom ochilganda history'ga yangi state qo'shamiz
      window.history.pushState({ isZoomed: true }, '');

      // Ortga qaytish tugmasi uchun event listener qo'shamiz
      window.addEventListener('popstate', handleBackButton);
    } else {
      // Zoom yopilganda event listener ni olib tashlaymiz
      window.removeEventListener('popstate', handleBackButton);
    }

    // Komponent unmount bo'lganda tozalash
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isZoomed]);

  const handleBackButton = (event) => {
    if (isZoomed) {
      // Agar zoom ochiq bo'lsa, brauzerning default ortga qaytishini oldini olamiz
      event.preventDefault();
      toggleZoom(); // Zoom modalni yopamiz

      // History'dan biz qo'shgan state ni olib tashlaymiz
      if (window.history.state?.isZoomed) {
        window.history.back();
      }
    }
  };

  if (!question) {
    return (
      <div className="testing-container">
        <div className="testing-container-inner">
          <div className="question-container">
            <p>Savollar mavjud emas!</p>
          </div>
        </div>
      </div>
    );
  }



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
    const baseUrl = "https://edumark.adxamov.uz";
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

    const baseUrl = "https://edumark.uz";

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
      (answer) => answer.questionId !== question.id
    );

    const newAnswer = {
      questionId: question.id,
      id: option.id,
      text: option.text,
      is_staff: option.is_staff // Make sure this matches your data structure
    };

    setSelectedAnswers([...updatedAnswers, newAnswer]);
  };

  // Helper function to check if an option is selected
  const isOptionSelected = (optionId) => {
    return selectedAnswers.some(
      (answer) =>
        answer.questionId === question.id &&
        answer.id === optionId
    );
  };

  const getOptionClass = (optionId) => {
    return isOptionSelected(optionId) ? "option active" : "option";
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    const newZoom = Math.min(zoomLevel + 0.5, 3);
    setZoomLevel(newZoom);
    // Zoom qilinganda pozitsiyani markazga yaqinlashtiramiz
    adjustPositionForZoom(newZoom);
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);

    // Agar zoom 1 bo'lsa, pozitsiyani markazga qaytaramiz
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      adjustPositionForZoom(newZoom);
    }
  };

  // Zoom o'zgarganda pozitsiyani to'g'irlash
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
      // 2 barmoq bilan zoom boshlanganda
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
      setIsDragging(false); // Drag ni to'xtatamiz
    } else if (zoomLevel > 1 && e.touches.length === 1) {
      // 1 barmoq bilan drag
      setIsDragging(true);
      setStartPos({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // 2 barmoq bilan zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Joriy masofani hisoblaymiz
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      if (initialDistance) {
        // Zoom darajasini hisoblaymiz (sekinroq o'zgarish uchun 0.1 koeffitsient)
        const scale = 1 + (currentDistance - initialDistance) / initialDistance * 0.3;
        const newZoom = Math.min(Math.max(zoomLevel * scale, 1), 3);
        
        // Zoom markazini hisoblaymiz
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        // Yangi pozitsiyani hisoblaymiz
        const newPosition = {
          x: centerX - (centerX - position.x) * (newZoom / zoomLevel),
          y: centerY - (centerY - position.y) * (newZoom / zoomLevel)
        };
        
        setZoomLevel(newZoom);
        setPosition(newPosition);
        setInitialDistance(currentDistance); // Yangi masofani saqlaymiz
      }
    } else if (isDragging && e.touches.length === 1) {
      // 1 barmoq bilan drag
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
      // 1 barmoq qolganda drag ni davom ettiramiz
      setInitialDistance(null);
    } else {
      // Barcha barmoqlar ko'tarilganda
      setIsDragging(false);
      setInitialDistance(null);
    }
  };
  console.log("mana:",question);
  
  return (
    <div className="testing-container mo">
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
      <div className="testing-container-inner">
        <div className="question-container">
          <p id="current-question-count">{currentIndex + 1}.</p>
          <button
            className={`zoom-button n `}
            onClick={toggleZoom}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{ fill: 'rgba(0, 0, 0, 1)', transform: '', msfilter: '' }}><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" /></svg>

          </button>
          <div className="question-container-inner-1">
            <div className="question-text" onClick={toggleZoom}>
              {parse(renderQuestionText(question.text))}
            </div>
          </div>
        </div>
        <div className="options options-1">
          {question.options.map((option, index) => (
            <div key={option.id} className={getOptionClass(option.id)}>
              <div className="option-content">
                <input
                  type="radio"
                  id={`option-${option.guid}`}
                  name={`option-${option.guid}`}
                  onChange={() => handleOptionSelect(option.guid)}
                  checked={isOptionSelected(option.guid)}
                />
                  <p>{option.guid}</p>
                <label
                  htmlFor={`option-${option.guid}`}
                  dangerouslySetInnerHTML={{
                    __html: `<strong class="chart">${String.fromCharCode(
                      65 + index
                    )}.</strong> ${fixImageTags(
                      fixImageUrl(renderMath(cleanText(option.text)))
                    )}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProgressTracker
        test={test}
        selectedAnswers={selectedAnswers}
        currentQuestionIndex={currentQuestionIndex}
        isTestFinished={false}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default Question;
