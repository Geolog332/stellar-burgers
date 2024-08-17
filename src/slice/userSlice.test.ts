import { configureStore } from '@reduxjs/toolkit';
import {
  authUserReducer,
  fetchUserData,
  verifyUserAuth,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  setAuthChecked,
  initialState
} from '../slice/userSlice';
import * as api from '@api';
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';

// Мокируем вызов API и утилит
jest.mock('@api');
jest.mock('../utils/cookie');
// мокируем асинхронный Thunk для получения данных пользователя
const mockGetUserApi = api.getUserApi as jest.MockedFunction<
  typeof api.getUserApi
>;
// мокируем асинхронный Thunk для входа пользователя
const mockLoginUserApi = api.loginUserApi as jest.MockedFunction<
  typeof api.loginUserApi
>;
// мокируем асинхронный Thunk для регистрации пользователя
const mockRegisterUserApi = api.registerUserApi as jest.MockedFunction<
  typeof api.registerUserApi
>;
// мокируем асинхронный Thunk для обновления данных пользователя
const mockUpdateUserApi = api.updateUserApi as jest.MockedFunction<
  typeof api.updateUserApi
>;
// мокируем асинхронный Thunk для выхода пользователя
const mockLogoutApi = api.logoutApi as jest.MockedFunction<
  typeof api.logoutApi
>;

// Вспомогательная функция для создания стора
const createTestStore = () => {
  return configureStore({
    reducer: {
      authUser: authUserReducer
    }
  });
};

// Мокируем localStorage
beforeEach(() => {
  global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  };
});

describe('тестируем userSlice', () => {
  describe('тестируем асинхронные Thunk', () => {
    test('тестируем fetchUserData', async () => {
      const store = createTestStore();
      const user = {
        id: 1,
        name: 'Anton Mataev',
        email: 'Anton_M@example.com'
      };
      mockGetUserApi.mockResolvedValue({ success: true, user });
      await store.dispatch(fetchUserData());
      const state = store.getState().authUser;
      expect(state.userData).toEqual(user);
    });

    test('тестируем verifyUserAuth', async () => {
      const store = createTestStore();
      const user = {
        id: 1,
        name: 'Anton Mataev',
        email: 'Anton_M@example.com'
      };
      (getCookie as jest.Mock).mockReturnValue('dummyToken');
      mockGetUserApi.mockResolvedValue({ success: true, user });
      await store.dispatch(verifyUserAuth());
      const state = store.getState().authUser;
      expect(state.isAuthChecked).toBe(true);
      expect(state.userData).toEqual(user);
    });

    test('тестируем loginUser', async () => {
      const store = createTestStore();
      const user = {
        id: 1,
        name: 'Anton Mataev',
        email: 'Anton_M@example.com'
      };
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';
      mockLoginUserApi.mockResolvedValue({
        success: true,
        accessToken,
        refreshToken,
        user
      });
      await store.dispatch(
        loginUser({ email: 'test@test.com', password: 'password' })
      );
      const state = store.getState().authUser;
      expect(state.userData).toEqual(user);
      expect(setCookie).toHaveBeenCalledWith('accessToken', accessToken);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });

    test('тестируем registerUser', async () => {
      const store = createTestStore();
      const user = {
        id: 1,
        name: 'Anton Mataev',
        email: 'Anton_M@example.com'
      };
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';
      mockRegisterUserApi.mockResolvedValue({
        success: true,
        accessToken,
        refreshToken,
        user
      });
      await store.dispatch(
        registerUser({
          email: 'test@test.com',
          password: 'password',
          name: ''
        })
      );
      const state = store.getState().authUser;
      expect(state.userData).toEqual(user);
      expect(setCookie).toHaveBeenCalledWith('accessToken', accessToken);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });

    test('тестируем updateUser', async () => {
      const store = createTestStore();
      const updatedUser = {
        id: 1,
        name: 'Anton Mataev',
        email: 'Anton_M@example.com'
      };
      mockUpdateUserApi.mockResolvedValue({ success: true, user: updatedUser });
      await store.dispatch(updateUser({ name: 'John Smith' }));
      const state = store.getState().authUser;
      expect(state.userData).toEqual(updatedUser);
    });

    test('тестируем logoutUser', async () => {
      const store = createTestStore();
      mockLogoutApi.mockResolvedValue({ success: true });
      await store.dispatch(logoutUser());
      const state = store.getState().authUser;
      expect(state.userData).toBeNull();
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
  describe('reducer', () => {
    test('setAuthChecked updates isAuthChecked to true', () => {
      const state = authUserReducer(initialState, setAuthChecked());
      expect(state.isAuthChecked).toBe(true);
    });
  });
});
