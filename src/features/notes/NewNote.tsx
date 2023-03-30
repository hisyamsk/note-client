import { useAppSelector } from '../../app/hooks';
import { selectAllUsers } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

const NewNote = (): JSX.Element => {
  const users = useAppSelector(selectAllUsers);

  return <>{users ? <NewNoteForm users={users} /> : <div>Loading...</div>}</>;
};

export default NewNote;
