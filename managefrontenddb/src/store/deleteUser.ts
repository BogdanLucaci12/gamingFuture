import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DeleteUserType = {
    id: number;
    name: string;
    content: 'Admin'| 'Employee' | '';
};

type InitialState = {
    deleteUser: DeleteUserType;
    showfloat: boolean;
};

const initialState: InitialState = {
    deleteUser: {
        id: 0,
        name: '',
        content: ''
    },
    showfloat: false
};

export const adminDashboard = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {
        setDeleteUser(
            state,
            action: PayloadAction<DeleteUserType>
        ) {
            state.deleteUser = action.payload;
        },
        setShowFloat(
            state,
            action: PayloadAction<boolean>
        ) {
            state.showfloat = action.payload;
        }
    }
});

export const { setDeleteUser, setShowFloat } = adminDashboard.actions;
