import axios from "axios";

export const getToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

const instance = axios.create({
	baseURL: "http://localhost:3000/api/v1",
	headers: {
		Authorization: "Bearer " + getToken()
	}
});



export default instance;
