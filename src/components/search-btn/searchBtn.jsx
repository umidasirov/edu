import React, { useState } from 'react';
// Global api
import { api } from '../../App';
// Styles
import "./searchBtn.scss";
const SearchBtn = () => {
  const [showInput, setShowInput] = useState(false)
  const inputHandleShow = () => {
    setShowInput(!showInput);
    if (!showInput) {
      document.getElementsByClassName("search-btn")[0].style.width = "250px";
    } else {
      document.getElementsByClassName("search-btn")[0].style.width = "50px";
    }
  }
  const [data, setData] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${api}/search/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const result = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="search-btn">
      <form action="" method='post' onSubmit={handleSubmit}>
        {
          showInput && (
            <>
              <input
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Qidiruv"
              />
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" fill="#fff" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </>
          )
        }
        <div className={`opener ${showInput ? "active" : ""}`} onClick={inputHandleShow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" fill="#fff" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      </form>
    </div>
  )
}

export default SearchBtn;