import "../styles/Employee.css";
import editIcon from "../assets/icons/edit-icon.png";
import deleteIcon from "../assets/icons/delete-icon.png";
import { useState } from "react";
import Message from "./Message";
import FormUpdateUser from "./FormUpdateUser";

/**
 * employeeData {_id, firstName, lastName, email, job, phone, permissionLevel}
 * employeeStatistics {}
 */

const Employee = ({ employee, employeeStatistics, onDelete, isAuth }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(employee);
  const [timeFrame, setTimeFrame] = useState("daily");
  const getAverageHours = () => {
    console.log("Current timeFrame:", timeFrame);
    console.log("Employee Statistics:", employeeStatistics);

    switch (timeFrame) {
      case "weekly":
        return employeeStatistics.avgWeeklyHours || 0;
      case "monthly":
        return employeeStatistics.avgMonthlyHours || 0;
      default:
        return employeeStatistics.avgDailyHours || 0;
    }
  };

  const handleDeleteClick = () => {
    setShowMessage(true);
  };

  const handleCancel = () => {
    setShowMessage(false);
  };

  const handleConfirm = async () => {
    await onDelete(employee._id);
    setShowMessage(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSuccess = (updateEmployee) => {
    setIsEditing(false);
    setCurrentEmployee(updateEmployee);
  };

  return (
    <div className="employee-card">
      {isAuth && (
        <div className="icons">
          <img
            onClick={handleEditClick}
            className="icon edit-icon"
            src={editIcon}
            alt="edit icon"
          />
          <img
            onClick={handleDeleteClick}
            className="icon delete-icon"
            src={deleteIcon}
            alt="delete icon"
          />
        </div>
      )}

      {showMessage && (
        <Message
          type="warning"
          message="Are you sure you want to delete this employee"
          buttons={[
            { label: "Cancel", color: "blue", onClick: handleCancel },
            { label: "Confirm", color: "gray", onClick: handleConfirm },
          ]}
        />
      )}

      {isEditing ? (
        <FormUpdateUser
          user={currentEmployee}
          isManager={isAuth}
          onClose={() => setIsEditing(false)}
          onSuccess={handleEditSuccess}
        />
      ) : (
        <>
          <div className="employee-information">
            <div>
              שם פרטי: <p className="value">{currentEmployee.firstname}</p>
            </div>
            <div>
              שם משפחה: <p className="value">{currentEmployee.lastname}</p>
            </div>
            <div>
              כתובת מייל: <p className="value">{currentEmployee.email}</p>
            </div>
            <div>
              תפקיד: <p className="value">{currentEmployee.job}</p>
            </div>
            <div>
              טלפון: <p className="value">{currentEmployee.phone}</p>
            </div>
            <div>
              רמת הרשאה:{" "}
              <p className="value">{currentEmployee.permissionLevel}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="employee-statistics">
            {" "}
            <div className="stats-header">
              <div className="time-frame-buttons">
                <button
                  className={`time-frame-btn ${
                    timeFrame === "daily" ? "active" : ""
                  }`}
                  onClick={() => setTimeFrame("daily")}
                >
                  יומי
                </button>
                <button
                  className={`time-frame-btn ${
                    timeFrame === "weekly" ? "active" : ""
                  }`}
                  onClick={() => setTimeFrame("weekly")}
                >
                  שבועי
                </button>
                <button
                  className={`time-frame-btn ${
                    timeFrame === "monthly" ? "active" : ""
                  }`}
                  onClick={() => setTimeFrame("monthly")}
                >
                  חודשי
                </button>
              </div>
            </div>
            <div>
              שעות עבודה בממוצע <p className="value">{getAverageHours()}</p>
            </div>
            <div>
              חריגות מהזמן לביצוע המשימה{" "}
              <p className="value">{employeeStatistics.completedLate || 0}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Employee;
