import {
  BurgerConstructorActions,
  burgerConstructorReducer,
  IConstructorState,
  initialState
} from '../slice/burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

// Моковые данные ингредиентов
const bun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  id: 'bun-1',
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

const mainIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  id: 'main-1',
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

const sauce = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  id: 'sauce-1',
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

describe('constructorSlice', () => {
  test('добавление ингредиента в конструктор', () => {
    const action = BurgerConstructorActions.addIngredients(mainIngredient);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        ...mainIngredient,
        id: expect.any(String)
      })
    );
  });

  test('добавление булки в конструктор', () => {
    const action = BurgerConstructorActions.addIngredients(bun);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.bun).toEqual(
      expect.objectContaining({
        ...bun,
        id: expect.any(String)
      })
    );
  });

  test('изменение порядка ингредиентов', () => {
    const ingredient1: TConstructorIngredient = {
      ...sauce,
      id: 'unique-id-1'
    };
    const ingredient2: TConstructorIngredient = {
      ...sauce,
      id: 'unique-id-2'
    };
    const preloadedState: IConstructorState = {
      ...initialState,
      ingredients: [ingredient1, ingredient2]
    };
    const action = BurgerConstructorActions.changeIngredientsOrder({
      initialIndex: 0,
      finishIndex: 1
    });
    const state = burgerConstructorReducer(preloadedState, action);
    expect(state.ingredients[0]).toEqual(expect.objectContaining(ingredient2));
    expect(state.ingredients[1]).toEqual(expect.objectContaining(ingredient1));
    const actionReverse = BurgerConstructorActions.changeIngredientsOrder({
      initialIndex: 1,
      finishIndex: 0
    });
    const stateReverse = burgerConstructorReducer(state, actionReverse);
    expect(stateReverse.ingredients[0]).toEqual(
      expect.objectContaining(ingredient1)
    );
    expect(stateReverse.ingredients[1]).toEqual(
      expect.objectContaining(ingredient2)
    );
  });

  test('удаление ингредиента', () => {
    const preloadedState: IConstructorState = {
      ...initialState,
      ingredients: [bun, mainIngredient, sauce]
    };
    const action = BurgerConstructorActions.clearIngredients();
    const state = burgerConstructorReducer(preloadedState, action);
    expect(state.ingredients.length).toBe(0);
  });
});
