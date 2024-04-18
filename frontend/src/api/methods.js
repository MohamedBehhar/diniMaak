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


export const register = async ({ username, password }) => {
	try {
		const response = await instance.post("/auth/register", { username, password });
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
		const response = await instance.post("/carpooling", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}