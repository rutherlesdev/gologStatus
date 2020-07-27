import {
	LOGIN_USER,
	REGISTER_USER,
	LOGOUT_USER,
	UPDATE_USER_INFO,
	SEND_OTP,
	VERIFY_OTP,
	RUNNING_ORDER,
	GET_WALLET_TRANSACTIONS,
	SEND_PASSWORD_RESET_EMAIL,
	VERIFY_PASSWORD_RESET_OTP,
	CHANGE_USER_PASSWORD,
} from "./actionTypes";
import {
	LOGIN_USER_URL,
	REGISTER_USER_URL,
	UPDATE_USER_INFO_URL,
	SEND_OTP_URL,
	VERIFY_OTP_URL,
	CHECK_USER_RUNNING_ORDER_URL,
	GET_WALLET_TRANSACTIONS_URL,
	SEND_PASSWORD_RESET_EMAIL_URL,
	VERIFY_PASSWORD_RESET_OTP_URL,
	CHANGE_USER_PASSWORD_URL,
} from "../../configs";

import Axios from "axios";

export const loginUser = (name, email, password, accessToken, phone, provider, address) => (dispatch) => {
	Axios.post(LOGIN_USER_URL, {
		name: name,
		email: email,
		password: password,
		accessToken: accessToken,
		phone: phone,
		provider: provider,
		address: address,
	})
		.then((response) => {
			const user = response.data;
			return dispatch({ type: LOGIN_USER, payload: user });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const registerUser = (name, email, phone, password, address) => (dispatch) => {
	Axios.post(REGISTER_USER_URL, {
		name: name,
		email: email,
		phone: phone,
		password: password,
		address: address,
	})
		.then((response) => {
			const user = response.data;
			return dispatch({ type: REGISTER_USER, payload: user });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const logoutUser = (user) => (dispatch) => {
	user = [];
	const walletEmpty = [];

	//remove geoLocation and userSetAddress
	localStorage.removeItem("userSetAddress");
	localStorage.removeItem("geoLocation");
	localStorage.removeItem("lastSavedNotificationToken");

	dispatch({
		type: LOGOUT_USER,
		payload: user,
	});
	dispatch({
		type: RUNNING_ORDER,
		payload: false,
	});
	dispatch({
		type: GET_WALLET_TRANSACTIONS,
		payload: walletEmpty,
	});
};

export const updateUserInfo = (user_id, token, unique_order_id) => (dispatch) => {
	return Axios.post(UPDATE_USER_INFO_URL, {
		token: token,
		user_id: user_id,
		unique_order_id: unique_order_id,
	})
		.then((response) => {
			const user = response.data;
			return dispatch({ type: UPDATE_USER_INFO, payload: user });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const checkUserRunningOrder = (user_id, token) => (dispatch) => {
	Axios.post(CHECK_USER_RUNNING_ORDER_URL, {
		token: token,
		user_id: user_id,
	})
		.then((response) => {
			const running_order = response.data;
			return dispatch({ type: RUNNING_ORDER, payload: running_order });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const sendOtp = (email, phone, accessToken, provider) => (dispatch) => {
	return Axios.post(SEND_OTP_URL, {
		email: email,
		phone: phone,
		accessToken: accessToken,
		provider: provider,
	})
		.then((response) => {
			const user = response.data;
			return dispatch({ type: SEND_OTP, payload: user });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const verifyOtp = (phone, otp) => (dispatch) => {
	Axios.post(VERIFY_OTP_URL, {
		phone: phone,
		otp: otp,
	})
		.then((response) => {
			const user = response.data;
			return dispatch({ type: VERIFY_OTP, payload: user });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getWalletTransactions = (token, user_id) => (dispatch) => {
	Axios.post(GET_WALLET_TRANSACTIONS_URL, {
		token: token,
		user_id: user_id,
	})
		.then((response) => {
			const wallet = response.data;
			return dispatch({ type: GET_WALLET_TRANSACTIONS, payload: wallet });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const sendPasswordResetMail = (email) => (dispatch) => {
	Axios.post(SEND_PASSWORD_RESET_EMAIL_URL, {
		email: email,
	})
		.then((response) => {
			const data = response.data;
			return dispatch({ type: SEND_PASSWORD_RESET_EMAIL, payload: data });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const verifyPasswordResetOtp = (email, code) => (dispatch) => {
	Axios.post(VERIFY_PASSWORD_RESET_OTP_URL, {
		email: email,
		code: code,
	})
		.then((response) => {
			const data = response.data;
			return dispatch({ type: VERIFY_PASSWORD_RESET_OTP, payload: data });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const changeUserPassword = (email, code, password) => (dispatch) => {
	Axios.post(CHANGE_USER_PASSWORD_URL, {
		email: email,
		code: code,
		password: password,
	})
		.then((response) => {
			const data = response.data;
			return dispatch({ type: CHANGE_USER_PASSWORD, payload: data });
		})
		.catch(function(error) {
			console.log(error);
		});
};
