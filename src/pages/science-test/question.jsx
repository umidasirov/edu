import React from "react";
import "../testing/test-detail.scss";
import ProgressTracker from "./proccessTracker";

const Question = ({
  question,
  selectedAnswers,
  setSelectedAnswers,
  currentIndex,
  currentQuestionIndex,
  test,
  setCurrentQuestionIndex,
}) => {
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
  const handleOptionSelect = (option) => {
    const updatedAnswers = selectedAnswers.filter(
      (answer) => answer.questionId !== question.id
    );
    updatedAnswers.push({ questionId: question.id, ...option });
    setSelectedAnswers(updatedAnswers);
  };

  return (
    <div className="testing-container">
      <div className="testing-container-inner">
        <div className="question-container">
          <p id="current-question-count">{currentIndex + 1}.</p>
          <div
            className="question-container-inner"
            dangerouslySetInnerHTML={{ __html: question.question_text }}
          ></div>
        </div>
        <div>
          {question.options.map((option, index) => (
            <div key={option.id} className="options">
              <div className="option">
                <input
                  className="option"
                  type="radio"
                  id={`option-${option.id}`}
                  name={`option-${question.id}`}
                  onChange={() => handleOptionSelect(option)}
                  checked={
                    selectedAnswers.find(
                      (answer) =>
                        answer.questionId === question.id &&
                        answer.id === option.id
                    )
                      ? true
                      : false
                  }
                />
                <label
                  htmlFor={`option-${option.id}`}
                  dangerouslySetInnerHTML={{
                    __html: `<strong class="chart">${String.fromCharCode(
                      65 + index
                    )}.</strong> ${option.option_text}`,
                  }}
                ></label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProgressTracker
        selectedAnswers={selectedAnswers}
        currentQuestionIndex={currentQuestionIndex}
        isTestFinished={false}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        questions={test}
      />
    </div>
  );
};

export default Question;
