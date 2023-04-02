import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { IErrorResponse } from '../interface/response.interface';

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isError, isSuccess, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const renderErrorMessage = () => {
    if (isError && error) {
      if ('status' in error) {
        const errorData = error.data as IErrorResponse;
        const errMsg = 'error' in error ? error.error : errorData.message;

        return errMsg;
      } else {
        return error.message;
      }
    }
    return '';
  };

  const renderLogoutButton = () => (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  if (isLoading) {
    return <p>Logging Out...</p>;
  }

  if (isError) {
    return <p>{renderErrorMessage()}</p>;
  }

  let dashClass = '';
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = 'dash-header__container--small';
  }

  return (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">{renderLogoutButton()}</nav>
      </div>
    </header>
  );
};

export default DashHeader;
