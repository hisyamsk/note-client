import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const DashFooter = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
      <p>Current User:</p>
      <p>Status:</p>
    </footer>
  );
};

export default DashFooter;
