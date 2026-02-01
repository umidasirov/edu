import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home/home";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import TestsDepartment from "./pages/tests-department/tests-department";
import Profile from "./pages/profile/profile";
import EditProfile from "./pages/edit-profile/edit-profile";
import AdminSciences from "./pages/adminPanel/admin-sciences/admin-sciences";
import AdminHeader from "./pages/adminPanel/admin-header/admin-header";
import AdminDepartments from "./pages/adminPanel/admin-departments/admin-departments";
import AdminTests from "./pages/adminPanel/admin-tests/admin-tests";
import AdminCreateTests from "./pages/adminPanel/admin-create-test/admin-create-test";
import NotFound from "./pages/not-found/not-found";
import TestsList from "./pages/testing/test-list";
import TestDetails from "./pages/testing/test-detail";
import AdminStatics from "./pages/adminPanel/admin-statics/admin-statics";
import AboutTestSchool from "./pages/about-test-school/about-test-school";
import SciencesPage from "./pages/sciences/sciences-page";
import ScrollToTop from "./components/to-top/to-top";
import SciencesDetail from "./pages/sciences-detail/sciences-detail";
import ScienceTest from "./pages/science-test/science-test";
import AdminSchools from "./pages/adminPanel/admin-schools/adminSchools";
import useAutoLogout from "./components/token-expired";
import AddWord from "./pages/adminPanel/add-word/add-word";
import BalanceTopUp from "./pages/top-up-balance/top-up-balance";
import Toifa from "./pages/toifa-imtixonlari/toifa";
import ToifaDetail from "./pages/toifa-testing/toifa";
import ToifaBySubject from "./pages/toifa-by-subject/toifaBySubject";
import Contact from "./pages/contact2/contact";
import PasswordRecovery from "./pages/passwordRecovery/passRecovery";
import VideoCourse from "./pages/video-courses/video-course";
import VideoCourseDetail from "./pages/video-course-detail/video-course-detail";
import AlertPopup from "./components/alertPopup/alertPopup";

export const api = "https://api.edumark.uz"
// export const api = "http://localhost:3001/api";

const useFetchProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }
        // const response = await fetch(`${api}/user-profile/`, {
        const response = await fetch(`${api}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
        console.error("Profil ma'lumotlarini olishda xatolik:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [api]);

  return { profileData, loading };
};

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminHeader /> : <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  const { profileData, loading } = useFetchProfile();
  useAutoLogout();

  return (
    <Router>
      <ScrollToTop />
      <AlertPopup />
      <Routes>
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route
                  path="tests-department/:subjectId"
                  element={<TestsDepartment />}
                />
                <Route path="profile" element={<Profile />} />
                <Route path="edit-profile" element={<EditProfile />} />

                {profileData && profileData.is_superuser ? (
                  <>
                    <Route
                      path="/admin/sciences"
                      element={<AdminSciences />}
                    />
                    <Route
                      path="/admin/departments"
                      element={<AdminDepartments />}
                    />
                    {/* <Route path="/admin/tests" element={<AdminTests />} /> */}
                    <Route
                      path="/admin/create-tests"
                      element={<AdminCreateTests />}
                    />
                    {/* <Route path="/admin/statics" element={<AdminStatics />} /> */}

                    <Route path="/admin/schools" element={<AdminSchools />} />
                    <Route path="/admin/add-word" element={<AddWord />} />
                  </>
                ) : null}

                <Route path="/sciences/:name" element={<SciencesDetail />} />
                <Route path="/schools/:name" element={<AboutTestSchool />} />
                <Route
                  path="/school/:name/test/:id"
                  element={<TestDetails />}
                />
                <Route
                  path="/sciences/:name/test/:question/:time"
                  element={<ScienceTest />}
                />
                <Route path="/top-up-balance" element={<BalanceTopUp />}/>
                <Route path="/:name" element={<Toifa />}/>
                <Route
                  path="/toifa/:name/fan/:id"
                  element={<ToifaDetail />}
                />
                <Route path="/toifa-imtihonlari/:subject" element={<ToifaBySubject />} />
                <Route path="contact" element={<Contact />}/>
                <Route path="pass-recovery" element={<PasswordRecovery />}/>
                <Route path="/video-courses" element={<VideoCourse />} />
                <Route path="/video-courses/:name/:id" element={<VideoCourseDetail />}/>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
