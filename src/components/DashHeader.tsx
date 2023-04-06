import {
  faCirclePlus,
  faFilePen,
  faRightFromBracket,
  faUserGear,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../app/hooks';
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

  const { isManager, isAdmin } = useAuth();

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

  const onNewNoteClicked = () => navigate('/dash/notes/new');
  const onNewUserClicked = () => navigate('/dash/users/new');
  const onNotesClicked = () => navigate('/dash/notes');
  const onUsersClicked = () => navigate('/dash/users');

  const renderLogoutButton = () => (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const renderButtonsSection = () => {
    let newNoteButton = <></>;
    let newUserButton = <></>;
    let usersButton = <></>;
    let notesButton = <></>;

    if (NOTES_REGEX.test(pathname)) {
      newNoteButton = (
        <button
          className="icon-button"
          title="New Note"
          onClick={onNewNoteClicked}
        >
          <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      );
    }

    if (USERS_REGEX.test(pathname)) {
      newUserButton = (
        <button
          className="icon-button"
          title="New User"
          onClick={onNewUserClicked}
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </button>
      );
    }

    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
      notesButton = (
        <button className="icon-button" title="Notes" onClick={onNotesClicked}>
          <FontAwesomeIcon icon={faFilePen} />
        </button>
      );
    }

    if (isManager || isAdmin) {
      if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
        usersButton = (
          <button
            className="icon-button"
            title="Users"
            onClick={onUsersClicked}
          >
            <FontAwesomeIcon icon={faUserGear} />
          </button>
        );
      }
    }

    return (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {usersButton}
        {renderLogoutButton()}
      </>
    );
  };

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
        <nav className="dash-header__nav">{renderButtonsSection()}</nav>
      </div>
    </header>
  );
};

export default DashHeader;
