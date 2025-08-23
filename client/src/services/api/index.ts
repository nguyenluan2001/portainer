import axios from "axios";
const apiInstance = axios.create({
	baseURL: window.API_URL,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "*",
		"Content-Type": "application/json",
	},
});

export { apiInstance };
