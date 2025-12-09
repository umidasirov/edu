import { useEffect, useState } from "react";

export function useRefreshPrompt(shouldBlock) {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmNavigation = () => {
    setShowModal(false);
    window.location.reload()
    // Allow the refresh to proceed by doing nothing
  };

  const handleBlockNavigation = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (shouldBlock) {
        e.preventDefault();
        setShowModal(true);
        // This returnValue is required for Chrome compatibility
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock]);

  const RefreshModal = () => (
    showModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Testni tark etmoqchimisiz?</h3>
          <p>Sahifani yangilash test natijalaringizni yo'qotishiga olib keladi</p>
          <div className="modal-actions">
            <button onClick={handleBlockNavigation} className="confirm-btn">
              Davom etish
            </button>
            <button onClick={handleConfirmNavigation} className="cancel-btn">
              Yangilash
            </button>
          </div>
        </div>
      </div>
    )
  );

  return { RefreshModal };
}