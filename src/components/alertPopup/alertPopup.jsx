import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./style.scss"
const AlertPopup = () => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const dontShowAgain = localStorage.getItem('dontShowAlert');
        if (dontShowAgain === 'true') return;

        const timer = setTimeout(() => {
            setShowAlert(true);
        }, 30000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShowAlert(false);
    };

    const handleDontShowAgain = () => {
        localStorage.setItem('dontShowAlert', 'true');
        setShowAlert(false);
    };

    if (!showAlert) return null;

    return (
        <div style={styles.overlay} >
            <div style={styles.alertBox} id='all'>
                <div className="close-btn">
                    <button onClick={handleClose}>
                        +
                    </button>
                </div>
                <p id='tt'>Tizimda qandaydir muammoga duch kelsangiz. <Link to="https://t.me/edumarkuz">Edumark</Link> telegram guruhida murojatingizni qoldirishingiz mumkin!</p>
                <p>Yoki</p>
                <p><Link to="tel:+998953988198">+998953988198</Link> raqamiga qo'ng'iroq qiling</p>
                <div style={styles.buttons}>
                    <button onClick={handleDontShowAgain} style={styles.dontShowBtn}>
                        Qaytib ko‘rsatilmasin
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    alertBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    buttons: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'space-around',
    },
    closeBtn: {
        padding: '8px 12px',
        backgroundColor: '#ccc',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dontShowBtn: {
        padding: '8px 12px',
        backgroundColor: '#179f5d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default AlertPopup;
