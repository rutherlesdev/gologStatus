import { ADD_RATING_FOR_ORDER, GET_RATABLE_ORDER_DETAILS } from "./actionTypes";
import { ADD_RATING_URL, GET_RATABLE_ORDER_DETAILS_URL } from "../../configs";
import Axios from "axios";

export const addRating = data => dispatch => {
    Axios.post(ADD_RATING_URL, {
        restaurant_rating: data.restaurant_rating,
        delivery_rating: data.delivery_rating,
        comment: data.comment,
        order_id: data.order_id,
        user_id: data.user_id,
        token: data.auth_token
    })
        .then(response => {
            const rating = response.data;
            return dispatch({
                type: ADD_RATING_FOR_ORDER,
                payload: rating
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const getOrderDetails = (order_id, user_id, token) => dispatch => {
    Axios.post(GET_RATABLE_ORDER_DETAILS_URL, {
        order_id: order_id,
        user_id: user_id,
        token: token
    })
        .then(response => {
            const rating = response.data;
            return dispatch({
                type: GET_RATABLE_ORDER_DETAILS,
                payload: rating
            });
        })
        .catch(function(error) {
            console.log(error);
        });
};
