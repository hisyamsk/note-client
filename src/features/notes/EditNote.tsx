import { useParams } from 'react-router-dom';
import { useAuth } from '../../app/hooks';
import { NOTES_LIST, USERS_LIST } from '../../constants';
import { IUsersResponse } from '../../interface/response.interface';
import { useGetUsersQuery } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import { useGetNotesQuery } from './notesApiSlice';

const EditNote = (): JSX.Element => {
  const { id } = useParams();
  const { username, isAdmin, isManager } = useAuth();

  const { users } = useGetUsersQuery(USERS_LIST, {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data.entities[id] as IUsersResponse),
    }),
  });

  const { note } = useGetNotesQuery(NOTES_LIST, {
    selectFromResult: ({ data }) => ({
      note: data?.entities[String(id)],
    }),
  });

  if (!isAdmin && !isManager) {
    if (note?.user.username !== username) {
      return <p>No Access</p>;
    }
  }

  return (
    <>
      {note && users ? (
        <EditNoteForm note={note} users={users} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default EditNote;
