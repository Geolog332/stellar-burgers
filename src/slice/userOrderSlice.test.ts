import { configureStore } from '@reduxjs/toolkit';
import userOrdersReducer, {
  initialState,
  getUserOrders
} from '../slice/userOrderSlice';
import { TOrder } from '@utils-types';
import * as api from '@api';

// Мокируем вызов API
jest.mock('@api');
// мокируем асинхронный Thunk для получения заказов пользователя
const mockGetSelectOrdersApi = api.selectOrdersApi as jest.MockedFunction<
  typeof api.selectOrdersApi
>;

// Вспомогательная функция для создания стора
const createUserOrdersSliceTestStore = () => {
  return configureStore({
    reducer: {
      order: userOrdersReducer
    }
  });
};

describe('тестируем userOrdersSlice', () => {
  describe('reducer', () => {
    test('вернуть начальное состояние', () => {
      expect(userOrdersReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  test('тестируем getUserOrders.pending', () => {
    const nextState = userOrdersReducer(
      initialState,
      getUserOrders.pending('', undefined)
    );
    expect(nextState).toEqual({ orders: [], error: null });
  });

  test('тестируем getUserOrders.fulfilled', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2024-08-17T12:00:00',
        updatedAt: '2024-08-17T12:00:00',
        number: 1,
        ingredients: ['ingredient1']
      }
    ];
    const nextState = userOrdersReducer(
      initialState,
      getUserOrders.fulfilled(mockOrders, '', undefined)
    );
    expect(nextState).toEqual({ orders: mockOrders, error: null });
  });

  test('тестируем getUserOrders.rejected', () => {
    const nextState = userOrdersReducer(
      initialState,
      getUserOrders.rejected(null, '', undefined)
    );
    expect(nextState).toEqual({ orders: [], error: 'Orders history Error' });
  });
});

describe('тестируем getUserOrders async action', () => {
  test('тестируем успешное выполнение getUserOrders', async () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2024-08-17T12:00:00',
        updatedAt: '2024-08-17T12:00:00',
        number: 1,
        ingredients: ['ingredient1']
      }
    ];

    mockGetSelectOrdersApi.mockResolvedValue(mockOrders);
    const store = createUserOrdersSliceTestStore();
    await store.dispatch(getUserOrders());
    const state = store.getState();
    expect(state.order).toEqual({ orders: mockOrders, error: null });
  });

  test('тестируем ошибку в выполнении getUserOrders', async () => {
    mockGetSelectOrdersApi.mockRejectedValue(new Error('Error'));
    const store = createUserOrdersSliceTestStore();
    await store.dispatch(getUserOrders());
    const state = store.getState();
    expect(state.order).toEqual({
      orders: [],
      error: 'Orders history Error'
    });
  });
});
