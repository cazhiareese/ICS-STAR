import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AuthWatcher = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      // Optional: Protect private routes
      const isProtected = location.pathname.startsWith('/alumni');
      if (isProtected) {
        localStorage.setItem('lastVisitedPath', location.pathname);
        navigate('/login');
      }
    }
  }, [location]);

  return children;
};

export default AuthWatcher;
