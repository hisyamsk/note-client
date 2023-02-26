import { useState, useEffect } from 'react';
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ROLES, USER_REGEX, PW_REGEX } from '../../constants';
import { IUsersResponse } from '../../interface/response.interface';
import { Roles } from '../../interface/request.interface';

const EditUserForm = ({ user }: { user: IUsersResponse }): JSX.Element => {
  const navigate = useNavigate();
  const [
    updateUser,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateUserMutation();
  const [
    deleteUser,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
    },
  ] = useDeleteUserMutation();

  const [username, setUsername] = useState<string>(user.username);
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordConfirmation, setPasswordConfrimation] = useState<string>('');
  const [validPasswordConfirmation, setValidPasswordConfirmation] =
    useState<boolean>(false);
  const [roles, setRoles] = useState<Roles[]>(user.roles);
  const [active, setActive] = useState<boolean>(user.active);

  let canSave: boolean;
  if (password) {
    canSave =
      [
        roles.length,
        validUsername,
        validPassword,
        validPasswordConfirmation,
      ].every(Boolean) &&
      !isUpdateLoading &&
      !isDeleteLoading;
  } else {
    canSave =
      [roles.length, validUsername].every(Boolean) &&
      !isUpdateLoading &&
      !isDeleteLoading;
  }

  const errClass = isUpdateError || isDeleteError ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass =
    password && !validPassword ? 'form__input--incomplete' : '';
  const validPwdConfirmationClass =
    passwordConfirmation && !validPasswordConfirmation
      ? 'form__input--incomplete'
      : '';
  const validRolesClass = !Boolean(roles.length)
    ? 'form__input--incomplete'
    : '';

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PW_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidPasswordConfirmation(passwordConfirmation === password);
  }, [passwordConfirmation]);

  useEffect(() => {
    if (isUpdateSuccess || isDeleteSuccess) {
      setUsername('');
      setPassword('');
      setPasswordConfrimation('');
      setActive(false);
      setRoles(['Employee']);
      navigate('/dash/users');
    }
  }, [isUpdateSuccess, isDeleteSuccess, navigate]);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) =>
    setUsername(e.currentTarget.value);

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const onPasswordConfirmationChange = (e: React.FormEvent<HTMLInputElement>) =>
    setPasswordConfrimation(e.currentTarget.value);

  const onRolesChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.currentTarget.selectedOptions,
      (option) => option.value
    ) as Roles[];
    setRoles(values);
  };

  const onActiveChange = () => setActive(!active);

  const onUpdateUserClick = async () => {
    if (password && passwordConfirmation) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  const onDeleteUserClick = async () => {
    await deleteUser({ id: user.id });
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

  const renderOptions = (): JSX.Element[] => {
    return Object.values(ROLES).map((role) => (
      <option value={role} key={role}>
        {role}
      </option>
    ));
  };

  return (
    <>
      <p className={errClass}>{renderErrorMessage()}</p>

      <form className="form">
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onUpdateUserClick}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClick}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label htmlFor="username" className="form__label">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChange}
        />

        <label htmlFor="password" className="form__label">
          Password (Optional):{' '}
          <span className="nowrap">[4-12 chars include !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
        />

        <label htmlFor="passwordConfirmation" className="form__label">
          Password Confirmation:{' '}
          <span className="nowrap">[Must match password field]</span>
        </label>
        <input
          className={`form__input ${validPwdConfirmationClass}`}
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChange}
        />

        <label
          htmlFor="user-active"
          className="form__label from__checkbox-container"
        >
          ACTIVE:
          <input
            type="checkbox"
            className="form__checkbox"
            id="user-active"
            name="user-active"
            checked={active}
            onChange={onActiveChange}
          />
        </label>
        <label htmlFor="roles" className="form__label">
          Assigned Roles:
        </label>

        <select
          name="roles"
          id="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size={3}
          value={roles}
          onChange={onRolesChange}
        >
          {renderOptions()}
        </select>
      </form>
    </>
  );
};

export default EditUserForm;
