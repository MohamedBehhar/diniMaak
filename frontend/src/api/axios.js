import axios from "axios";
import { useNavigate } from "react-router-dom";

export const getToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

const instance = axios.create({
	baseURL: "http://localhost:3000/api/v1",
});

instance.interceptors.request.use(
	(config) => {
		console.log("Request made with token:", getToken());
		config.headers.Authorization = `Bearer ${getToken()}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		console.log("Response error:", error);
		const originalRequest = error.config;

		// Check if the error is due to an expired access token
		if (error.response.status === 401 && !originalRequest._retry) {
			console.log("hehehehehe");
			console.log("Access token expired. Refreshing token...");
			console.log("Refresh token:", getRefreshToken());
			try {
				// Request to refresh the access token using the refresh token

				const response = await instance.post("/auth/refresh-token",
					{

						refreshToken: getRefreshToken(),

					}
				);
				console.log("respspsps", response);
				// Update the new access token in local storage
				localStorage.setItem("token", response.data.accessToken);

				// Update the Authorization header with the new token
				originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;


				// Retry the original request with the new token
				return axios(originalRequest);
			} catch (refreshError) {
				// Handle refresh token error (e.g., user needs to log in again)
				console.log("Error refreshing token:", refreshError);
				// Redirect to login or handle as needed
				// Example: window.location.href = "/login";
				throw refreshError;
			}
		}

		return Promise.reject(error);
	}
);

export default instance;
