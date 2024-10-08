import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import '../styles/Statistics.css'

Chart.register(ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const StatisticsCharts = ({ taskStatistics, workHoursStatistics }) => {
    const taskChartData = {
        labels: ['Completed On Time', 'Completed Late', 'Not Completed'],
        datasets: [
            {
                label: 'Tasks',
                data: [
                    taskStatistics.completedOnTime || 0, 
                    taskStatistics.completedLate || 0,
                    taskStatistics.notCompleted || 0,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 205, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const workHoursChartData = {
        datasets: [{
            label: 'Average Work Hours per Day',
            data: workHoursStatistics,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        }]
    };

    return (
        <div className="chart-container">
            <div className="chart-item">
                <h2>סטטיסטיקת משימות</h2>
                <Doughnut data={taskChartData} />
            </div>

            <div className="chart-item">
                <h2>סטטיסטיקת שעות עבודה</h2>
                <Line data={workHoursChartData} />
            </div>
        </div>
    );
};

export default StatisticsCharts;
