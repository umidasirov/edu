import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AccessContext } from "../../AccessContext";

// Global api
import { api } from "../../App";

// Style
import "./sciences.scss";

const colors = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(54, 162, 235, 0.5)",
  "rgba(255, 206, 86, 0.5)",
  "rgba(75, 192, 192, 0.5)",
  "rgba(153, 102, 255, 0.5)",
  "rgba(255, 159, 64, 0.5)", 
];

const getRandomColorStyles = (color) => {
  const darkerColor = color.replace(/0.5\)$/, "0.8)");

  return {
    boxShadow: `0px 0px 10px 0 ${color}`,
    border: `2px solid ${color}`,
    backgroundColor: color.replace(/0.5\)$/, "0.2)"),
    color: darkerColor,
    greenColor: color
  };
};

const Sciences = () => {
  const { access } = useContext(AccessContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sciencesResponse = await fetch(`${api}/sciences/`);
        if (!sciencesResponse.ok) {
          throw new Error("Network error");
        }
        const sciencesData = await sciencesResponse.json();
        const subjectsWithDetailsPromises = sciencesData.map(async (subject) => {
          const departmentsResponse = await fetch(`${api}/departments/?subjectId=${subject.id}`);
          if (!departmentsResponse.ok) {
            throw new Error("Network error");
          }
          const departmentsData = await departmentsResponse.json();
          const filteredDepartments = departmentsData.filter(department => department.science === subject.id);
          const questionsPromises = filteredDepartments.map(async (department) => {
            const questionsResponse = await fetch(`${api}/questions/?departmentId=${department.id}`);
            if (!questionsResponse.ok) {
              throw new Error("Network error");
            }
            const questionsData = await questionsResponse.json();
            const filteredQuestions = questionsData.filter(question => question.department === department.id);
            return filteredQuestions.length;
          });
          const questionsCounts = await Promise.all(questionsPromises);
          const totalQuestions = questionsCounts.reduce((acc, count) => acc + count, 0);
          const randomIndex = Math.floor(Math.random() * colors.length);
          const color = colors[randomIndex];
          const colorStyles = getRandomColorStyles(color);
          return {
            ...subject,
            departmentsCount: filteredDepartments.length,
            totalQuestions,
            colorStyles,
          };
        });
        const subjectsWithDetails = await Promise.all(subjectsWithDetailsPromises);
        setSubjects(subjectsWithDetails);
      } catch (error) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="sciences-section">
      <div className="sciences-container">
        <h1 id="heading-1">Fanlar</h1>
        <p id="text-1">Test ishlash uchun shunchaki fanni tanlang</p>
        {loading ? (
          <p>Yuklanmoqda...</p>
        ) : error ? (
          <p>Xatolik: {error}</p>
        ) : (
          <div className="sciences-container">
            {subjects.map((data, index) => (
              <Link to={access ? `/tests-department/${data.id}` : `/login`} key={index}>
                <div className="sciences-items" style={data.colorStyles}>
                  <img src={data.img} alt="" />
                  <div className="texts">
                    <h1 style={{ color: data.colorStyles.color }}>{data.title}</h1>
                    <ul>
                      <li>
                        <span>
                          <span className="green" style={{ color: data.colorStyles.greenColor }}></span>
                          Testlar soni:
                        </span>
                        <span className="count" style={{ color: data.colorStyles.color }}>{data.totalQuestions}ta</span>
                      </li>
                      <li>
                        <span>
                          <span className="green" style={{ color: data.colorStyles.greenColor }}></span>
                          Murakkabligi:
                        </span>
                        <span className="count" style={{ color: data.colorStyles.color }}>
                          100/{data.difficulty || 0}
                        </span>
                      </li>
                      <li>
                        <span>
                          <span className="green" style={{ color: data.colorStyles.greenColor }}></span>Bo'limlar:
                        </span>
                        <span className="count" style={{ color: data.colorStyles.color }}>{data.departmentsCount}ta</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Sciences;
