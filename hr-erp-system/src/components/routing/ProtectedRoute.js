import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../Loading';

const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;