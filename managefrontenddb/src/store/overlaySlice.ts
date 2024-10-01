import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type InitialState = {
    activate:boolean,
    addDetail:boolean,
    confirmDeleteProduct:boolean
}

const initialState: InitialState = {
 activate:false,
 addDetail:false,
 confirmDeleteProduct:false
}

export const overlaySlice = createSlice({
    name: 'overlay',
    initialState,
    reducers: {
       setActive(
        state,
        actions:PayloadAction<boolean>
       ){
        state.activate=actions.payload
       },
       setAddDetail(
        state,
        actions:PayloadAction<boolean>
       ){
        state.addDetail=actions.payload
       },
       setConfirmDeleteProduct(
        state,
        actions:PayloadAction<boolean>
       ){
        state.confirmDeleteProduct=actions.payload
       }
    }
})

export const {
    setActive,
    setAddDetail,
    setConfirmDeleteProduct
} = overlaySlice.actions