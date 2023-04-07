import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import { useGetNotesQuery } from './notesApiSlice';
import { NOTES_LIST } from '../../constants';
import { memo } from 'react';

const Note = ({ noteId }: { noteId: EntityId }): JSX.Element | null => {
  const navigate = useNavigate();

  const { note } = useGetNotesQuery(NOTES_LIST, {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  if (note) {
    const goToEditNotePage = () => navigate(`/dash/notes/${noteId}`);

    const created = new Date(note.createdAt).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
    });
    const updated = new Date(note.updatedAt).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
    });

    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.user.username}</td>

        <td className="table__cell">
          <button
            className="icon-button table__button"
            onClick={goToEditNotePage}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  }
  return null;
};

const memoizedNote = memo(Note);
export default memoizedNote;
