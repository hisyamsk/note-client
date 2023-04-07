import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUsersResponse } from '../../interface/response.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAddNewNoteMutation } from './notesApiSlice';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '../../components/ErrorMessage';

const NewNoteForm = ({ users }: { users: IUsersResponse[] }): JSX.Element => {
  const navigate = useNavigate();
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [userId, setUserId] = useState<string>(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/notes');
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e: React.FormEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);
  const onTextChanged = (e: React.FormEvent<HTMLTextAreaElement>) =>
    setText(e.currentTarget.value);
  const onUserIdChanged = (e: React.FormEvent<HTMLSelectElement>) =>
    setUserId(e.currentTarget.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, text });
    }
  };

  const renderOptions = () => {
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    ));
  };

  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validTextClass = !text ? 'form__input--incomplete' : '';

  return (
    <>
      <ErrorMessage isError={isError} error={error} />
      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {renderOptions()}
        </select>
      </form>
    </>
  );
};

export default NewNoteForm;
