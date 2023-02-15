import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';

import { selectByUserId } from './usersApiSlice';
import { useAppSelector } from '../../app/hooks';

const User = ({ userId }: { userId: EntityId }): JSX.Element | null => {
  const user = useAppSelector((state) => selectByUserId(state, userId));
  const navigate = useNavigate();

  if (user) {
    const goToEditUserPage = () => navigate(`/dash/users/${userId}`);
    const userRolesString = user.roles.toString().replaceAll(',', ', ');
    const cellStatusStyling = user.active ? '' : 'table__cel--inactive';

    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatusStyling}`}>{user.username}</td>
        <td className={`table__cell ${cellStatusStyling}`}>
          {userRolesString}
        </td>
        <td className={`table__cell ${cellStatusStyling}`}>
          <button
            className="icon-button table__button"
            onClick={goToEditUserPage}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  }

  return null;
};

export default User;
