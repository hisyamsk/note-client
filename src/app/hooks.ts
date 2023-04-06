import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

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
