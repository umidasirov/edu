import React from "react";

// Style
import "./test-about.scss";

// Images
import test from "./test-shablon.png";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";
import down_arrow from "./down-arrow.png";

const TestAbout = () => {
  return (
    <section id="test-section">
      <h1>
        Bizning Test tizimimizning <span>qulayliklari</span>
      </h1>
      <div className="test-about-container">
        <div className="left">
          <img src={test} alt="" />
        </div>
        <div className="right">
          <div className="right-item">
            <img className="numbers" src={one} alt="" />
            <div className="text">
              <h2>Barcha uchun</h2>
              <p>
                1-4-sinf bolalar uchun ajoyib va qiziqarli savollar
              </p>
            </div>
          </div>
          <img id="down-arrow" src={down_arrow} alt="" />
          <div className="right-item">
            <img className="numbers" src={two} alt="" />
            <div className="text">
              <h2>Barcha uchun</h2>
              <p>
                Siz har bir yechgan testingizdagi <br /> statistikalarni ko'rishingiz mumkun.
              </p>
            </div>
          </div>
          <img id="down-arrow" src={down_arrow} alt="" />

          <div className="right-item">
            <img className="numbers" src={three} alt="" />
            <div className="text">
              <h2>Barcha uchun</h2>
              <p>
                Siz o’z do’stlaringiz bilan bilimingizni <br />
                sinash imkoniyati, bellashuvlar barchasi bizda
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestAbout;
