import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return (
      <Navigate
        to={user?.user?.role === 'admin' ? '/admin' : '/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
