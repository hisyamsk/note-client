import { Outlet } from 'react-router-dom';
import DashHeader from '../components/DashHeader';
import DashFooter from '../components/DashFooter';

const DashLayout = (): JSX.Element => {
  return (
    <>
      <DashHeader />
      <div className="dash-container">
        <Outlet />
      </div>
      <DashFooter />
    </>
  );
};

export default DashLayout;
