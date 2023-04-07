import { USERS_LIST } from '../../constants';
import { IUsersResponse } from '../../interface/response.interface';
import { useGetUsersQuery } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

const NewNote = (): JSX.Element => {
  const { users } = useGetUsersQuery(USERS_LIST, {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data.entities[id] as IUsersResponse),
    }),
  });

  if (users && !users.length) return <p>Not currently available</p>;
  return <>{users ? <NewNoteForm users={users} /> : <div>Loading...</div>}</>;
};

export default NewNote;
