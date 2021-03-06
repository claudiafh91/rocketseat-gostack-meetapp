import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { authenticationSuccess, signUpSuccess, signFail } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'user-login', { email, password });

    const { token, user } = response.data;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(authenticationSuccess(token, user));

    history.push('/dashboard');
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados');
    yield put(signFail());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'user-registrer', { name, email, password });

    yield put(signUpSuccess());

    toast.success('Cadastro feito com sucesso!');
    history.push('/');
  } catch (err) {
    toast.error('Falha no cadastro, tente novamente!');
    yield put(signFail());
  }
}

export function signOut() {
  history.push('/');
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.Auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/AUTH_REQUEST', signIn),
  takeLatest('@auth/SIGNOUT', signOut),
  takeLatest('@auth/SIGNUP_REQUEST', signUp),
]);
