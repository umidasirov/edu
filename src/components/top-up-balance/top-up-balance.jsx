import React, { useEffect, useState } from "react";
import "./top-up-balance.scss";
import click from "./click.jpg";
import payme from "./payme.jpg";
import { api } from "../../App";

const BalanceTopUp = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("payme");
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState();
  const [shaxLoading, setShaxloading] = useState(false);
  const language = localStorage.getItem("language") || "uz";

  const translations = {
    uz: {
      topUpBalance: "Balansni oshirish +",
      chooseMethod: "To'lov usulini tanlang:",
      via: "orqali",
      enterAmount: "Summani kiriting (so'm)",
      currency: "so'm",
      paymentProcessing: "To'lov qilinmoqda...",
      makePayment: "To'lov qilish",
      cancel: "Bekor qilish",
      amountError: "Iltimos, to'g'ri summa kiriting!",
      minAmountError: "Minimal 5000 so'm kiriting!",
      linkError: "To'lov linkini olishda xatolik yuz berdi!",
      generalError: "Xatolik yuz berdi, qayta urinib ko'ring!",
      quickAmounts: "Tezkor summalar:"

    },
    ru: {
      topUpBalance: "Пополнить баланс +",
      chooseMethod: "Выберите способ оплаты:",
      via: "через",
      enterAmount: "Введите сумму (сум)",
      currency: "сум",
      paymentProcessing: "Оплата обрабатывается...",
      makePayment: "Оплатить",
      cancel: "Отмена",
      amountError: "Пожалуйста, введите правильную сумму!",
      minAmountError: "Минимальная сумма 5000 сум!",
      linkError: "Ошибка при получении платежной ссылки!",
      generalError: "Произошла ошибка, попробуйте снова!",
      quickAmounts: "Быстрые суммы:"

    },
    en: {
      topUpBalance: "Top Up Balance +",
      chooseMethod: "Choose payment method:",
      via: "via",
      enterAmount: "Enter amount (UZS)",
      currency: "UZS",
      paymentProcessing: "Processing payment...",
      makePayment: "Make Payment",
      cancel: "Cancel",
      amountError: "Please enter a valid amount!",
      minAmountError: "Minimum amount is 5000 UZS!",
      linkError: "Error getting payment link!",
      generalError: "An error occurred, please try again!",
      quickAmounts: "Quick amounts:"

    }
  };

  const t = translations[language] || translations["uz"];

  const getLanguageClass = () => {
    return language === "ru" || language === "kaa" ? "ru" : "";
  };

  const regionsURL =
    "https://raw.githubusercontent.com/MIMAXUZ/uzbekistan-regions-data/master/JSON/regions.json";

  const formatAmount = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleChange = (e) => {
    setAmount(e.target.value.replace(/\D/g, ""));
  };

  useEffect(() => {
    const fetchRegions = async () => {
      setShaxloading(true);

      try {
        const response = await fetch(regionsURL);
        if (response.ok) {
          const data = await response.json();
          const fdata = data.filter(
            (e) => Number(e.id) === Number(user.province)
          );
          setRegions(fdata);
        } else {
          console.error("Error fetching regions data");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setShaxloading(false);
      }
    };

    fetchRegions();
  }, [user.province]);

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError(t.amountError);
      return;
    } else if (amount < 5000) {
      setError(t.minAmountError);
      return;
    }
    setShaxloading(true);

    try {
      const userId = user.id;
      const orderRes = await fetch(`${api}/get_order_id/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const orderData = await orderRes.json();
      const orderId = orderData.order_id;


      const paymentAPI =
        paymentMethod === "payme"
          ? `${api}/order/create/`
          : "https://edu-api.adxamov.uz/pyclick/process/click/transaction/create/";

      const requestBody =
        paymentMethod === "payme"
          ? {
            customer_name: user.name,
            address: regions[0]?.name_uz || "qwe",
            total_cost: parseInt(amount),
            payment_method: paymentMethod,
            customer: userId,
            order_id: orderId,
          }
          : {
            click_trans_id: 1,
            service_id: 1,
            merchant_trans_id: 1,
            merchant_prepare_id: 1,
            amount: parseInt(amount),
            action: 1,
            error: 1,
            error_note: 1,
            sign_time: 1,
            sign_string: 1,
            click_pydoc_id: 1,
            user: userId,
          };

      const orderCreateRes = await fetch(paymentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const orderCreateData = await orderCreateRes.json();
      if (orderCreateData.payment_link) {
        window.location.href = orderCreateData.payment_link;
      } else {
        setError(t.linkError);
      }
    } catch (error) {
      setError(t.generalError);
      console.error("Payment error:", error, "asd");
    } finally {
      setShaxloading(false);
    }
  };

  const quickAmounts = [5000, 10000, 15000];

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    setError(null);
  };


  return (
    <div className={getLanguageClass()}>
      <button onClick={() => setIsOpen(true)} className={getLanguageClass()}>
        {t.topUpBalance}
      </button>
      <div className={`modal-popup ${isOpen ? "active" : ""} ${getLanguageClass()}`}>
        <div className={`modal-content ${getLanguageClass()}`}>
          <h3 className={getLanguageClass()}>
            {t.chooseMethod} <span>{paymentMethod === "payme" ? "Payme" : "Click"}</span> {t.via}
          </h3>
          <div className={`payment-method ${getLanguageClass()}`}>
            <button
              onClick={() => setPaymentMethod("payme")}
              className={`${paymentMethod === "payme" ? "active" : ""} ${getLanguageClass()}`}
              style={{ backgroundImage: `url(${payme})` }}
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
                  const numericAmount = (amount || "").replace(/\D/g, "");
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

            <p
              style={{
                fontSize: "15px",
                color: "red",
                margin: 0,
                textAlign: "left",
              }}
              className={getLanguageClass()}
            >
              {error}
            </p>
            <div className={`modal-btn ${getLanguageClass()}`}>
              <button onClick={() => setIsOpen(false)} className={getLanguageClass()}>
                {t.cancel}
              </button>
              <button onClick={handlePayment} disabled={shaxLoading} className={getLanguageClass()}>
                {shaxLoading ? t.paymentProcessing : t.makePayment}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;
