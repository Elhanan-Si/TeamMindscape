import { useEffect, useState } from 'react';
import Statistics from '../components/Statistics';
import { tasksStatistics, workHoursStatistics } from '../services/api';


const StatisticsPage = () => {
    const [tasksStatisticsData, setTaskStatistics] = useState({
        completedOnTime: 0,
        completedLate: 0,
        notCompleted: 0,
    });

    const [workHoursStatisticsData, setWorkHoursStatisticsData] = useState([]);


    useEffect(() => {
        const fetchStatisticsData = async () => {
            const tasksResponse = await tasksStatistics();
            if (tasksResponse.error) {
                console.error('Error fetching tasks statistics:', tasksResponse.error);
            } else {
                setTaskStatistics(tasksResponse);
            }

            const workHoursResponse = await workHoursStatistics();
            if (workHoursResponse.error) {
                console.error('Error fetching workHours statistics:', workHoursResponse.error)
            } else {
                setWorkHoursStatisticsData(workHoursResponse);
            }
        }

        fetchStatisticsData();
    }, []);


    return (
        <div>
            <Statistics 
                taskStatistics={tasksStatisticsData}
                workHoursStatistics={workHoursStatisticsData}
            />
        </div>
    )
}

export default StatisticsPage;