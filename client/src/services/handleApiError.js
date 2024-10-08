export const handleApiError = (error) => {
    if (error.response) {
        // הבקשה נעשתה והשרת הגיב בקוד סטטוס
        const { status, data } = error.response;
        let message = 'An error occurred';

        switch (status) {
            case 400:
                message = data.message || 'Bad Request';
                break;
            case 401:
                message = data.message || 'Unauthorized';
                break;
            case 403:
                message = data.message || 'Forbidden';
                break;
            case 404:
                message = data.message || 'Not Found';
                break;
            case 500:
                message = data.message || 'Internal Server Error';
                break;
            default:
                message = data.message || `Error: ${status}`;
        }

        return {
            error: true,
            status: status,
            message: message
        };
    } else if (error.request) {
        // הבקשה הוגשה אך לא התקבלה תגובה
        return {
            error: true,
            message: 'No response received from server'
        };
    } else {
        // משהו קרה בהגדרת הבקשה שהפעילה שגיאה
        return {
            error: true,
            message: error.message
        };
    }
};
