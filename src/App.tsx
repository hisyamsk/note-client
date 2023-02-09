import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './scenes/Layout';
import Public from './scenes/Public';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Public />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
