import { USERS_LIST } from '../../constants';
import EditUserForm from './EditUserForm';
import { useGetUsersQuery } from './usersApiSlice';
import { useParams } from 'react-router-dom';

const EditUser = (): JSX.Element => {
  const { id } = useParams();
  const { user } = useGetUsersQuery(USERS_LIST, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[String(id)],
    }),
  });

  return user ? <EditUserForm user={user} /> : <p>Loading...</p>;
};

export default EditUser;
