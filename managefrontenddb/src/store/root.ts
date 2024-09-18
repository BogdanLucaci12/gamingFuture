import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { adminDashboard } from "./deleteUser";
export const rootReducer=combineReducers({
    user:userSlice.reducer,
    adminDashboard: adminDashboard.reducer
})