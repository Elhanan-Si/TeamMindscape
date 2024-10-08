import { useEffect, useState } from "react";
import { getUsers, deleteUser, isAuthenticated, getEmployeeTaskStatistics, getEmployeeWorkHoursStatistics } from "../services/api";
import Employee from "../components/Employee";
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeesPage.css';
import { toast } from 'react-toastify';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [employeeStatistics, setEmployeeStatistics] = useState({});
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);


    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await getUsers();
            if (response.error) {
                console.error('Error fetching users:', response.error);
            } else {
                setEmployees(response.data);
                fetchEmployeeStatistics(response.data);
            }
        };

        const fetchEmployeeStatistics = async (employees) => {
            const statistics = {};
            for (const employee of employees) {
                const taskStats = await getEmployeeTaskStatistics(employee._id);
                const workHoursStats = await getEmployeeWorkHoursStatistics(employee._id);
                statistics[employee._id] = {
                    ...taskStats,
                    ...workHoursStats,
                };
            }
            setEmployeeStatistics(statistics);
        };

        const checkAuth = async () => {
            const result = await isAuthenticated();
            if (result.user.permissionLevel === 'CEO' || result.user.permissionLevel === 'manager') {
                setIsAuthorized(true);
            }
            fetchEmployees();
        };

        checkAuth();
    }, []);


    const handleAddEmployeeClick = () => {
        navigate('/addUser');
    };

    const handleDelete = async (id) => {
        const response = await deleteUser(id);
        if (response.error) {
            toast.error(response.message)
        } else {
            // handle success
            toast.success(response.message);
            setEmployees(employees.filter(employee => employee._id !== id));
        }
    };


    if (!Array.isArray(employees) || employees.length === 0) {
        return <div>Loading employees...</div>;
    }

    return (
        <div className="employee-page-container">
            <h1>ניהול עובדים</h1>
            <div className="add-employee-button" onClick={handleAddEmployeeClick}>הוסף עובד</div>
            <div className="employee-list">
                {employees.map(employee => (
                    <Employee 
                        key={employee._id}
                        employee={{
                            _id: employee._id,
                            firstname: employee.firstname,
                            lastname: employee.lastname,
                            email: employee.email,
                            job: employee.job,
                            phone: employee.phone,
                            permissionLevel: employee.permissionLevel
                        }}
                        employeeStatistics={employeeStatistics[employee._id] || { avgDailyHours: 0, completedLate: 0 }}
                        onDelete={handleDelete}
                        isAuth={isAuthorized}
                    />
                ))}
            </div>
        </div>
    );
};

export default EmployeesPage;
