import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccessContext } from "../../AccessContext";
import { api } from "../../App";
import InputMask from "react-input-mask";
import "./edit-profile.scss";
import Success from "../../components/success-message/success";
import { use } from "react";

const regionsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";
const districtsURL =
  "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/districts.json";


const EditProfile = () => {
  const { access, profileData: profileDataFromContext } = useContext(AccessContext);
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [districts, setDistricts] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [profileData, setProfileData] = useState({});
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  
  
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("accessToken");
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      title: "Profilni taxrirlash",
      successMessage: "Muvaffaqiyatli yangilandi!",
      name: "Ism",
      surname: "Familiya",
      username: "Foydalanuvchi nomi",
      phone: "Telefon raqami",
      birthDate: "Tug'ilgan sana (DD.MM.YYYY)",
      email: "Email",
      password: "Parol",
      gender: "Jins",
      male: "Erkak",
      female: "Ayol",
      region: "Viloyat",
      district: "Tuman",
      selectRegion: "Viloyatni tanlang",
      selectDistrict: "Tumanni tanlang",
      save: "Saqlash",
      requiredField: " maydonini to'ldirish shart!",
      phoneError: "To'liq telefon raqamini kiriting!",
      dateError: "Sana formati noto'g'ri! DD.MM.YYYY kiriting.",
      dayError: "Kun faqat 01-31 oralig'ida bo'lishi kerak!",
      monthError: "Oy faqat 01-12 oralig'ida bo'lishi kerak!",
      yearError: (currentYear) => `Yil 1900 va ${currentYear} oralig'ida bo'lishi kerak!`,
      passwordError: "Parol kamida 6 ta belgi bo'lishi kerak!",
      loginPrompt: "Avval tizimga kiring!",
      networkError: "Tarmoq xatosi yuz berdi.",
      unknownError: "Noma'lum xato",
      accessDenied: "Ba shou na xoii"
    },
    ru: {
      title: "Редактировать профиль",
      successMessage: "Успешно обновлено!",
      name: "Имя",
      surname: "Фамилия",
      username: "Имя пользователя",
      phone: "Номер телефона",
      birthDate: "Дата рождения (ДД.ММ.ГГГГ)",
      email: "Email",
      password: "Пароль",
      gender: "Пол",
      male: "Мужчина",
      female: "Женщина",
      region: "Область",
      district: "Район",
      selectRegion: "Выберите область",
      selectDistrict: "Выберите район",
      save: "Сохранить",
      requiredField: " обязателен для заполнения!",
      phoneError: "Введите полный номер телефона!",
      dateError: "Неверный формат даты! Введите ДД.ММ.ГГГГ.",
      dayError: "День должен быть между 01 и 31!",
      monthError: "Месяц должен быть между 01 и 12!",
      yearError: (currentYear) => `Год должен быть между 1900 и ${currentYear}!`,
      passwordError: "Пароль должен содержать минимум 6 символов!",
      loginPrompt: "Пожалуйста, войдите в систему!",
      networkError: "Произошла сетевая ошибка.",
      unknownError: "Неизвестная ошибка",
      accessDenied: "Доступ запрещен"
    },
    en: {
      title: "Edit Profile",
      successMessage: "Successfully updated!",
      name: "Name",
      surname: "Surname",
      username: "Username",
      phone: "Phone number",
      birthDate: "Birth date (DD.MM.YYYY)",
      email: "Email",
      password: "Password",
      gender: "Gender",
      male: "Male",
      female: "Female",
      region: "Region",
      district: "District",
      selectRegion: "Select region",
      selectDistrict: "Select district",
      save: "Save",
      requiredField: " field is required!",
      phoneError: "Please enter full phone number!",
      dateError: "Invalid date format! Enter DD.MM.YYYY.",
      dayError: "Day must be between 01-31!",
      monthError: "Month must be between 01-12!",
      yearError: (currentYear) => `Year must be between 1900 and ${currentYear}!`,
      passwordError: "Password must be at least 6 characters!",
      loginPrompt: "Please log in first!",
      networkError: "Network error occurred.",
      unknownError: "Unknown error",
      accessDenied: "Access denied"
    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };


  const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

const formatDateForAPI = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
};

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(regionsURL);
        if (!response.ok)
          throw new Error("Error fetching regions data");
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const userProfile = async () => {
      try {
        const response = await fetch(`${api}/users/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok)
          throw new Error("Error fetching user data");
        const data = await response.json();
        setFormData({
          first_name: data.first_name || data.name || "",
          last_name: data.last_name || data.surname || "",
          phone: data.phone || data.phone_number || "",
          birth_date: formatDateForDisplay(data.birth_date) || formatDateForDisplay(data.age) || "",
          gender: data.gender || "",
          email: data.email || "",
          district: data.district || "",
          region: data.region || "",
          username: data.username || "",
          password: "",
        });
        setUsername(data.username || "");
        
        // Find region by name
        const regionObj = regions.find(r => r.name_uz === data.region || r.name_ru === data.region);
        if (regionObj) {
          setSelectedRegion(regionObj.id);
          fetchDistricts(regionObj.id);
        }
        setSelectedDistrict(data.district || "");
      } catch (error) {
        console.error("Failed to fetch profile data:", error.message);
      }
    };
    userProfile();
  }, [api]);

  const fetchDistricts = async (regionId) => {
    try {
      const response = await fetch(districtsURL);
      if (!response.ok)
        throw new Error("Error fetching districts data");
      const data = await response.json();
      const regionDistricts = data.filter(
        (district) => district.region_id === Number(regionId)
      );
      setDistricts(regionDistricts);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegionChange = (event) => {
    const selectedRegionId = event.target.value;
    setSelectedRegion(selectedRegionId);
    setFormData(prev => ({ ...prev, region: selectedRegionId }));
    fetchDistricts(selectedRegionId);
    setSelectedDistrict("");
    setFormData(prev => ({ ...prev, district: "" }));
  };

  const handleDistrictChange = (event) => {
    const value = event.target.value;
    setSelectedDistrict(value);
    setFormData(prev => ({ ...prev, district: value }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateDate = (date) => {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = date.match(regex);
    if (!match) return t.dateError;
    let [_, day, month, year] = match;
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    if (day < 1 || day > 31) return t.dayError;
    if (month < 1 || month > 12) return t.monthError;
    if (year < 1900 || year > currentYear) return t.yearError(currentYear);
    return "";
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.first_name.trim()) errors.first_name = t.name + t.requiredField;
    if (!formData.last_name.trim()) errors.last_name = t.surname + t.requiredField;
    if (!formData.phone.trim() || formData.phone.includes("_"))
      errors.phone = t.phoneError;
    if (!formData.birth_date.trim() || formData.birth_date.includes("_")) {
      errors.birth_date = t.birthDate + t.requiredField;
    } else {
      let dateError = validateDate(formData.birth_date);
      if (dateError) errors.birth_date = dateError;
    }
    if (!selectedRegion) errors.region = t.region + t.requiredField;
    if (!selectedDistrict) errors.district = t.district + t.requiredField;
    if (formData.password && formData.password.length < 6)
      errors.password = t.passwordError;
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      alert(t.loginPrompt);
      navigate("/login");
      return;
    }
    try {
      const regionObj = regions.find(r => r.id == selectedRegion);
      const regionName = regionObj ? (language === "ru" ? regionObj.name_ru : regionObj.name_uz.replace(/�/g, "'")) : selectedRegion;
      let updatedData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        birth_date: formatDateForAPI(formData.birth_date),
        gender: formData.gender,
        email: formData.email,
        region: regionName.name_uz,
        district: formData.district,
        username: username,
        password: formData.password,
      };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      console.log(updatedData);
      
      const response = await fetch(`${api}/users/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Error: " + (errorData.message || t.unknownError));
      }
    } catch (error) {
      console.error("Error:", error);
      alert(t.networkError);
    }
  };

  return (
    <section id="profile-section" className={getLanguageClass()}>
      {access ? (
        <div className={`profile-container ${getLanguageClass()}`}>
          {success && <Success text={t.successMessage}/>}
          <h1 id="edit-profile-heading" className={getLanguageClass()}>{t.title}</h1>
          <div className={`edit-profile-content ${getLanguageClass()}`}>
            <div className={`left ${getLanguageClass()}`}>
              <div className={`edit-profile-container ${getLanguageClass()}`}>
                <form onSubmit={handleSubmit} className={getLanguageClass()}>
                  <div className={`edit-content ${getLanguageClass()}`}>
                    <div className={`input-row ${errors.first_name ? "err-border" : ""} ${getLanguageClass()}`}>
                      <input
                        type="text"
                        placeholder={t.name}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      />
                      {errors.first_name && (
                        <span className={`error ${getLanguageClass()}`}>{errors.first_name}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.last_name ? "err-border" : ""} ${getLanguageClass()}`}>
                      <input
                        type="text"
                        placeholder={t.surname}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      />
                      {errors.last_name && (
                        <span className={`error ${getLanguageClass()}`}>{errors.last_name}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.username ? "err-border" : ""} ${getLanguageClass()}`}>
                      <input
                        type="text"
                        placeholder={t.username}
                        name="username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setFormData(prev => ({ ...prev, username: e.target.value })); }}
                        className={getLanguageClass()}
                      />
                      {errors.username && (
                        <span className={`error ${getLanguageClass()}`}>{errors.username}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.phone ? "err-border" : ""} ${getLanguageClass()}`}>
                      <InputMask
                        mask="+\9\9\8 (99) 999-99-99"
                        placeholder={t.phone}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      >
                        {(inputProps) => <input {...inputProps} type="text" className={getLanguageClass()}/>}
                      </InputMask>
                      {errors.phone && (
                        <span className={`error ${getLanguageClass()}`}>{errors.phone}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.birth_date ? "err-border" : ""} ${getLanguageClass()}`}>
                      <InputMask
                        mask="99.99.9999"
                        placeholder={t.birthDate}
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      >
                        {(inputProps) => <input {...inputProps} type="text" className={getLanguageClass()}/>}
                      </InputMask>
                      {errors.birth_date && (
                        <span className={`error ${getLanguageClass()}`}>{errors.birth_date}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.email ? "err-border" : ""} ${getLanguageClass()}`}>
                      <input
                        type="email"
                        placeholder={t.email}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      />
                      {errors.email && (
                        <span className={`error ${getLanguageClass()}`}>{errors.email}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.password ? "err-border" : ""} ${getLanguageClass()}`}>
                      <input
                        type="password"
                        placeholder={t.password}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      />
                      {errors.password && (
                        <span className={`error ${getLanguageClass()}`}>{errors.password}</span>
                      )}
                    </div>
                    <div className={`input-row ${getLanguageClass()}`}>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={getLanguageClass()}
                      >
                        <option value="male" className={getLanguageClass()}>{t.male}</option>
                        <option value="female" className={getLanguageClass()}>{t.female}</option>
                      </select>
                    </div>
                    <div className={`input-row ${errors.region ? "err-border" : ""} ${getLanguageClass()}`}>
                      <select
                        id="regionSelect"
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        className={getLanguageClass()}
                      >
                        <option value="" disabled className={getLanguageClass()}>
                          {t.selectRegion}
                        </option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id} className={getLanguageClass()}>
                            {language === "ru" ? region.name_ru : region.name_uz.replace(/�/g, "'")}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <span className={`error ${getLanguageClass()}`}>{errors.region}</span>
                      )}
                    </div>
                    <div className={`input-row ${errors.district ? "err-border" : ""} ${getLanguageClass()}`}>
                      <select
                        id="districtSelect"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        className={getLanguageClass()}
                      >
                        <option value="" disabled className={getLanguageClass()}>
                          {t.selectDistrict}
                        </option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.name_uz} className={getLanguageClass()}>
                            {language === "ru" ? district.name_ru : district.name_uz.replace(/�/g, "'")}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <span className={`error ${getLanguageClass()}`}>{errors.district}</span>
                      )}
                    </div>
                  </div>
                  <button type="submit" className={getLanguageClass()}>{t.save}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className={getLanguageClass()}>{t.accessDenied}</h1>
      )}
    </section>
  );
};

export default EditProfile;