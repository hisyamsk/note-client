import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAppDispatch, usePersist } from '../../app/hooks';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import ErrorMessage from '../../components/ErrorMessage';

const Login = (): JSX.Element => {
  const errorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [persist, setPersist] = usePersist();

  const [login, { isLoading, error, isError }] = useLoginMutation();

  const onUsernameChanged = (e: React.FormEvent<HTMLInputElement>) =>
    setUsername(e.currentTarget.value);
  const onPasswordChanged = (e: React.FormEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);
  const onToggleChaged = () => setPersist((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      console.log(err);
      errorRef.current?.focus();
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>

      <main className="login">
        <p ref={errorRef} className="errmsg" aria-live="assertive">
          <ErrorMessage isError={isError} error={error} />
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            className="form__input"
            id="username"
            value={username}
            onChange={onUsernameChanged}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password: </label>
          <input
            type="password"
            className="form__input"
            id="password"
            value={password}
            onChange={onPasswordChanged}
            autoComplete="current-password"
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={onToggleChaged}
              checked={persist}
            />
            Perist Login
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
};

export default Login;
