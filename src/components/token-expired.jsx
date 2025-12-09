import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AccessContext } from "../AccessContext";

const useAutoLogout = () => {
  const { logout } = useContext(AccessContext); // Context'dan logout olish

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;
        const timeLeft = expirationTime - Date.now();

        if (timeLeft <= 0) {
          logoutUser();
        } else {
          const timeoutId = setTimeout(logoutUser, timeLeft);
          return () => clearTimeout(timeoutId); // Cleanup qilish
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logoutUser();
      }
    };

    const logoutUser = () => {
      localStorage.removeItem("accessToken"); // Faqat tokenni o‘chir
      logout(); // Context orqali logout qilish
      window.location.href = "/"; // Sahifani yangilash
    };

    checkTokenExpiration();
  }, [logout]); // Dependency arrayga `logout` qo‘shildi

};

export default useAutoLogout;
