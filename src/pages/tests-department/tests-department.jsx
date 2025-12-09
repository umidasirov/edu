import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AccessContext } from "../../AccessContext";

// Global Api
import { api } from "../../App";

// Style
import "./tests-department.scss";

const TestsDepartment = () => {
  window.document.title = "Testlar bo'limi";

  const { subjectId } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [complated_tests, setComplatedTests] = useState(0);

  const { access, setDeps } = useContext(AccessContext);

  useEffect(() => {
    const fetchClassesAndSubjectName = async () => {
      setLoading(true);
      try {
        const subjectResponse = await fetch(`${api}/sciences/`);
        if (!subjectResponse.ok) {
          throw new Error("Tarmoq xatosi (Fanni olishda)");
        }
        const subjectData = await subjectResponse.json();

        const subject = subjectData.find(
          (v) => Number(v.id) === Number(subjectId)
        );
        if (subject) {
          setSubjectName(subject.title);
        } else {
          throw new Error("Fan topilmadi");
        }

        const classesResponse = await fetch(`${api}/departments/`);
        if (!classesResponse.ok) {
          throw new Error("Tarmoq xatosi (Sinflarni olishda)");
        }
        const classesData = await classesResponse.json();
        const filteredClasses = classesData.filter(
          (cls) => Number(cls.science) === Number(subjectId)
        );
        setClasses(filteredClasses);
        setDeps(classesData)
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndSubjectName();
  }, [subjectId]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>Xatolik: {error}</p>;

  return (
    <section id="tests-department">
      <div>
        {access ? (
          <div>
            <h1>{subjectName}</h1>
            <p id="tests-count">
              Ishlangan testlar <span>{complated_tests || 0}</span> ta
            </p>
            <div className="department-container">
              {classes.map((cls) => (
                <div key={cls.id} className="link">
                  <Link to={`/tests-department/${subjectId}/classes/${cls.id}`}>
                    {cls.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1>Iltimos avval ro'yxatdan o'ting!</h1>
        )}
      </div>
    </section>
  );
};

export default TestsDepartment;
