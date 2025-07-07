import { configureStore } from '@reduxjs/toolkit'
import userReducer from "../lib/features/project360/userSlice"
import productReducer from "../lib/features/project360/productSlice"


export const makeStore = () => {
  return configureStore({
    reducer:{
      user : userReducer,
      product: productReducer, 
    },
  })
};


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
