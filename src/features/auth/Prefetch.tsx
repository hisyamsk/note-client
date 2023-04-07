import { notesApiSlice } from '../notes/notesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { NOTES_LIST, USERS_LIST } from '../../constants';

const Prefetch = (): JSX.Element => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      notesApiSlice.util.prefetch('getNotes', NOTES_LIST, { force: true })
    );
    dispatch(
      usersApiSlice.util.prefetch('getUsers', USERS_LIST, { force: true })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;
