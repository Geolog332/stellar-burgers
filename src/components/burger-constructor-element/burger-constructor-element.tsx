import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  changeIngredientsOrder,
  removeIngredients
} from '../../slice/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // Инициализация dispatch

    // Обработчик перемещения ингредиента вниз
    const handleMoveDown = () => {
      dispatch(
        changeIngredientsOrder({ initialIndex: index, finishIndex: index + 1 })
      );
    };

    // Обработчик перемещения ингредиента вверх
    const handleMoveUp = () => {
      dispatch(
        changeIngredientsOrder({ initialIndex: index, finishIndex: index - 1 })
      );
    };

    // Обработчик удаления ингредиента из конструктора
    const handleClose = () => {
      dispatch(removeIngredients(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
