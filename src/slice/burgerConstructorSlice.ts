import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Интерфейс состояния конструктора бургера
export interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

// Начальное состояние
const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

// Создаем слайс для управления состоянием конструктора бургера
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          // Если добавляем булочку, заменяем текущую
          state.bun = action.payload;
        } else {
          // Иначе добавляем ингредиент в список
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        ); // Генерируем уникальный id для ингредиента
        return { payload: { ...ingredient, id } }; // Возвращаем payload с новым id
      }
    },
    // Редьюсер для изменения порядка ингредиентов
    changeIngredientsOrder: (state, action) => {
      const initialElement = state.ingredients[action.payload.initialIndex];
      state.ingredients[action.payload.initialIndex] =
        state.ingredients[action.payload.finishIndex];
      state.ingredients[action.payload.finishIndex] = initialElement;
    },
    // Редьюсер для удаления ингредиента из конструктора
    removeIngredients: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Редьюсер для очистки конструктора
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    // Селектор для получения ингредиентов из конструктора
    selectIngredients: (state) => state
  }
});

// Экспортируем редьюсер и селекторы
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const burgerConstructor = burgerConstructorSlice.name;
export const {
  addIngredients,
  changeIngredientsOrder,
  removeIngredients,
  clearIngredients
} = burgerConstructorSlice.actions;
export const { selectIngredients } = burgerConstructorSlice.selectors;
