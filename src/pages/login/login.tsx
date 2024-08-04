import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectErrorLogin,
  selectLoginUserRequest,
  loginUser
} from '../../slice/userSlice';

export const Login: FC = () => {
  // Локальные состояния для email, password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получение состояния ошибки и запроса на вход из Redux
  const errorText = useSelector(selectErrorLogin) || undefined;
  const registration = useSelector(selectLoginUserRequest);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <>
      {registration ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText={errorText}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
