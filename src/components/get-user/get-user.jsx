import { jwtDecode } from "jwt-decode";

const getUserFromToken = () => {
  // const token = localStorage.getItem("accessToken");
  // if (token) {
  //     console.log("Token:", token);
  //     console.log("Decoded:", jwtDecode(token));
  // } else {
  //     console.log("Token mavjud emas!");
  // }
  
  // if (!token) {
  //   return null;
  // }

  // try {
  //   const decoded = jwtDecode(token);
  //   return {
  //     name: decoded.name || decoded.fullname || null,
  //     userId: decoded.id || null,
  //     is_superuser: decoded.is_superuser || false, 
  //   };
  // } catch (error) {
  //   console.error("Tokenni dekodlashda xato:", error);
  //   return null;
  // }
};

export default getUserFromToken;
