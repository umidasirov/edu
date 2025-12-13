import { useLocation, useNavigate } from 'react-router-dom';
// import "./complatedTests.scss";

const ComplatedTestDetails = () => {
  const navigate = useNavigate();
  const { state: testData } = useLocation();

  if (!testData) {
    return <div>Ma'lumot topilmadi</div>;
  }

  const renderQuestionText = (text) => {
    if (typeof text !== "string") return "";
    return text;
  };

  return (
    <div id='complated'>
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Orqaga
      </button>
      
      <h2>Test natijalari: {testData.test_title}</h2>
      
      <div className="test-detail-container">
        <div className="detail-section">
          <h3>Umumiy ma'lumot</h3>
          <div className="detail-row">
            <span>Sana:</span>
            <span>
              {new Date(testData.created_at).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })} | {new Date(testData.created_at).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="detail-row">
            <span>Umumiy savollar:</span>
            <span>{testData.total_questions}</span>
          </div>
          <div className="detail-row">
            <span>To'g'ri javoblar:</span>
            <span>{testData.correct_answers}</span>
          </div>
          <div className="detail-row">
            <span>Noto'g'ri javoblar:</span>
            <span>{testData.incorrect_answers}</span>
          </div>
          <div className="detail-row">
            <span>Foiz:</span>
            <span>{testData.percentage_correct}%</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Savollar va javoblar</h3>
          {testData.questions?.map((question, index) => {
            const userAnswer = testData.selected_answers?.find(
              (answer) => answer.question_id === question.id
            );
            
            return (
              <div key={index} className="question-review">
                <div className="question-option-line">
                  <p className="question-text">
                    <span className="q-count">{index + 1}.</span>
                    <span>{renderQuestionText(question.text)}</span>
                  </p>
                  
                  <div className="options-container">
                    {question.options.map((option, optionIndex) => {
                      let status = "";
                      
                      // To'g'ri javob
                      if (option.is_staff) {
                        status = "correct";
                      }
                      // Foydalanuvchi tanlagan noto'g'ri javob
                      else if (userAnswer && userAnswer.option_id === option.id) {
                        status = "incorrect";
                      }
                      // Foydalanuvchi javob bermagan to'g'ri javob
                      else if (!userAnswer && option.is_staff) {
                        status = "blue";
                      }

                      return (
                        <div key={option.id} className={`option ${status}`}>
                          <strong className="chart">
                            {String.fromCharCode(65 + optionIndex)})
                          </strong>
                          <span>{renderQuestionText(option.text)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplatedTestDetails;