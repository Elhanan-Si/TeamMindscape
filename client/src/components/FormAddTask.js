import React, { useEffect, useState } from 'react';
import { getUsers, createTask } from '../services/api';
import '../styles/FormAddTask.css';
import { toast } from 'react-toastify';

const TaskForm = () => {
    const [inputs, setInputs] = useState({ 
        title: '',
        description: '', 
        deadline: '', 
        priority: '' 
    })
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filterEmployees, setFilterEmployees] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await getUsers();
            if (!response.error) {
                setEmployees(response.data);
            }
        } 
        fetchEmployees();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({
            ...prevInputs, 
            [name]: value
        }));
    }

    const handlePriorityChange = (priority) => {
        setInputs(prevInputs => ({
            ...prevInputs, 
            priority
        }));
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setFilterEmployees(searchValue);
    }

    const handleEmployeeClick = (employee) => {
        setSelectedEmployees(prevSelected => {
            if (prevSelected.includes(employee._id)) {
                return prevSelected.filter(id => id !== employee._id);
            } else {
                return [...prevSelected, employee._id]
            }
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const taskData = {
            ...inputs,
            intendedFor: selectedEmployees,
        };

        const response = await createTask(taskData);
        if (response.error) {
            toast.error(response.message);
        } else {
            toast.success(response.message);
        }
    }

    const filteredEmployees = employees.filter(employee =>
        `${employee.firstname} ${employee.lastname} ${employee.job}`.toLowerCase().includes(filterEmployees)
    );

    return (
        <div className='container'>
            <h1>הוספת משימה</h1>
            <form onSubmit={handleSubmit} className='form'>
                <div className='form-section'>
                    <input
                        type='datetime-local'
                        name='deadline'
                        value={inputs.deadline}
                        onChange={handleChange}
                        className='input' 
                    />
                    <div className='priority'>
                        <button 
                            type='button'
                            className={`priority-btn ${inputs.priority === 'low' ? 'selected' : ''}`} 
                            onClick={() => handlePriorityChange('low')}
                        >נמוך</button>
                        <button 
                            type='button'
                            className={`priority-btn ${inputs.priority === 'medium' ? 'selected' : ''}`} 
                            onClick={() => handlePriorityChange('medium')}
                        >בינוני</button>
                        <button 
                            type='button'
                            className={`priority-btn ${inputs.priority === 'high' ? 'selected' : ''}`}
                            onClick={() => handlePriorityChange('high')}
                        >גבוה</button>
                    </div>
                    <div className='employees'>
                        <input
                            type='search' 
                            name='search'
                            value={filterEmployees}
                            onChange={handleSearchChange}
                            className='search-input' 
                            placeholder='חיפוש עובד'
                        />
                        <div className='list-employees'>
                            {filteredEmployees.map(employee => (
                                <div 
                                    key={employee._id} 
                                    className={`employee-box ${selectedEmployees.includes(employee._id) ? 'selected' : ''}`}
                                    onClick={() => handleEmployeeClick(employee)}
                                >
                                    <div className='employee-name'>{employee.firstname + ' ' + employee.lastname}</div>
                                    <div className='employee-job'>{employee.job}</div>
                                </div>
                            ))}
                        </div>
                        <div className='selected-employees-list'>
                            {selectedEmployees.map(id => {
                                const employee = employees.find(emp => emp._id === id);
                                return employee ? (
                                    <p className='selected-employees' key={id}>{employee.firstname} {employee.lastname}</p>
                                ) : null;
                            })}
                        </div>
                    </div>
                </div>
                <div className='form-section'>
                    <input 
                        type='text'
                        name='title'
                        value={inputs.title}
                        onChange={handleChange}
                        className='input'
                        placeholder='כותרת משימה'
                    />
                    <textarea
                        type='text'
                        name='description'
                        value={inputs.description}
                        onChange={handleChange}
                        placeholder='תיאור'
                        className='textarea'
                    ></textarea>
                </div>
                <button type='submit' className='btn-send'>הוסף משימה</button>
            </form>
        </div>
    );
};

export default TaskForm;
