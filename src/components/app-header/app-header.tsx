import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../slice/userSlice';
import { Outlet } from 'react-router-dom';

export const AppHeader: FC = () => {
  // Получаем имя пользователя из Redux, если данные пользователя существуют
  const userName = useSelector(selectUserData)?.name || '';

  return (
    <>
      <AppHeaderUI userName={userName} />
      <Outlet />
    </>
  );
};
