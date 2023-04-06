import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { selectCurrentToken } from '../features/auth/authSlice';
import { Roles } from '../interface/request.interface';
import { ITokenDecode, IUseAuth } from '../interface/slice.interface';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const usePersist = () => {
  const [persist, setPersist] = useState<boolean>(
    Boolean(JSON.parse(localStorage.getItem('persist') || '{}'))
  );

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist] as const;
};

export const useAuth = (): IUseAuth => {
  const token: string = useAppSelector(selectCurrentToken);
  let isManager: boolean = false;
  let isAdmin: boolean = false;
  let status: Roles = 'Employee';

  if (token) {
    const decoded = jwtDecode<ITokenDecode>(token);
    const { username, roles } = decoded.UserInfo;

    // set to highest role status
    isManager = roles.includes('Manager');
    isAdmin = roles.includes('Admin');

    if (isManager) status = 'Manager';
    if (isAdmin) status = 'Admin';

    return { username, roles, status, isManager, isAdmin };
  }

  return { username: '', roles: [], status, isManager, isAdmin };
};
