import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAppSelector, usePersist } from '../../app/hooks';
import { IErrorResponse } from '../../interface/response.interface';
import { useRefreshMutation } from './authApiSlice';
import { selectCurrentToken } from './authSlice';

const PersistLogin = (): JSX.Element => {
  const navigate = useNavigate();
  const [persist] = usePersist();
  const token = useAppSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [isTrueSucces, setIsTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isError, isSuccess, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        try {
          await refresh({});
          setIsTrueSuccess(true);
        } catch (err) {
          console.log(err);
        }
      };

      if (!token && !persist) navigate('/login');
      if (!token && persist) verifyRefreshToken();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  if (isLoading) return <p>Loading...</p>;

  if (isError && error) {
    if ('status' in error) {
      const erorrData = error.data as IErrorResponse;
      return (
        <p className="errmsg">
          {erorrData.message}
          <Link to="/login">Please Login again</Link>
        </p>
      );
    }
  }

  if (isTrueSucces && isSuccess) return <Outlet />;

  if (token && isUninitialized) return <Outlet />;

  return <></>;
};

export default PersistLogin;
