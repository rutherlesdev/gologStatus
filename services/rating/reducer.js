import { ADD_RATING_FOR_ORDER, GET_RATABLE_ORDER_DETAILS } from "./actionTypes";

const initialState = {
    done_rating: [],
    rating_details: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_RATING_FOR_ORDER:
            return { ...state, done_rating: action.payload };
        case GET_RATABLE_ORDER_DETAILS:
            return { ...state, rating_details: action.payload };
        default:
            return state;
    }
}
