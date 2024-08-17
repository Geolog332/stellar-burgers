import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Интерфейс состояния ингредиентов
export interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние
export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Создаем асинхронный Thunk для получения данных ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

// Создаем слайс для управления состоянием ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    // Селекторы для получения частей состояния
    selectIngredients: (state) => state.ingredients,
    selectorLoading: (state) => state.isLoading,
    selectorIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ingredients Error';
      });
  }
});

// Экспортируем редьюсер и селекторы
export const ingredientsReducer = ingredientsSlice.reducer;
export const ingredients = ingredientsSlice.name;
export const { selectIngredients, selectorLoading, selectorIngredientsError } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
