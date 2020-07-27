import {
    GET_RESTAURANT_INFO,
    GET_RESTAURANT_INFO_BY_ID,
    GET_RESTAURANT_ITEMS,
    RESET_INFO,
    RESET_ITEMS,
    SINGLE_ITEM,
    SEARCH_ITEM,
    CLEAR_SEARCH
} from "./actionTypes";

const initialState = {
    restaurant_info: [],
    restaurant_items: [],
    single_item: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_RESTAURANT_INFO:
            return { ...state, restaurant_info: action.payload };
        case GET_RESTAURANT_INFO_BY_ID:
            return { ...state, restaurant_info: action.payload };
        case GET_RESTAURANT_ITEMS:
            return { ...state, restaurant_items: action.payload };
        case RESET_ITEMS:
            return { ...state, restaurant_items: action.payload };
        case RESET_INFO:
            return { ...state, restaurant_info: action.payload };
        case SINGLE_ITEM:
            return { ...state, single_item: action.payload };
        case SEARCH_ITEM:
            return { ...state, restaurant_items: action.payload };
        case CLEAR_SEARCH:
            return { ...state, restaurant_items: action.payload };
        default:
            return state;
    }
}
