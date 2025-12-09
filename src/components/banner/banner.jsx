import React from "react";
import { Link } from "react-router-dom";
import banner from "./imtihon.jpg";
import "./banner.scss";

const Banner = () => {
    return (
        <section id="banner">
            <img src={banner} alt="Attestatsiya kurslari" />
            <div className="overlay" />
            <div className="text-container">
                <div className="text-content">
                    <h1>
                        Ustozlar, bilimlaringizni sinab ko‘rish va rivojlantirish vaqti keldi!
                    </h1>
                    <Link to="/toifa-imtihonlari" className="cta-btn">
                        O‘zingizni sinab ko‘ring
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Banner;
