import React from 'react';
import "./banner.scss";
import { Link } from 'react-router-dom';
import banner from "./a.jpg";
const Banner = () => {
    return (
        <div id='banner'>
            <img src={banner} alt="" />
            <div className="text-container">
                <div className="text-container-left">
                    <h1>
                        Ustozlar uchun attestatsiya imtihonlariga sifatli tayyorlov kurslari tez orada ishga tushadi.<span><Link to="/teachers/attestatsiya-kurslari">O‘zingizni sinab ko‘ring</Link></span>
                    </h1>
                </div>
                {/* <div className="text-container-right">
                    <button>Tekshirib ko'rish</button>
                </div> */}
            </div>
        </div>
    )
}

export default Banner