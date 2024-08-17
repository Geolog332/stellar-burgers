import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import {
  TLoginData,
  TRegisterData,
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';

// Интерфейс состояния для аутентификации пользователя
interface IAuthUser {
  userData: TUser | null;
  isAuthChecked: boolean;
  loginUserRequest: boolean;
  errorRegistration: string | null;
  errorLogin: string | null;
  errorUpdate: string | null;
  errorLogout: string | null;
}

// Начальное состояние
export const initialState: IAuthUser = {
  userData: null,
  isAuthChecked: false,
  loginUserRequest: false,
  errorRegistration: null,
  errorLogin: null,
  errorUpdate: null,
  errorLogout: null
};

// Создаем асинхронный Thunk для получения данных пользователя
export const fetchUserData = createAsyncThunk(
  'authUser/fetchUserData',
  getUserApi
);

// Создаем асинхронный Thunk для проверки аутентификации пользователя
export const verifyUserAuth = createAsyncThunk(
  'authUser/verifyUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(fetchUserData());
    }
    dispatch(setAuthChecked());
  }
);

// Создаем асинхронный Thunk для входа пользователя
export const loginUser = createAsyncThunk(
  'authUser/loginUser',
  async (loginData: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi(loginData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

// Создаем асинхронный Thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  'authUser/registerUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi(registerData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

// Создаем асинхронный Thunk для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'authUser/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

// Создаем асинхронный Thunk для запроса сброса пароля
export const forgotPassword = createAsyncThunk(
  'authUser/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

// Создаем асинхронный Thunk для сброса пароля
export const resetPassword = createAsyncThunk(
  'authUser/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);

// Создаем асинхронный Thunk для выхода пользователя
export const logoutUser = createAsyncThunk('authUser/logoutUser', async () => {
  const response = await logoutApi();
  return response;
});

// Создаем слайс для пользователя
const userSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      })
      .addCase(verifyUserAuth.pending, (state) => {
        state.errorLogin = null;
        state.errorRegistration = null;
        state.errorLogout = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.errorLogin = null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.errorLogin = 'Access to the personal account Error';
        state.loginUserRequest = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorRegistration = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loginUserRequest = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.errorRegistration = 'Registration Error';
        state.loginUserRequest = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.userData = null;
        state.errorUpdate = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.userData = action.payload.user;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.errorUpdate = 'Update User Data Error';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorLogout = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loginUserRequest = false;
        state.userData = null;
        localStorage.clear();
        deleteCookie('accessToken');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.errorLogout = 'Logout Error';
      });
  }
});

// Создание селекторов с помощью createSelector из Redux Toolkit
export const selectUserData = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.userData
);

export const selectAuthChecked = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.isAuthChecked
);

export const selectLoginUserRequest = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.loginUserRequest
);

export const selectErrorRegistration = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.errorRegistration
);

export const selectErrorLogin = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.errorLogin
);

export const selectErrorUpdate = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.errorUpdate
);

// Экспорт редьюсера, селекторов и пр.
export const authUserReducer = userSlice.reducer;
export const { setAuthChecked } = userSlice.actions;
export const authUser = userSlice.name;
export default userSlice.reducer;
