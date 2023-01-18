import { useEffect } from 'react';
import propTypes from 'prop-types';
import css from './Modal.module.scss';

function Modal({ onEscBtn, onOverlayClick, imageToShow }) {
    useEffect(() => {
        document.querySelector('html').style.overflow = 'hidden';
        window.addEventListener('keydown', escapeListener);
        return () => {
            document.querySelector('html').style.overflow = 'visible';
            window.removeEventListener('keydown', escapeListener);
        };
    });

    const escapeListener = evt => {
        if (evt.code === 'Escape') {
            onEscBtn();
        }
    };

    const handleOverlayClick = evt => {
        if (evt.target === evt.currentTarget) {
            onOverlayClick();
        }
    };

    return (
        <div id="backdrop" className={css.Overlay} onClick={handleOverlayClick}>
            <div className={css.Modal}>
                <img
                    className={css.Modal__img}
                    src={imageToShow.largeImageURL}
                    alt={imageToShow.tags}
                    loading="lazy"
                />
            </div>
        </div>
    );
}

Modal.propTypes = {
    onEscBtn: propTypes.func.isRequired,
    onOverlayClick: propTypes.func.isRequired,
    imageToShow: propTypes.object.isRequired,
};

export default Modal;
