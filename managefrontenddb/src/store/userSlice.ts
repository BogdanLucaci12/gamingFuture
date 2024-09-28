import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Rank = 'Admin' | 'Employee' | ''


type InitialState = {
    name: string,
    isAuthenticated: boolean,
    rank: Rank,
    verifyToken:boolean
}

const initialState: InitialState = {
    name: "",
    isAuthenticated: false,
    rank: '',
    verifyToken:true
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(
            state,
            action: PayloadAction<{ name: string; isAuthenticated: boolean; rank: Rank }>
        ) {
            const { name, isAuthenticated, rank } = action.payload;
            state.name = name;
            state.isAuthenticated = isAuthenticated;
            state.rank = rank;
        },
        setVerifyToken(
            state,
            action:PayloadAction<boolean>
        ){
            state.verifyToken=action.payload
        }
    }
})

export const { setCurrentUser, setVerifyToken } = userSlice.actions