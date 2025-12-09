import { useEffect, useState } from "react";
import "./style.scss"
export function UseTestMode(shouldBlock) {
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [confirmedAction, setConfirmedAction] = useState(false);

  // Handle link clicks and language change attempts with warning message
  useEffect(() => {
    if (!shouldBlock) return;

    const handleClick = (e) => {
      const link = e.target.closest('a');
      const languageSwitcher = e.target.closest('.currentLang'); // Detect language switcher
      
      if (languageSwitcher) {
        e.preventDefault();
        e.stopPropagation();
        setWarningMessage("Test ishlash jarayonida tillarni o'zgartirib bo'lmaydi!");
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
      }
      else if (link && !link.hasAttribute('data-test-allowed')) {
        e.preventDefault();
        e.stopPropagation();
        setWarningMessage("Test jarayonida sahifalarga o'tish mumkin emas!");
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [shouldBlock]);

  // Prevent refresh (same as before)
  useEffect(() => {
    if (!shouldBlock) return;

    document.body.style.overscrollBehaviorY = 'contain';

    const handleBeforeUnload = (e) => {
      if (!confirmedAction && !showModal) {
        e.preventDefault();
        setShowModal(true);
        e.returnValue = "";
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
        setShowModal(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      if (touchY - touchStartY > 100 && touchStartY < 50) {
        e.preventDefault();
        setShowModal(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overscrollBehaviorY = '';
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [shouldBlock, confirmedAction, showModal]);

  const handleConfirmAction = () => {
    setConfirmedAction(true);
    setShowModal(false);
    setTimeout(() => window.location.reload(), 100);
  };

  const handleCancelAction = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Warning message for restricted actions */}
      {showWarning && (
        <div id="al-text" style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff9800',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 9999999999,
          animation: 'fadeInOut 4s forwards',
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          {warningMessage}
        </div>
      )}

      {/* Refresh confirmation modal (same as before) */}
      {/* {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          touchAction: 'none'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', color: '#d32f2f' }}>
              Testni tugatmoqchimisiz?
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#555', lineHeight: '1.5' }}>
              Sahifani yangilash yoki testdan chiqish barcha javoblaringizni o'chirib yuboradi!
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <button 
                onClick={handleCancelAction}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#388e3c',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  minWidth: '140px'
                }}
              >
                Testni davom ettirish
              </button>
              <button 
                onClick={handleConfirmAction}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  minWidth: '140px'
                }}
              >
                Tugatish
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}