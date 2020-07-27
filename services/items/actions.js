import {
	GET_RESTAURANT_INFO,
	GET_RESTAURANT_INFO_BY_ID,
	GET_RESTAURANT_ITEMS,
	RESET_INFO,
	RESET_ITEMS,
	SINGLE_ITEM,
	SEARCH_ITEM,
	CLEAR_SEARCH,
} from "./actionTypes";
import {
	GET_RESTAURANT_INFO_BY_ID_URL,
	GET_RESTAURANT_INFO_URL,
	GET_RESTAURANT_ITEMS_URL,
	GET_SINGLE_ITEM_URL,
} from "../../configs";

import Axios from "axios";

export const getRestaurantInfo = (slug) => (dispatch) => {
	return Axios.post(GET_RESTAURANT_INFO_URL + "/" + slug)
		.then((response) => {
			const restaurant_info = response.data;
			return dispatch({ type: GET_RESTAURANT_INFO, payload: restaurant_info });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantInfoById = (id) => (dispatch) => {
	return Axios.post(GET_RESTAURANT_INFO_BY_ID_URL + "/" + id)
		.then((response) => {
			const restaurant_info = response.data;
			return dispatch({
				type: GET_RESTAURANT_INFO_BY_ID,
				payload: restaurant_info,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getRestaurantItems = (slug) => (dispatch) => {
	Axios.post(GET_RESTAURANT_ITEMS_URL + "/" + slug)
		.then((response) => {
			const restaurant_items = response.data;
			return dispatch({ type: GET_RESTAURANT_ITEMS, payload: restaurant_items });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getSingleItem = (id) => (dispatch) => {
	return Axios.post(GET_SINGLE_ITEM_URL, {
		id: id,
	})
		.then((response) => {
			const item = response.data;
			return dispatch({ type: SINGLE_ITEM, payload: item });
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const resetItems = () => (dispatch) => {
	const empty = [];
	return dispatch({ type: RESET_ITEMS, payload: empty });
};

export const resetInfo = () => (dispatch) => {
	const empty = [];
	return dispatch({ type: RESET_INFO, payload: empty });
};

export const searchItem = (itemList, itemName, searchFoundText, noResultText) => (dispatch, getState) => {
	const searchResultText = searchFoundText + itemName;
	const noSearchFoundText = noResultText + itemName;
	// console.log(JSON.stringify(getState().items.restaurant_items.items));

	// const state = getState().items.restaurant_items.items;
	let arr = [];
	let foodItems = [];
	if (itemList && [itemList].length >= 0) {
		Object.keys(itemList).forEach((keys) => {
			itemList[keys].forEach((itemsList) => {
				arr.push(itemsList);
				foodItems = arr.filter((product) => {
					return product.name.toLowerCase().indexOf(itemName.toLowerCase()) !== -1;
				});
			});
		});
	}
	if (foodItems.length > 0) {
		return dispatch({
			type: SEARCH_ITEM,
			payload: { items: { [searchResultText]: foodItems } },
		});
	} else if (foodItems.length <= 0) {
		return dispatch({
			type: SEARCH_ITEM,
			payload: { items: { [noSearchFoundText]: foodItems } },
		});
	}
};

export const clearSearch = (data) => (dispatch) => {
	return dispatch({ type: CLEAR_SEARCH, payload: data });
};
