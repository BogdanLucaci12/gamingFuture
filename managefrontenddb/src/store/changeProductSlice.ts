import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type InitialState = {
    productId: number,
    productDetailId: number,
    clickedOnDetailContainer:boolean,
}

const initialState: InitialState = {
    productId: 0,
    productDetailId: 0,
    clickedOnDetailContainer:false
}

export const changeProduct = createSlice({
    name: 'changeProduct',
    initialState,
    reducers: {
        setProductId(
            state,
            actions: PayloadAction<number>
        ){
            state.productId = actions.payload
        },
        setProductDetailId(
            state,
            actions: PayloadAction<number>
        ){
            state.productDetailId = actions.payload
        },
        setClickedOnDetailContainer(
            state,
            actions: PayloadAction<boolean>
        ) {
            state.clickedOnDetailContainer = actions.payload
        },

    }
})

export const {
    setProductId,
    setProductDetailId,
    setClickedOnDetailContainer
} = changeProduct.actions