import { APPLY_COUPON } from "./actionTypes";

const initialState = {
    coupon: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case APPLY_COUPON:
            return { ...state, coupon: action.payload };
        default:
            return state;
    }
}
