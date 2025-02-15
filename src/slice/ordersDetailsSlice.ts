import { selectOrderByNumberApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Интерфейс состояния для описания состояния заказа
interface IOrderDetailsState {
  order: TOrder | null;
  orderRequest: boolean;
  errorDetailsOrder: string | null;
  errorMakeOrder: string | null;
}

// Начальное состояние
const initialState: IOrderDetailsState = {
  order: null,
  orderRequest: false,
  errorDetailsOrder: null,
  errorMakeOrder: null
};

// Создаем асинхронный Thunk для получения деталей заказа
export const getDetailsOrder = createAsyncThunk(
  'order/getDetailsOrder',
  async (numberOrder: number, { dispatch }) => {
    dispatch(clearOrderState());
    return selectOrderByNumberApi(numberOrder);
  }
);

// Создаем асинхронный Thunk для создания нового заказа
export const makeOrder = createAsyncThunk(
  'order/makeOrder',
  async (data: string[], { dispatch }) => {
    dispatch(clearOrderState());
    const dataOrder = await orderBurgerApi(data);
    return dataOrder;
  }
);

// Создаем слайс для управления состоянием заказа
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
      state.errorDetailsOrder = null;
      state.errorMakeOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояний для получения деталей заказа
      .addCase(getDetailsOrder.pending, (state) => {
        state.errorDetailsOrder = null;
        state.orderRequest = true;
      })
      .addCase(getDetailsOrder.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.orderRequest = false;
      })
      .addCase(getDetailsOrder.rejected, (state) => {
        state.errorDetailsOrder = 'Order data Error';
        state.orderRequest = false;
      })
      // Обработка состояний для создания нового заказа
      .addCase(makeOrder.pending, (state) => {
        state.errorMakeOrder = null;
        state.orderRequest = true;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(makeOrder.rejected, (state) => {
        state.errorMakeOrder = 'Make order Error';
        state.orderRequest = false;
      });
  }
});

// Создание селекторов с помощью createSelector из Redux Toolkit
export const selectOrder = createSelector(
  (state: { orderDetail: IOrderDetailsState }) => state.orderDetail,
  (orderDetail) => orderDetail.order
);
export const selectOrderRequest = createSelector(
  (state: { orderDetail: IOrderDetailsState }) => state.orderDetail,
  (orderRequest) => orderRequest.order
);

// Экспорт действий и редьюсеров
export const { clearOrderState } = orderSlice.actions;
export const orderDetailsReducer = orderSlice.reducer;
export const orderDetail = orderSlice.name;
