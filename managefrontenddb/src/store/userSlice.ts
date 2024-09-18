import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Rank = 'Admin' | 'Employee' | ''


type InitialState = {
    name: string,
    isAuthenticated: boolean,
    rank: Rank
}

const initialState: InitialState = {
    name: "",
    isAuthenticated: false,
    rank: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(
            state,
            action: PayloadAction<InitialState>
        ) {
            return { ...state, ...action.payload }
        }
    }
})

export const { setCurrentUser } = userSlice.actions