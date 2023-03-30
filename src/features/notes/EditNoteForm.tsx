import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  INotesResponse,
  IUsersResponse,
} from '../../interface/response.interface';
import { useDeleteNoteMutation, useUpdateNoteMutation } from './notesApiSlice';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const EditNoteForm = ({
  note,
  users,
}: {
  note: INotesResponse;
  users: IUsersResponse[];
}): JSX.Element => {
  const navigate = useNavigate();
  const [
    updateNote,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateNoteMutation();

  const [
    deleteNote,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
    },
  ] = useDeleteNoteMutation();

  const [title, setTitle] = useState<string>(note.title);
  const [text, setText] = useState<string>(note.text);
  const [isCompleted, setIsCompleted] = useState<boolean>(note.completed);
  const [userId, setUserId] = useState<string>(note.user._id);

  useEffect(() => {
    if (isUpdateSuccess || isDeleteSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/notes');
    }
  }, [isUpdateSuccess, isDeleteSuccess, navigate]);

  const created = new Date(note.createdAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const updated = new Date(note.updatedAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const renderOptions = () => {
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    ));
  };

  const renderErrorMessage = () => {
    if (isUpdateError && updateError) {
      if ('status' in updateError) {
        const errMsg =
          'error' in updateError
            ? updateError.error
            : JSON.stringify(updateError.data);

        return errMsg;
      } else {
        return updateError.message;
      }
    }

    if (isDeleteError && deleteError) {
      if ('status' in deleteError) {
        const errMsg =
          'error' in deleteError
            ? deleteError.error
            : JSON.stringify(deleteError.data);

        return errMsg;
      } else {
        return deleteError.message;
      }
    }
    return '';
  };

  const onUpdateNoteClick = async () => {
    if (canSave) {
      await updateNote({
        id: note.id,
        user: userId,
        title,
        text,
        completed: isCompleted,
      });
    }
  };

  const onDeleteNoteClick = async () => {
    await deleteNote({ id: note.id });
  };

  const onTitleChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const onTextChanged = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };
  const onUserIdChanged = (e: React.FormEvent<HTMLSelectElement>) => {
    setUserId(e.currentTarget.value);
  };
  const onCompletedChanged = () => setIsCompleted(!isCompleted);

  const errClass = isUpdateError || isDeleteError ? 'errmsg' : 'offscreen';
  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validTextClass = !text ? 'form__input--incomplete' : '';

  const canSave =
    [title, text, userId].every(Boolean) &&
    !isUpdateLoading &&
    !isDeleteLoading;

  return (
    <>
      <p className={errClass}>{renderErrorMessage()}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__actions-buttons">
            <button
              className="icon-button"
              title="save"
              disabled={!canSave}
              onClick={onUpdateNoteClick}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="delete"
              onClick={onDeleteNoteClick}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label htmlFor="note-title" className="form__label">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="note-completed"
            >
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={isCompleted}
                onChange={onCompletedChanged}
              />
            </label>

            <label
              className="form__label form__checkbox-container"
              htmlFor="note-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {renderOptions()}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditNoteForm;
