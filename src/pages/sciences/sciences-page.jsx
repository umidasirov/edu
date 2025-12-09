import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../App";
import Loading from "../../components/loading/loading";

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
  };
};
const SciencesPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  document.title = "Fanlar - Edu Mark"
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`${api}/sciences/`);
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
  const isTestsPage = location.pathname === "/sciences";
  return (
    <section id="tests-list">
      <div className={isTestsPage ? "search-added" : ""}>
        <h1>Fanlar ro'yxati</h1>
        {isTestsPage && (
          <input
            type="text"
            placeholder="Fan nomini qidiring..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        )}
        {searchQuery.length >= 2 && (
          <div className="search-results">
            {filteredTests.length > 0 ? (
              <ul>
                {filteredTests.map((test) => (
                  <li key={test.id}>
                    <Link to={`/sciences/${formatLink(test.title)}`}>
                      {test.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Fan topilmadi!</p>
            )}
          </div>
        )}
      </div>
      {loading ? (
        <p><Loading /></p>
      ) : error ? (
        <p>
          Internet sekinga o'xshaydi, iltimos{" "}
          <span onClick={reloadPage}>qayta</span> harakat qiling!
        </p>
      ) : tests.length === 0 ? (
        <p>Fanlar mavjud emas.</p>
      ) : (
        <ul>
          {tests.map((test) => (
            <li className="w-30">
              <Link
                to={`/sciences/${formatLink(test.title)}`}
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
                          Qiyinchiligi:
                        </span>
                        <span
                          className="count"
                          style={{ color: test.colorStyles.color }}
                        >
                          100 / {test.difficulty || 0}
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

export default SciencesPage;
