import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import { useGetUsersQuery } from './usersApiSlice';
import { USERS_LIST } from '../../constants';
import { memo } from 'react';

const User = ({ userId }: { userId: EntityId }): JSX.Element | null => {
  const navigate = useNavigate();
  const { user } = useGetUsersQuery(USERS_LIST, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

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

const memoizedUser = memo(User);
export default memoizedUser;
