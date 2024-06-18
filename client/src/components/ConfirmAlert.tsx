import { useState } from "react";
import styles from "../css/confirm_popup.module.css";

const ConfirmAlert = ({ message, onConfirm, onCancel }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.confirmation_popup}>
          <div className={styles.message}>{message}</div>
          <div className={styles.buttons}>
            <button onClick={handleConfirm}>CONFIRM</button>
            <button onClick={handleCancel}>CANCEL</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmAlert;
