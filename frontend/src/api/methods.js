import axios from "axios";
import instance from "./axios";


const baseURL = "http://localhost:3000/api/v1";
export const url = "http://localhost:3000";

export const login = async ({ username, password }) => {
	console.log(username, password);
	try {
		const response = await axios.post("http://localhost:3000/api/v1/auth/login", { username, password });
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const signUp = async ({ username, password, email, phone_number }) => {
	try {
		const response = await instance.post("/auth/register", { username, password, email, phone_number });
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const updateToken = async ({ refresh_token, username }) => {
	try {
		const response = await instance.get("/auth/updateToken", { refresh_token, username });
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
		const response = await instance.get(`/car/brand/${brand}`);
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

export const editCar = async (car) => {
	try {
		const response = await instance.put("/car", car
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

export const getNotificationsCount = async (user_id) => {
	try {
		const response = await instance.get(`/notifications/count/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getCarByUserId = async (user_id) => {
	try {
		const response = await instance.get(`/car/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const getChats = async (sender_id, receiver_id, conversation_id) => {

	try {
		const response = await instance.get(`/chat/${sender_id}/${receiver_id}/${conversation_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const getUnreadLastMessagesCount = async (user_id) => {
	try {
		const response = await instance.get(`/conversations/unread/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}



export const getConversations = async (user_id) => {
	console.log('user_id', user_id);
	try {
		const response = await instance.get(`/conversations/${user_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const setMessagesAsRead = async (conversation_id, receiver_id) => {
	try {
		const response = await instance.put(`/chat/read/${conversation_id}/${receiver_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const setReminder = async (data) => {
	try {
		const response = await instance.post("/reminders/setReminder", data);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const changeNotificationStatus = async (receiver_id) => {
	try {
		const response = await instance.put(`/notifications/${receiver_id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const deleteCarpooling = async (id) => {
	try {
		const response = await instance.delete(`/carpooling/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}