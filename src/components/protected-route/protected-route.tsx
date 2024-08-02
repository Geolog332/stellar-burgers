import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { selectAuthChecked, selectUserData } from '../../slice/userSlice';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

// Компонент защищенного маршрута
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  // Получаем состояние проверки аутентификации и данные пользователя из Redux
  const isAuthChecked = useSelector(selectAuthChecked);
  const user = useSelector(selectUserData);
  const location = useLocation();

  // Отображаем загрузчик, если аутентификация еще не проверена
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут не для неаутентифицированных пользователей и пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для неаутентифицированных пользователей и пользователь уже аутентифицирован, перенаправляем на исходную страницу или на главную
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Возвращаем дочерние элементы, если условия аутентификации выполнены
  return children;
};

export type { ProtectedRouteProps };
