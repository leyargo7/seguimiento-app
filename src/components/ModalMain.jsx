import React from 'react'
import styles from './HomeMain.module.css'

const ModalMain = ({ show, onClose, documentUrl }) => {
  if (!show) return null

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <iframe
          id="documentViewer"
          className={styles.iframeViewer}
          width="100%"
          height="500"
          src={documentUrl}
         
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default ModalMain
