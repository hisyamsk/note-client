import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashLayout from './scenes/DashLayout';
import Layout from './scenes/Layout';
import Login from './features/auth/Login';
import Public from './scenes/Public';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';
import EditNote from './features/notes/EditNote';
import NewNote from './features/notes/NewNote';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />

          <Route element={<PersistLogin />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
