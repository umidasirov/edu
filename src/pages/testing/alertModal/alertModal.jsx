import React, { useEffect } from 'react';
import './alertModal.scss';

const AlertModal = ({ show, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Always prevent default when our modal is showing
      e.preventDefault();
      e.returnValue = '';
    };

    // Only add the listener when our modal is NOT showing
    if (!show) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Testni tark etmoqchimisiz?</h3>
        <p>Sahifani yangilash yoki yopish test natijalaringizni yo'qotishiga olib keladi</p>
        
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">
            Davom etish
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Chiqish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;