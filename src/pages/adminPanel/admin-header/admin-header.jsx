import React, { useContext } from "react";
import "./admin-header.scss";
import logo from "../../../components/header/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AccessContext } from "../../../AccessContext";

const AdminHeader = () => {
  const { logout } = useContext(AccessContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <marquee behavior="" direction="">
        Platforma sinov tariqasia ishga tushurilgan!
      </marquee>
      <div id="admin-header">
        <div className="admin-header-inner">
          <div className="logo">
            <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/sciences"
            >
              <img src={logo} alt="" />
            </NavLink>
          </div>
          <div className="menus">
            <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/sciences"
            >
              Fanlar
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/departments"
            >
              Bo'limlar
            </NavLink>
            {/* <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/tests"
            >
              Testlar
            </NavLink> */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/create-tests"
            >
              Testlar yaratish
            </NavLink>
            {/* <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/statics"
            >
              Statistikalar
            </NavLink> */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/add-word"
            >
              Word qo'shish
            </NavLink>
            {/* <NavLink
              className={({ isActive }) =>
                isActive ? "active-admin-link" : ""
              }
              to="/admin/schools"
            >
              Maktablar qo'shish
            </NavLink> */}
          </div>
          <div className="admin-name">
            <button id="logout" onClick={handleLogout}>
              Chiqish
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
