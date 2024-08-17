import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { selectOrdersApi } from '@api';
import { TOrder } from '@utils-types';

// Интерфейс состояния пользовательских заказов
export interface IOrderUserState {
  orders: TOrder[];
  error: string | null;
}

// Начальное состояние
export const initialState: IOrderUserState = {
  orders: [],
  error: null
};

// Создаем асинхронный Thunk для получения заказов пользователя
export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  selectOrdersApi
);

// Создаем слайс для заказов пользователя
const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    selectUserOrdersList: (state) => state.orders,
    selectUserOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.orders = [];
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.error = 'Orders history Error';
      });
  }
});

// Экспортируем редюсер, слайс и селекторы
export const userOrdersReducer = userOrdersSlice.reducer;
export const userOrders = userOrdersSlice.name;
export const { selectUserOrdersList, selectUserOrdersError } =
  userOrdersSlice.selectors;
export default userOrdersSlice.reducer;
