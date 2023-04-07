import { useState, useEffect } from 'react';
import { useAddNewUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ROLES, USER_REGEX, PW_REGEX } from '../../constants';
import { Roles } from '../../interface/request.interface';
import ErrorMessage from '../../components/ErrorMessage';

const NewUserForm = (): JSX.Element => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordConfirmation, setPasswordConfrimation] = useState<string>('');
  const [validPasswordConfirmation, setValidPasswordConfirmation] =
    useState<boolean>(false);
  const [roles, setRoles] = useState<Roles[]>(['Employee']);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PW_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidPasswordConfirmation(passwordConfirmation === password);
  }, [passwordConfirmation, password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername('');
      setPassword('');
      setPasswordConfrimation('');
      setRoles(['Employee']);
      navigate('/dash/users');
    }
  }, [isSuccess, navigate]);

  const canSave =
    [
      roles.length,
      validUsername,
      validPassword,
      validPasswordConfirmation,
    ].every(Boolean) && !isLoading;
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
  const validPwdConfirmationClass =
    !validPasswordConfirmation || !validPassword
      ? 'form__input--incomplete'
      : '';
  const validRolesClass = !Boolean(roles.length)
    ? 'form__input--incomplete'
    : '';

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) =>
    setUsername(e.currentTarget.value);

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onPasswordConfirmationChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    setPasswordConfrimation(e.currentTarget.value);
  };

  const onRolesChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.currentTarget.selectedOptions,
      (option) => option.value
    ) as Roles[];
    setRoles(values);
  };

  const onSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
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
      <ErrorMessage isError={isError} error={error} />

      <form className="form" onSubmit={onSaveClick}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
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
          Password: <span className="nowrap">[4-12 chars include !@#$%]</span>
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

export default NewUserForm;
