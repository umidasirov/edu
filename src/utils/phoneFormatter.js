/**
 * Uzbek telefon raqamini formatga o'zgartiradi
 * @param {string} phone - Telefon raqami (masalan: "998957021012" yoki "+998957021012")
 * @returns {string} Formatlanmish telefon (masalan: "+998 (95) 702-10-12")
 */
export const formatPhoneToUzbekFormat = (phone) => {
  if (!phone) return "";

  // Barcha raqam bo'lmagan belgilarni olib tashla
  let cleaned = phone.replace(/\D/g, "");

  // Agar 12 ta raqam bo'lsa (998957021012)
  if (cleaned.length === 12) {
    return `+${cleaned.substring(0, 3)} (${cleaned.substring(3, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8, 10)}-${cleaned.substring(10, 12)}`;
  }

  // Agar 11 ta raqam bo'lsa (98957021012) - 998 dan boshlanmasada
  if (cleaned.length === 11) {
    cleaned = "9" + cleaned;
    return `+${cleaned.substring(0, 3)} (${cleaned.substring(3, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8, 10)}-${cleaned.substring(10, 12)}`;
  }

  return phone;
};

/**
 * Formatlanmish telefon raqamini tozalash - qavslar, probellar va + belgilarini olib tashlaydi
 * @param {string} phone - Formatlanmish telefon (masalan: "+998 (95) 702-10-12")
 * @returns {string} Tozalangan telefon (masalan: "998957021012")
 */
export const reFormatPhone = (phone) => {
  if (!phone) return "";
  // + , ( , ) , - , bo'sh joylarni olib tashlash
  return phone.replace(/[\s\-\(\)\+]/g, "").trim();
};

/**
 * Formatlanmish telefon raqamini 12 ta raqamga o'zgartiradi
 * @param {string} phone - Formatlanmish telefon (masalan: "+998 (95) 702-10-12")
 * @returns {string} Raqam bo'lmagan belgilar bilan (masalan: "998957021012")
 */
export const cleanPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

/**
 * Telefon raqami to'g'ri Uzbek formatida ekanligini tekshiradi
 * @param {string} phone - Telefon raqami
 * @returns {boolean}
 */
export const isValidUzbekPhone = (phone) => {
  const cleaned = cleanPhone(phone);
  return cleaned.length === 12 && cleaned.startsWith("998");
};


