import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type InitialState = {
    categoryHomeState:string,
    subCategoryHomeState:string,
    brandHomeState:boolean
}

const initialState: InitialState = {
  categoryHomeState:'',
  subCategoryHomeState:'',
  brandHomeState:false
}

export const homeSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       setCategoryHomeState(
        state,
           actions: PayloadAction<string>
       ){
        state.categoryHomeState=actions.payload
       },
       setSubcategoryHomeState(
        state,
           actions: PayloadAction<string>
       ){
        state.subCategoryHomeState=actions.payload
       },
        setBrandHomeState(
            state,
            actions: PayloadAction<boolean>
        ) {
            state.brandHomeState = actions.payload
        }
    }
})

export const { setCategoryHomeState,
     setSubcategoryHomeState,
    setBrandHomeState
    } = homeSlice.actions