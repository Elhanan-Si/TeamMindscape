import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Task from "../components/Task";
import { getTasks, getTasksSent, deleteTask, isAuthenticated } from '../services/api';
import '../styles/TasksPage.css';
import { toast } from 'react-toastify';


const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [showTasksSent, setShowTasksSent] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchTasks = async () => {
            const response = showTasksSent ? await getTasksSent() : await getTasks();
            if (response.error) {
                console.error('Error fetching tasks:', response.error);
            } else {
                setTasks(response);
            }
        };

        const checkAuth = async () => {
            const result = await isAuthenticated();
            if (result.user.permissionLevel === 'CEO' || result.user.permissionLevel === 'manager') {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
            fetchTasks();
        };

        checkAuth();
    }, [showTasksSent]);


    const filterTasks = (task) => {
        if (!showCompleted && task.isCompleted) {
            return false;
        }
        if (urgencyFilter && task.priority !== urgencyFilter) {
            return false;
        }
        return true;
    };

    const sortTasks = (a, b) => {
        if (sortBy === 'end-time') {
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortBy === 'creation-time') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
    };

    const applyFiltersAndSort = () => {
        let filteredTasks = tasks.filter(filterTasks);
        filteredTasks.sort(sortTasks);
        return filteredTasks;
    };

    const handleUrgencyFilterChange = (value) => {
        setUrgencyFilter(value);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleDelete = async (id) => {
        const response = await deleteTask(id);
        if (response.error) {
            toast.error(response.message);
        } else {
            toast.success(response.message);
            setTasks(tasks.filter(task => task._id !== id));
        }
    }

    const handleAddTaskClick = () => {
        navigate('/addTasks')
    }

    const handleToggleTasksView = () => {
        setShowTasksSent(!showTasksSent);
    };


    const handleUpdate = (updateTask) => {
        setTasks(tasks.map(task => task._id === updateTask._id ? updateTask : task));
    };

    const filteredAndSortedTasks = applyFiltersAndSort();


    return (
        <div className='task-page-container'>
            <h1 className='page-title'>Tasks Page</h1>
            {isAuthorized && 
                <div>
                    <div className="add-task-button" onClick={handleAddTaskClick}>הוסף משימה</div>
                    <div className="send-tasks-button" onClick={handleToggleTasksView}>
                        {showTasksSent ? 'משימות שקיבלתי' : 'משימות ששלחתי'}
                    </div>
                </div>
            }
            <div className='sorting-bar'>
                <div className='urgency-filter'>
                    <div className='filter-group'>
                        <input type='radio' id='high' name='urgency' value='high' onChange={() => handleUrgencyFilterChange('high')} />
                        <label htmlFor='high' className='filter-label'>
                            <span className='urgency-high'></span>
                            High
                        </label>
                    </div>
                    <div className='filter-group'>
                        <input type='radio' id='medium' name='urgency' value='medium' onChange={() => handleUrgencyFilterChange('medium')} />
                        <label htmlFor='medium' className='filter-label'>
                            <span className='urgency-medium'></span>
                            Medium
                        </label>
                    </div>
                    <div className='filter-group'>
                        <input type='radio' id='low' name='urgency' value='low' onChange={() => handleUrgencyFilterChange('low')} />
                        <label htmlFor='low' className='filter-label'>
                            <span className='urgency-low'></span>
                            Low
                        </label>
                    </div>
                    <div className='filter-group'>
                        <input type='radio' id='all' name='urgency' value='' onChange={() => handleUrgencyFilterChange('')} />
                        <label htmlFor='all' className='filter-label'>
                            All
                        </label>
                    </div>
                </div>
                <div className='completion-filter'>
                    <input
                        type='checkbox'
                        id='show-completed'
                        checked={showCompleted}
                        onChange={() => setShowCompleted(!showCompleted)}
                    />
                    <label htmlFor='show-completed'>Show Completed</label>
                </div>
                <div className='sort-options'>
                    <div className='sort-group'>
                        <input type='radio' id='end-time' name='sort' value='end-time' onChange={() => handleSortChange('end-time')} />
                        <label htmlFor='end-time'>Sort by End Time</label>
                    </div>
                    <div className='sort-group'>
                        <input type='radio' id='creation-time' name='sort' value='creation-time' onChange={() => handleSortChange('creation-time')} />
                        <label htmlFor='creation-time'>Sort by Creation Time</label>
                    </div>
                    <div className='sort-group'>
                        <input type='radio' id='no-sort' name='sort' value='' onChange={() => handleSortChange('')} />
                        <label htmlFor='no-sort'>No Sort</label>
                    </div>
                </div>
            </div>
            <div className='tasks-list'>
                {filteredAndSortedTasks.length > 0 ? (
                    filteredAndSortedTasks.map(task => (
                        <Task 
                            key={task._id}
                            taskData={task}
                            onDelete={handleDelete}
                            isAuth={isAuthorized}
                            onUpdate={handleUpdate}
                        />
                    ))
                ) : (
                    <div className='no-tasks-message'>אין לך משימות במערכת</div>
                )}

            </div>
        </div>
    );
};

export default TasksPage;
