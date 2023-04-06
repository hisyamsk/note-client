import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/hooks';

const DashFooter = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username, status } = useAuth();

  const onGoHomeClicked = (): void => {
    navigate('/dash');
  };

  const renderGoHomeButton = (): JSX.Element | undefined => {
    if (pathname !== '/dash') {
      return (
        <button
          className="dash-footer__button icon-button"
          title="Home"
          onClick={onGoHomeClicked}
        >
          <FontAwesomeIcon icon={faHouse} />
        </button>
      );
    }
  };

  return (
    <footer className="dash-footer">
      {renderGoHomeButton()}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
};

export default DashFooter;
