import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/hooks';
import { Roles } from '../../interface/request.interface';

const RequireAuth = ({
  allowedRoles,
}: {
  allowedRoles: Roles[];
}): JSX.Element => {
  const location = useLocation();
  const { roles } = useAuth();

  return (
    <>
      {roles.some((role) => allowedRoles.includes(role)) ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default RequireAuth;
