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

export const getUserInfo = async (user_id) => {
	try {
		const response = await instance.get(`/users/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const updateUserInfo = async (user) => {
	try {
		const response = await instance.put("/users", user);
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
	const { departure, destination, user_id, departure_day, number_of_seats } = data;


	let url = `/carpooling/search/${user_id}/${departure}/${destination}/${departure_day}/${number_of_seats}`;

	try {
		const response = await instance.get(url);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getCarpoolingById = async (id) => {
	try {
		const response = await instance.get(`/carpooling/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const bookCarpooling = async ({ requester_id, carpooling_id, requested_seats }) => {
	try {
		console.log('requester_id', requester_id);
		console.log('carpooling_id', carpooling_id);
		console.log('requested_seats', requested_seats);
		const response = await instance.post("/carpooling/book", { requester_id, carpooling_id, requested_seats });
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const getBookingRequest = async (user_id) => {
	try {
		const response = await instance.get(`/carpooling/requests/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getBookedCarpooling = async (user_id) => {
	try {
		const response = await instance.get(`/carpooling/bookings/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const acceptCarpoolingRequest = async (data) => {
	try {
		console.log('l l l l l l l  ', data);
		const response = await instance.post("/carpooling/requests/accept", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const rejectCarpoolingRequest = async (data) => {
	try {
		const response = await instance.post("/carpooling/requests/reject", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const getSingleRequestInfo = async (requester_id, carpooling_id) => {
	try {
		const response = await instance.get(`/carpooling/request/${requester_id}/${carpooling_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const confirmBookingRequest = async (data) => {
	try {
		const response = await instance.post("/carpooling/confirm-booking", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const cancelBookingRequest = async (data) => {
	try {
		const response = await instance.post("/carpooling/cancel-booking", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getNotifications = async (user_id) => {
	try {
		const response = await instance.get(`/notifications/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const getCarBrand = async (brand) => {
	try {
		const response = await instance.get(`/car/${brand}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const addCar = async (car) => {
	try {
		const response = await instance.post("/car", car
			, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getCarpoolingByPublisherId = async (user_id) => {
	try {
		const response = await instance.get(`/carpooling/published/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}