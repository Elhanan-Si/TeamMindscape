import axios from "axios";
import { handleApiError } from "./handleApiError";

const API = axios.create({
  baseURL: "http://localhost:5050/api/",
  withCredentials: true,
});

// send login request to server
export const authLogin = async ({ email, password }) => {
  try {
    const response = await API.post("auth/login", { email, password });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const response = await API.post("auth/logout");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await API.get("auth/verify-token");
    return response.data;
  } catch (error) {
    console.error("Error verifying token: ", error);
    return false;
  }
};

export const sendVerificationCode = async (email) => {
  try {
    const response = await API.post("auth/sendVerificationCode", { email });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const resetPassword = async ({
  email,
  verificationCode,
  newPassword,
}) => {
  try {
    const response = await API.post("auth/resetPassword", {
      email,
      verificationCode,
      newPassword,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// fetch user data for Profile or CEO
export const getUserProfile = async () => {
  try {
    const response = await API.get("users/getUserProfile");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// get users data
// need: CEO OR manager
// if CEO return all user data, if manager return just {._id, firstname, lastname, job}
export const getUsers = async () => {
  try {
    const response = await API.get("users/getUsers");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// CEO create user
// need: CEO, new user data
// return: status & massge
export const createUser = async (data) => {
  try {
    const response = await API.post("users/createUser", data);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await API.put(`users/updateUser/${userId}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await API.delete(`users/deleteUser/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// fetch all tasks for user
export const getTasks = async () => {
  try {
    const response = await API.get("tasks/getTasks");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTasksSent = async () => {
  try {
    const response = await API.get("tasks/getTasksSent");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// send new task to server
export const createTask = async (data) => {
  try {
    const response = await API.post("tasks/createTask", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// update task status
export const updateTaskStatus = async (taskId) => {
  try {
    const response = await API.patch(`tasks/toggleStatus/${taskId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await API.delete(`tasks/delete/${taskId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


// Statistics
export const tasksStatistics = async () => {
  try {
    const response = await API.get("statistics/getTasksCompletedStatistics");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const workHoursStatistics = async () => {
  try {
    const response = await API.get("statistics/getWorkHoursStatistics");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEmployeeTaskStatistics = async (employeeId) => {
  try {
    const response = await API.get(`statistics/getEmployeeTaskStatistics/${employeeId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEmployeeWorkHoursStatistics = async (employeeId) => {
  try {
    const response = await API.get(`statistics/getEmployeeWorkHoursStatistics/${employeeId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};



// Attendance
export const startAttendance = async () => {
  try {
    const response = await API.post("/attendance/start");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const endAttendance = async () => {
  try {
    const response = await API.post("/attendance/end");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default API;
