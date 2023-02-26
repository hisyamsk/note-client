import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import EditUserForm from './EditUserForm';
import { selectUserById } from './usersApiSlice';

const EditUser = (): JSX.Element => {
  const { id } = useParams();
  const user = useAppSelector((state) => selectUserById(state, String(id)));

  return user ? <EditUserForm user={user} /> : <p>Loading...</p>;
};

export default EditUser;
