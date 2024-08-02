import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from '../slice/ingredientsSlice';
import { burgerConstructorReducer } from '../slice/burgerConstructorSlice';
import { authUserReducer } from '../slice/userSlice';
import { orderDetailsReducer } from '../slice/ordersDetailsSlice';
import { feedReducer } from '../slice/feedSlice';
import { userOrdersReducer } from '../slice/userOrderSlice';

// Комбинируем все редьюсеры
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  orderDetail: orderDetailsReducer,
  authUser: authUserReducer,
  userOrders: userOrdersReducer,
  feed: feedReducer
});

// Хранилище Redux с указанными редьюсерами
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Определяем тип для корневого состояния Redux
export type RootState = ReturnType<typeof rootReducer>;

// Определяем тип для dispatch
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
