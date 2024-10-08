import { useState } from "react";
import moment from "moment";
import "../styles/Attendance.css";
import { startAttendance, endAttendance } from "../services/api";
import { toast } from "react-toastify";

const Attendance = () => {
    const [startTime, setStartTime] = useState(false);
    const [endTime, setEndTime] = useState(false);
    const date = moment();

    const handleStartClick = () => {

        setStartTime(true);
        setEndTime(false);
    };

    const handleEndClick = () => {
        setEndTime(true);
        setStartTime(false);
    };

    const handleSubmit = async () => {
        const response = startTime
            ? await startAttendance()
            : endTime
            ? await endAttendance()
            : toast.error("בחר אחת מהאפשרויות");
        response.error
            ? toast.error(response.message)
            : toast.success(response.message);
    };

    return (
        <div className="attendance-card">
            <h2>דיווח נוכחות</h2>
            <div className="attendance-body">
                <div className="time-entry">
                    <div>
                        <span>Date:</span>
                        <span>{date.format("DD/MM/YYYY")}</span>
                    </div>
                    <div>
                        <span>Time:</span>
                        <span>{date.format("HH:mm")}</span>
                    </div>
                </div>
                <div className="buttons">
                <button className="end-btn" onClick={handleEndClick}>
                        סיום נוכחות
                    </button>
                    <button className="start-btn" onClick={handleStartClick}>
                        תחילת נוכחות
                    </button>
                </div>
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
                אישור
            </button>
        </div>
    );
};

export default Attendance;
