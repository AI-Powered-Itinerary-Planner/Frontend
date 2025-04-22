import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      // Instead of showing multiple error messages, just redirect silently
      navigate('/', { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  const navigateToSavedItineraries = () => {
    navigate('/saved-itinerary');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="home-container">
      <h1>Welcome, {user.name}!</h1>
      <p>You are now logged in with Google.</p>
      
      <div className="navigation-cards">
        <div className="nav-card" onClick={navigateToSavedItineraries}>
          <h3>Saved Itineraries</h3>
          <p>View and manage your travel plans</p>
        </div>
        
        <div className="nav-card" onClick={() => navigate('/create-itinerary')}>
          <h3>Create New Itinerary</h3>
          <p>Plan your next adventure</p>
        </div>
      </div>
      
      <div className="user-info">
        <h2>Your Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Authentication Provider:</strong> {user.auth_provider}</p>
      </div>
      
      <button 
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </button>
      
      <style jsx>{`
        .home-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        
        .navigation-cards {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
        }
        
        .nav-card {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 1.5rem;
          width: 250px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .nav-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .nav-card h3 {
          margin-top: 0;
          color: #4285f4;
        }
        
        .user-info {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }
        
        .logout-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .logout-button:hover {
          background-color: #d32f2f;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Home;
