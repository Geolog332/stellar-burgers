import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredients } from '../../slice/burgerConstructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // Получаем текущий путь, чтобы передать его в состояние при навигации
    const dispatch = useDispatch(); // Хук для отправки действий в стор

    /**
     * Обработчик добавления ингредиента в конструктор бургера
     */
    const handleAdd = () => {
      dispatch(addIngredients(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Передаем ингредиент в UI компонент
        count={count} // Передаем количество ингредиента в UI компонент
        locationState={{ background: location }} // Передаем текущее состояние пути в UI компонент
        handleAdd={handleAdd} // Передаем обработчик добавления ингредиента в UI компонент
      />
    );
  }
);
