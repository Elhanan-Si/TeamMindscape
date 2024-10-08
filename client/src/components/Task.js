import React, { useState } from 'react';
import { updateTaskStatus } from '../services/api';
import Message from './Message';
import deleteIcon from "../assets/icons/delete-icon.png";
import '../styles/Task.css';
import { toast } from 'react-toastify';

const Task = ({ taskData , onDelete, isAuth, onUpdate }) => {
    const [isCompleted, setIsCompleted] = useState(taskData.isCompleted);
    const [showMessage, setShowMessage] = useState(false);


    const getPriorityColor = (priority) => {
        switch (priority) {
          case 'high':
            return '#f56565';
          case 'medium':
            return '#fb923c';
          case 'low':
            return '#34d399';
          default:
            return '#d1d5db';
        }
    };


    // convert isoString to format dd/mm/yyyy - hh:mm 
    const formatDateTime = (isoString) => {
        if (!isoString) return 'לא מוגדר';

        const date = new Date(isoString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} - ${hours}:${minutes}`
    }

    const handleTaskToggle = async () => {
        const response = await updateTaskStatus(taskData._id);
        if (response.error) {
            // handle error
            toast.error(response.message);
        } else {
            setIsCompleted(response.isCompleted);
            taskData.isCompleted = response.isCompleted;  // עדכון המשימה באופן מקומי
            onUpdate(taskData);  // הכנסת המשימה המעודכנת חזרה למערך המשימות בדף האב
        }
    } 


    const handleCancel = () => {
        setShowMessage(false);
    };
    
    const handleConfirm = async () => {
        await onDelete(taskData._id);
        setShowMessage(false);
    };

    const handleDeleteClick = () => {
        setShowMessage(true);
    }


    return (
        <div className="task-container" style={{ borderLeft: `8px solid ${getPriorityColor(taskData.priority)}` }}>
            {/* left part */}
            <div className="task-left">
                <div className="task-info">
                    <div className="task-detail">שם השולח: {taskData.senderName}</div>
                    <div className="task-detail">זמן יצירה: {formatDateTime(taskData.createdAt)}</div>
                    <div className="task-detail">מועד אחרון : {formatDateTime(taskData.deadline)}</div>
                </div>
                <button className="task-button" style={{ backgroundColor: isCompleted ? '#f56565' : '#4299e1' }} onClick={handleTaskToggle}>
                    {isCompleted ? "בטל ביצוע" : "בוצע" }
                </button>
            </div>
            {/* right part */}
            <div className="task-right">
                <div className="task-header">
                    <div className="task-title">{taskData.title}</div>
                </div>
                <div className="task-body">{taskData.description}</div>
            </div>

            {showMessage && (
                <Message
                type="warning"
                message="Are you sure you want to delete this task?"
                buttons={[
                    { label: "Cancel", color: "blue", onClick: handleCancel },
                    { label: "Confirm", color: "gray", onClick: handleConfirm },
                ]}
                />
            )}

            {isAuth && (
                <div className="icons">
                    <img
                        onClick={handleDeleteClick}
                        className="icon delete-icon"
                        src={deleteIcon}
                        alt="delete icon"
                    />
                </div>
            )}
        </div>
      );
};

export default Task;
