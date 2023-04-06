import { Link } from 'react-router-dom';
import { useAuth } from '../../app/hooks';

const Welcome = (): JSX.Element => {
  const date = new Date();
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);

  const { username, isAdmin, isManager } = useAuth();

  return (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome {username}!</h1>
      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>
      <p>
        <Link to="/dash/notes/new">Add new techNotes</Link>
      </p>
      {(isAdmin || isManager) && (
        <>
          <p>
            <Link to="/dash/users">View User Settings</Link>
          </p>
          <p>
            <Link to="/dash/users/new">Add new User</Link>
          </p>
        </>
      )}
    </section>
  );
};

export default Welcome;
