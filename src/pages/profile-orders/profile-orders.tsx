import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  selectUserOrdersError,
  selectUserOrdersList
} from '../../slice/userOrderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrdersList);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // Если заказы еще не загружены, отображаем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <>
      {error ? (
        <p style={{ color: 'var(--colors-interface-error)' }}>error</p>
      ) : (
        <ProfileOrdersUI orders={orders} />
      )}
    </>
  );
};
