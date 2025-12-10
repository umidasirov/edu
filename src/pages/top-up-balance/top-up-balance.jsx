import React, { useContext, useEffect, useState } from "react";
import "./top-up-balance.scss";
import click from "./click.jpg";
import payme from "./payme.jpg";
import { api } from "../../App";
import { AccessContext } from "../../AccessContext";

const BalanceTopUp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("payme");
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState();
  const [shaxLoading, setShaxloading] = useState(false);
  const { profileData } = useContext(AccessContext);

  const language = localStorage.getItem("language") || "uz";

  // Tezkor summalar ro'yxati
  const quickAmounts = [5000, 10000, 15000];

  const translations = {
    uz: {
      title: "Hisobni to'ldirish",
      paymentMethod: "To'lov usulini tanlang:",
      paymentVia: "orqali",
      payme: "Payme",
      click: "Click",
      amountPlaceholder: "Summani kiriting",
      currency: "so'm",
      errorMinAmount: "Minimal 5 000 so'm kiriting!",
      errorInvalidAmount: "Iltimos, to'g'ri summa kiriting!",
      errorPaymentLink: "To'lov linkini olishda xatolik yuz berdi!",
      errorGeneral: "Xatolik yuz berdi, qayta urinib ko'ring!",
      payButton: "To'lov qilish",
      payingButton: "To'lov qilinmoqda...",
      regionsError: "Viloyatlar ma'lumotini olishda xatolik yuz berdi.",
      quickAmounts: "Tezkor summalar:"
    },
    ru: {
      title: "Пополнение баланса",
      paymentMethod: "Выберите способ оплаты:",
      paymentVia: "через",
      payme: "Payme",
      click: "Click",
      amountPlaceholder: "Введите сумму",
      currency: "сум",
      errorMinAmount: "Минимальная сумма 5 000 сум!",
      errorInvalidAmount: "Пожалуйста, введите правильную сумму!",
      errorPaymentLink: "Ошибка при получении платежной ссылки!",
      errorGeneral: "Произошла ошибка, попробуйте еще раз!",
      payButton: "Оплатить",
      payingButton: "Оплата...",
      regionsError: "Ошибка при получении данных о регионах.",
      quickAmounts: "Быстрые суммы:"
    },
    en: {
      title: "Top Up Balance",
      paymentMethod: "Select payment method:",
      paymentVia: "via",
      payme: "Payme",
      click: "Click",
      amountPlaceholder: "Enter amount",
      currency: "UZS",
      errorMinAmount: "Minimum amount is 5 000 UZS!",
      errorInvalidAmount: "Please enter a valid amount!",
      errorPaymentLink: "Error getting payment link!",
      errorGeneral: "An error occurred, please try again!",
      payButton: "Make Payment",
      payingButton: "Processing payment...",
      regionsError: "Error fetching regions data.",
      quickAmounts: "Quick amounts:"
    }
  };

  const t = translations[language] || translations["uz"];

  const regionsURL =
    "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";

  const formatAmount = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleChange = (e) => {
    setAmount(e.target.value.replace(/\D/g, ""));
  };

  // Tezkor summani tanlash funksiyasi
  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    setError(null); // Xatoliklarni tozalash
  };

  useEffect(() => {
    const fetchRegions = async () => {
      setShaxloading(true);

      try {
        const response = await fetch(regionsURL);
        if (response.ok) {
          const data = await response.json();
          const fdata = data.filter(
            (e) => Number(e.id) === Number(profileData.province)
          );
          setRegions(fdata);
        } else {
          console.error(t.regionsError);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setShaxloading(false);
      }
    };

    fetchRegions();
  }, [profileData.province, t.regionsError]);

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError(t.errorInvalidAmount);
      return;
    } else if (amount < 5000) { // Minimal summa 5000 so'm
      setError(t.errorMinAmount);
      return;
    }
    setShaxloading(true);

    try {
      const userId = profileData.id;
      const orderRes = await fetch(`${api}/get_order_id/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const orderData = await orderRes.json();
      const orderId = orderData.order_id;

      const orderCreateRes = await fetch(
        `${api}/order/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: profileData.name,
            address: regions[0]?.name_uz || "qwe",
            total_cost: parseInt(amount),
            payment_method: paymentMethod,
            customer: userId,
            order_id: orderId,
          }),
        }
      );
      const orderCreateData = await orderCreateRes.json();
      if (orderCreateData.payment_link) {
        window.location.href = orderCreateData.payment_link;
      } else {
        setError(t.errorPaymentLink);
      }
    } catch (error) {
      setError(t.errorGeneral);
    } finally {
      setShaxloading(false);
    }
  };

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  return (
    <div className={getLanguageClass()}>
      <div className={`up-form ${getLanguageClass()}`}>
        <h2 className={getLanguageClass()}>{t.title}</h2>
        <div className={`modal-content ${getLanguageClass()}`}>
          <h3 className={getLanguageClass()}>
            {t.paymentMethod} <span className={getLanguageClass()}>{paymentMethod === "payme" ? t.payme : t.click}</span> {t.paymentVia}
          </h3>
          <div className={`payment-method ${getLanguageClass()}`}>
            <button
              onClick={() => setPaymentMethod("payme")}
              className={`${paymentMethod === "payme" ? "active" : ""} ${getLanguageClass()}`}
              style={{ backgroundImage: `url(${payme})` }}
              aria-label={t.payme}
            ></button>
          </div>
          <div className={`top-up-modal ${getLanguageClass()}`}>
            <div id="inp-w-s" className={`wallet-input ${getLanguageClass()}`} style={{ position: "relative" }}>
              <i className="fas fa-wallet" style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                color: "#555",
                pointerEvents: "none"
              }}></i>

              <input
                type="text"
                placeholder={t.amountPlaceholder}
                name="total_cost"
                value={formatAmount(amount)}
                onChange={handleChange}
                className={getLanguageClass()}
                style={{ paddingLeft: "35px" }}
              />

              <span className={getLanguageClass()} style={{ marginLeft: "5px" }}>{t.currency}</span>
            </div>
            <div className={`quick-amounts ${getLanguageClass()}`}>
              <p className={getLanguageClass()}>{t.quickAmounts}</p>
              <div className={`amount-buttons ${getLanguageClass()}`}>
                {quickAmounts.map((quickAmount) => {
                  const numericAmount = amount.replace(/\D/g, "");
                  const isActive = numericAmount === quickAmount.toString();

                  return (
                    <button
                      key={quickAmount}
                      onClick={() => handleQuickAmount(quickAmount)}
                      className={`${isActive ? "active" : ""} ${getLanguageClass()}`}
                    >
                      {new Intl.NumberFormat().format(quickAmount)} {t.currency}
                    </button>
                  );
                })}

              </div>
            </div>
            {error && (
              <p className={getLanguageClass()} style={{
                fontSize: "15px",
                color: "red",
                margin: "7px 0 0 0",
                textAlign: "left",
              }}>
                {error}
              </p>
            )}
            <div className={`modal-btn ${getLanguageClass()}`}>
              <button
                onClick={handlePayment}
                disabled={shaxLoading}
                className={`${shaxLoading ? "ac" : ""} ${getLanguageClass()}`}
              >
                {shaxLoading ? t.payingButton : t.payButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;