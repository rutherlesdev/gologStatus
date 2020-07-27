import { CHECK_RESTAURANT_OPERATION_SERVICE, GET_RESTAURANTS_BASED_ON_CATEGORY, GET_RESTAURANTS_CATEGORIES } from "./actionTypes";
import { CHECK_RESTAURANT_OPERATION_SERVICE_URL, GET_RESTAURANTS_CATEGORIES_URL, GET_FILTERED_RESTAURANTS_URL } from "../../configs";
import Axios from "axios";

export const checkRestaurantOperationService = (restaurant_id, latitude, longitude) => dispatch => {
    Axios.post(CHECK_RESTAURANT_OPERATION_SERVICE_URL, {
        restaurant_id: restaurant_id,
        latitude: latitude,
        longitude: longitude
    })
        .then(response => {
            const coupon = response.data;
            return dispatch({ type: CHECK_RESTAURANT_OPERATION_SERVICE, payload: coupon });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const getRestaurantsBasedOnCategory = (lat, lng, category_ids) => dispatch => {
    Axios.post(GET_FILTERED_RESTAURANTS_URL, {
        latitude: lat,
        longitude: lng,
        category_ids: category_ids
    })
        .then(response => {
            const filtered_restaurants = response.data;
            return dispatch({
                type: GET_RESTAURANTS_BASED_ON_CATEGORY,
                payload: filtered_restaurants
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const getRestaurantsCategories = slug => dispatch => {
    Axios.post(GET_RESTAURANTS_CATEGORIES_URL)
        .then(response => {
            const restaurants_categories = response.data;
            return dispatch({
                type: GET_RESTAURANTS_CATEGORIES,
                payload: restaurants_categories
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};
