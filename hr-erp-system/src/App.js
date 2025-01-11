// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicRoute from './components/routing/PublicRoute';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import NotFound from './pages/NotFound';
import PersonalDetails from './pages/EmployeeDashboard/PersonalDetails';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import HRLandingPage from './pages/HRLandingPage';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes - Accessible only when not logged in */}
        <Route element={<PublicRoute />}>
          <Route path='/' element={<HRLandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        {/* Protected Routes - Requires authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<EmployeeDashboard />} />
          <Route path='/profile' element={<PersonalDetails />} />
        </Route>

        {/* Admin Routes - Requires admin role */}
        <Route element={<ProtectedRoute />}>
          <Route
            path='/admin/*'
            element={
              user?.user?.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to='/dashboard' replace />
              )
            }
          />
        </Route>

        {/* Root redirect */}
        <Route
          path='/'
          element={
            <Navigate
              to={
                user
                  ? user?.role === 'admin'
                    ? '/admin'
                    : '/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />

        {/* 404 Page */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
