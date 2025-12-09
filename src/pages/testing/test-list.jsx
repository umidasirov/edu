import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../App";
import "./test-list.scss";
import Loading from "../../components/loading/loading";

const colors = [
  "rgba(255, 99, 132, 0.5)", // Red
  "rgba(54, 162, 235, 0.5)", // Blue
  "rgba(255, 206, 86, 0.5)", // Yellow
  "rgba(75, 192, 192, 0.5)", // Teal
  "rgba(153, 102, 255, 0.5)", // Purple
  "rgba(255, 159, 64, 0.5)", // Orange
];

const getRandomColorStyles = (color) => {
  const darkerColor = color.replace(/0.5\)$/, "0.8)");
  return {
    boxShadow: `0px 0px 10px 0 ${color}`,
    border: `2px solid ${color}`,
    backgroundColor: color.replace(/0.5\)$/, "0.2)"),
    color: darkerColor,
  };
};

const TestsList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null); 
  const access = localStorage.getItem("accessToken");
  const [filteredTests, setFilteredTests] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");

  document.title = "Testlar - Edu Mark"

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`${api}/tests/`);
        if (!response.ok) throw new Error("Testlarni olishda xato yuz berdi.");
        const data = await response.json();

        const sortedTests = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


        const testsWithColors = sortedTests.map((test) => {
          const randomIndex = Math.floor(Math.random() * colors.length);
          const color = colors[randomIndex];
          return {
            ...test,
            colorStyles: getRandomColorStyles(color),
          };
        });

        setTests(testsWithColors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length < 2) {
      setFilteredTests(tests); 
    } else {
      const results = tests.filter((test) =>
        test.title.toLowerCase().includes(query)
      );
      setFilteredTests(results);
    }
  };

  const formatLink = (text) => {
    return text
      .replace(/'/g, "")
      .replace(/\s+/g, "-") 
      .toLowerCase();
  };

  const location = useLocation();
  const isTestsPage = location.pathname === "/school/tests";

  return (
    <section id="tests-list">
      <div className={isTestsPage ? "search-added" : ""}>
        <h1>Testlar Ro'yxati</h1>

        {isTestsPage && (
          <input
            type="text"
            placeholder="Test nomini qidiring..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        )}

        {/* 🔍 Qidiruv natijalari */}
        {searchQuery.length >= 2 && (
          <div className="search-results">
            {filteredTests.length > 0 ? (
              <ul>
                {filteredTests.map((test) => (
                  <li key={test.id}>
                    <Link to={`/school/${formatLink(test.title)}`}>
                      {test.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Test topilmadi!</p>
            )}
          </div>
        )}
      </div>
      {loading ? (
        <p><Loading /></p>
      ) : error ? (
        <p>
          Server bilan bog'lanishda xatolik
        </p>
      ) : tests.length === 0 ? (
        <p>Testlar mavjud emas.</p>
      ) : (
        <ul>
          {tests.map((test) => (
            <li className="w-30">
              <Link
                to={`/school/${formatLink(test.title)}`}
                key={test.id}
                className="w-30"
              >
                <div className="test-items" style={test.colorStyles}>
                  <img src={test.img} alt="" />
                  <div className="texts">
                    <h1 style={{ color: test.colorStyles.color }}>
                      {test.title}
                    </h1>
                    <ul>
                      <li>
                        <span>
                          <span
                            className="green"
                            style={{ backgroundColor: test.colorStyles.color }}
                          ></span>
                          Testlar soni:
                        </span>
                        <span
                          className="count"
                          style={{ color: test.colorStyles.color }}
                        >
                          {test.questions.length || 0} ta
                        </span>
                      </li>
                      <li>
                        <span>
                          <span
                            className="green"
                            style={{ backgroundColor: test.colorStyles.color }}
                          ></span>
                          O'tish bali:
                        </span>
                        <span
                          className="count"
                          style={{ color: test.colorStyles.color }}
                        >
                          {test.score || 0}
                        </span>
                      </li>
                      <li>
                        <span>
                          <span
                            className="green"
                            style={{ backgroundColor: test.colorStyles.color }}
                          ></span>
                          Vaqti:
                        </span>
                        <span
                          className="count"
                          style={{ color: test.colorStyles.color }}
                        >
                          {test.time || "Noma'lum"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TestsList;
