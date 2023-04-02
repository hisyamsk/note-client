import { useAppSelector } from '../../app/hooks';
import { selectAllUsers } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

const NewNote = (): JSX.Element => {
  const users = useAppSelector(selectAllUsers);

  if (!users.length) return <p>Not currently available</p>;

  return <>{users ? <NewNoteForm users={users} /> : <div>Loading...</div>}</>;
};

export default NewNote;
