import { BurgerConstructorUI } from '@ui';
import {
  clearIngredients,
  selectIngredients
} from '../../slice/burgerConstructorSlice';
import {
  clearOrderState,
  makeOrder,
  selectOrder,
  selectOrderRequest
} from '../../slice/ordersDetailsSlice';
import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { selectUserData } from '../../slice/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const constructorItems = useSelector(selectIngredients);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrder);

  // Обработчик клика на кнопку заказа
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!userData) {
      navigate('/login', { replace: true });
      return;
    }
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    dispatch(makeOrder(ingredientsId))
      .unwrap()
      .then(() => {
        dispatch(clearIngredients()); // Очищаем конструктор после успешного заказа
      })
      .catch((error) => {
        console.error('Не удалось оформить заказ:', error);
        // Опционально можно обработать ошибку, например, показать уведомление пользователю
      });
  };

  // Обработчик закрытия модального окна заказа
  const closeOrderModal = () => {
    dispatch(clearOrderState());
  };

  // Вычисление общей стоимости заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      // orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      orderRequest={false}
    />
  );
};
