
import store, { rootReducer } from '../services/store';
import { initialState as burgerConstructor } from '../slice/burgerConstructorSlice';
import { initialState as feed } from '../slice/feedSlice';
import { initialState as ingredients } from '../slice/ingredientsSlice';
import { initialState as orderDetails } from '../slice/ordersDetailsSlice';
import { initialState as userOrders } from '../slice/userOrderSlice';
import { initialState as authUser } from '../slice/userSlice';

// Начальное состояние
const initialRootState = {
  ingredients: ingredients,
  burgerConstructor: burgerConstructor,
  orderDetail: orderDetails,
  authUser: authUser,
  userOrders: userOrders,
  feed: feed
};

describe('rootReducer', () => {
  test('должен правильно объединять состояния различных редюсеров', () => {
    // Пример действия и ожидания
    const action = { type: 'UNKNOWN_ACTION' };
    // Получаем итоговое состояние после применения действия к rootReducer
    const state = rootReducer(initialRootState, action);
    // Сравниваем, что состояние каждого slice остается прежним, так как нет обработчиков для ACTION_1
    expect(state).toEqual(initialRootState);
  });

  test('должен правильно инициализировать начальное состояние', () => {
    // Получаем текущее состояние store
    const state = store.getState();
    // Сравниваем, что текущее состояние совпадает с начальным состоянием
    expect(state).toEqual(initialRootState);
  });
});
