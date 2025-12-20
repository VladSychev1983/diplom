import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoutes = () => {
  const isAdmin = useSelector((state) => state.user.userData?.is_superuser);

  console.log('[AdminRoutes.jsx] isAdmin:')

  // If not authenticated, redirect to the login page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  // If authenticated, render the child routes
  return <Outlet />;
};

export default AdminRoutes;