import { EntityId } from '@reduxjs/toolkit';
import { useAuth } from '../../app/hooks';
import { IErrorResponse } from '../../interface/response.interface';
import Note from './Note';
import { useGetNotesQuery } from './notesApiSlice';

const NotesList = (): JSX.Element => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(
    {},
    {
      pollingInterval: 60 * 1000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const { isAdmin, isManager, username } = useAuth();

  let content: JSX.Element = <></>;
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (isError && error) {
    if ('status' in error) {
      const errorData = error.data as IErrorResponse;
      const errMsg = 'error' in error ? error.error : errorData.message;

      content = <p className="errmsg">{errMsg}</p>;
    } else {
      content = <p className="errmsg">{error.message}</p>;
    }
  }

  if (isSuccess && notes) {
    const { ids, entities } = notes;

    let filteredIds: EntityId[];
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (id) => entities[id]?.user.username === username
      );
    }

    const tableContent =
      ids.length && filteredIds.map((id) => <Note key={id} noteId={id} />);

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Status
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default NotesList;
