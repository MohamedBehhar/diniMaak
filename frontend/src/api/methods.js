import axios from "axios";
import instance from "./axios";


const baseURL = "http://localhost:3000/api/v1";

export const login = async ({ username, password }) => {
	console.log(username, password);
	try {
		const response = await axios.post("http://localhost:3000/api/v1/auth/login", { username, password });
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const signUp = async ({ username, password, email }) => {
	try {
		const response = await instance.post("/auth/register", { username, password, email });
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const updateToken = async ({ refreshToken, username }) => {
	try {
		const response = await instance.get("/auth/updateToken", { refreshToken, username });
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const logout = async () => {
	try {
		await instance.post("/auth/logout");
	} catch (error) {
		throw error;
	}
}

export const getTodos = async () => {
	try {
		const response = await instance.get("/todos");
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getUsers = async () => {
	try {
		const response = await instance.get("/users");
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getCities = async (letters) => {
	try {
		const response = await instance.get(`/cities/${letters}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const creatCarpooling = async (data) => {
	try {
		const response = await instance.post("/carpooling/", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const searchCarpooling = async (data) => {
	const { departure, destination, user_id, departure_day } = data;
	let url = `/carpooling/search/${user_id}/${departure}/${destination}`;

	if (departure_day) {
		alert("departure_day", departure_day);
		url += `/${departure_day}`;
	}

	try {
		const response = await instance.get(url);
		return response.data;
	} catch (error) {
		throw error;
	}
}
