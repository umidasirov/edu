import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './backBlock.scss'

const BackButtonModalHandler = () => {
    const [nextPath, setNextPath] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        window.history.pushState(null, "", window.location.pathname);

        const handlePopState = () => {
            setNextPath('/');
            setShowModal(true);
        };

        window.addEventListener('popstate', handlePopState)
    })

    const handleCancel = () => {};
    const handleConfirm = () => {};

  return (
    <>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Siz sahifani tark etmoqchisizmi?</p>
            <button onClick={handleCancel}>Yo'q, qolaman</button>
            <button onClick={handleConfirm}>Ha, chiqaman</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BackButtonModalHandler;