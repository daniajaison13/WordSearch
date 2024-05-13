import axios from "axios";

const authAxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

authAxiosInstance.interceptors.request.use(
	(config) => {
		config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const authApiInstance = authAxiosInstance;
