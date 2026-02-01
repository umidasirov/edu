import React, { createContext, useState, useEffect } from "react";
import { api } from "./App";
import "./AccessContext.scss";

const AccessContext = createContext();

const AccessProvider = ({ children }) => {
  // For login
  const [access, setAccess] = useState(() => {
    const savedAccess = localStorage.getItem("access");
    return savedAccess === "true";
  });
  const [ successM, setSuccessM ] = useState(false);
  
  useEffect(() => {
    localStorage.setItem("access", access);
  }, [access]);

  const logout = () => {
    setAccess(false);
    localStorage.clear();

    setSuccessMessage("Muvaffaqiyatli chiqildi");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };
  // For payed courses
  const [payedCourses, setPayedCourses] = useState(null);

  // For header
  const [isActive, setIsActive] = useState(0);

  // For success message
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSuccess] = useState(null);

  // For Olympics
  const [olympic, setOlympic] = useState(null);

  // Access token
  const [token, setToken] = useState();

  // Random number
  const [randomNumber, setRandomNumber] = useState(0);
  const [deps, setDeps] = useState([]);

  // For user
  const [profileData, setProfileData] = useState([]);

  // All users
  const [allUsers, setAllUsers] = useState([]);

  // Get token
  const tokenn = localStorage.getItem("accessToken");

  // Start test
  const [startTest, setStartTest] = useState(null);

  // For Loading
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    setProfileLoading(true);
    const userProfile = async () => {
      try {
        // const response = await fetch(`${api}/user-profile/`, {
          const response = await fetch(`${api}/users/profile/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenn}`,  
              "Content-Type": "application/json",
            },
          });
          
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Tarmoq xatosi: ${response.status} - ${errorText}`);
          }
          
          const data = await response.json();
          
          setProfileData(data);
          
        } catch (error) {
          console.error("Failed to fetch profile data:", error.message);
        } finally {
          setProfileLoading(false);
      }
    };
    userProfile();
  }, [api]);


  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 101);
    setRandomNumber(randomNum);
  }, []);

  return (
    <AccessContext.Provider
      value={{
        access,
        setAccess,
        logout,
        success,
        setSuccess,
        payedCourses,
        setPayedCourses,
        isActive,
        setIsActive,
        olympic,
        setOlympic,
        setToken,
        randomNumber,
        setDeps,
        deps,
        profileData,
        setProfileData,
        allUsers,
        successM,
        setSuccessM,
        startTest,
        setStartTest,
        profileLoading
      }}
    >
      {children}
      {successMessage && (
        <div className="success-message" style={{zIndex: 999999999, textAlign: "center"}}>{successMessage}</div>
      )}
    </AccessContext.Provider>
  );
};

export { AccessContext, AccessProvider };
