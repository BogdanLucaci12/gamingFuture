import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { adminDashboard } from "./deleteUser";
import { homeSlice } from "./homeSlice";
import { changeProduct } from "./changeProductSlice";
import { overlaySlice } from "./overlaySlice";
export const rootReducer=combineReducers({
    user:userSlice.reducer,
    adminDashboard: adminDashboard.reducer,
    home:homeSlice.reducer,
    changeProduct:changeProduct.reducer,
    overlaySlice:overlaySlice.reducer
})