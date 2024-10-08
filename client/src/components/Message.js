import React from "react";
import "../styles/message.css";

const Message = ({ type, message, buttons }) => {
  return (
    <div
      className={`message-container ${
        type === "warning"
          ? "message-warning"
          : type === "confirmation"
          ? "message-confirmation"
          : ""
      }`}
    >
      <p className="message-text">{message}</p>
      {buttons && (
        <div className="message-buttons">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`message-button ${
                button.color === "gray"
                  ? "button-gray"
                  : button.color === "blue"
                  ? "button-blue"
                  : ""
              }`}
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;

/* "הפעלה של "הודעה
פונקציות להאזנה לכפתורים בקומפוננטת המפעיל ===> function handleCancel() {} function handleConfirm() {}

    <Message
        type="warning" // or "confirmation"
        message="Are you sure you want to delete the task?"
        buttons={[
            { label: 'Cancel', color: 'blue', onClick: () => handleCancel() },
            { label: 'Confirm', color: 'gray', onClick: () => handleConfirm() }
        ]}
    /> 
*/

