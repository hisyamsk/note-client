import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashLayout from './scenes/DashLayout';
import Layout from './scenes/Layout';
import Login from './scenes/Login';
import Public from './scenes/Public';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          <Route path="dash" element={<DashLayout />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
