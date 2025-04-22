import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status whenever location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    setIsAuthenticated(!!token);
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className={`navbar ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
      <div className="navbar-brand">
        <Link to={isAuthenticated ? '/home' : '/'}>
          <span className="brand-text">Voyage AI</span>
        </Link>
      </div>
      
      <div className="navbar-menu">
        {isAuthenticated ? (
          // Authenticated user navigation
          <>
            <Link to="/home" className="nav-item">Home</Link>
            <Link to="/saved-itinerary" className="nav-item">Saved Itineraries</Link>
            <Link to="/create-itinerary" className="nav-item">Create Itinerary</Link>
            <div className="nav-item user-menu">
              <span className="user-name">{user?.name || 'User'}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </>
        ) : (
          // Non-authenticated user navigation
          <>
            <Link to="/" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item">Register</Link>
          </>
        )}
      </div>
      
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }
        
        .authenticated, .unauthenticated {
          background-color: #4285f4;
        }
        
        .navbar-brand {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .brand-text {
          color: white;
          text-decoration: none;
        }
        
        .navbar-brand a {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        
        .navbar-menu {
          display: flex;
          align-items: center;
        }
        
        .nav-item {
          margin-left: 1.5rem;
          color: white;
          text-decoration: none;
          transition: opacity 0.3s;
          font-weight: 500;
        }
        
        .nav-item:hover {
          opacity: 0.8;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }
        
        .user-name {
          margin-right: 0.75rem;
          font-weight: 500;
        }
        
        .logout-button {
          background-color: #FCEABA;
          border: none;
          color: black;
          padding: 0.25rem 0.75rem;
          border-radius: 25px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 0.9rem;
          width: auto;
        }
        
        .logout-button:hover {
          background-color: #dddddd;
        }
        
        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            padding: 1rem;
          }
          
          .navbar-brand {
            margin-bottom: 1rem;
          }
          
          .navbar-menu {
            width: 100%;
            justify-content: space-around;
          }
          
          .nav-item {
            margin-left: 0;
            font-size: 0.9rem;
          }
          
          .user-menu {
            flex-direction: column;
            align-items: center;
            margin-top: 0.5rem;
            padding: 0.5rem;
          }
          
          .user-name {
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
