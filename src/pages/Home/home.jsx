import React, { useContext } from "react";
import ForStudents from "../../components/for-students/for-students";
import High_rating from "../../components/high-rating/high-rating";
// Style
import "./home.scss";

// Images
import Data from "../../components/datas/data";
import TestAbout from "../../components/test-section/test-about";
import TestsList from "../testing/test-list";
import SciencesPage from "../sciences/sciences-page";
import AboutTestSchool from "../about-test-school/about-test-school";
import SchoolsTests from "../../components/schools-tests/schools-tests";
import PaidCourses from "../../components/paid-courses/paid_courses";
import TeachersTest from "../../components/teachers-test/teachers-test";
import Contact from "../contact2/contact";
import Banner from "../../components/banner/banner";

const Home = () => {
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      title: "Bosh sahifa"
    },
    kaa: {
      title: "Бас бет"
    },
    ru: {
      title: "Главная"
    },
    en: {
      title: "Home"
    }
  };

  const t = translations[language] || translations["uz"];
  window.document.title = t.title;
  
  return (
    <div>
      <ForStudents />
      {/* <SchoolsTests /> */}
      <TeachersTest />
      <Banner />
      <High_rating />
      {/* <TestsList /> */}
      {/* <Data /> */}
      {/* <PaidCourses/> */}
      {/* <TestAbout /> */}
      {/* <SciencesPage /> */}
      <Contact isHomepage={true}/>
    </div>
  );
};

export default Home;
