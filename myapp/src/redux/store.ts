import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./authSlice";
import ShoppingListSlice from './productSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        ShoppingList: ShoppingListSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;