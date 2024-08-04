import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, getErrorFeed, getFeedOrders } from '../../slice/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedOrders);
  const ordersError = useSelector(getErrorFeed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Если есть ошибка загрузки заказов, отображаем сообщение об ошибке
  if (ordersError) {
    return (
      <p style={{ color: 'var(--colors-interface-error)' }}>{ordersError}</p>
    );
  }

  // Если заказы еще не загружены, отображаем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }

  // Если заказы успешно загружены, отображаем компонент FeedUI
  return (
    <>
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchFeed()); // Функция для повторного получения списка заказов
        }}
      />
      <Outlet />
    </>
  );
};
