import Note from './Note';
import { useGetNotesQuery } from './notesApiSlice';

const NotesList = (): JSX.Element => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery({});

  let content: JSX.Element = <></>;
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (isError && error) {
    if ('status' in error) {
      const errMsg =
        'error' in error ? error.error : JSON.stringify(error.data);

      content = <p className="errmsg">{errMsg}</p>;
    } else {
      content = <div>{error.message}</div>;
    }
  }

  if (isSuccess && notes) {
    const { ids } = notes;

    const tableContent = ids.length
      ? ids.map((id) => <Note key={id} noteId={id} />)
      : null;

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
