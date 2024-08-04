import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectErrorRegistration,
  selectLoginUserRequest,
  registerUser
} from '../../slice/userSlice';
import { Preloader } from '@ui';

export const Register: FC = () => {
  // Локальные состояния для user, email, password
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получение состояния ошибки и запроса на регистрацию из Redux
  const error = useSelector(selectErrorRegistration) || undefined;
  const registration = useSelector(selectLoginUserRequest);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <>
      {registration ? (
        <Preloader />
      ) : (
        <RegisterUI
          errorText={error}
          email={email}
          userName={userName}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          setUserName={setUserName}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
