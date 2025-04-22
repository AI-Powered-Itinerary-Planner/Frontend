import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SavedItinerary = () => {
  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      // Instead of showing error messages, just redirect silently
      navigate('/', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);
      
      // Fetch user's saved itineraries
      fetchItineraries(user.id);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const fetchItineraries = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/itineraries/user/${userId}`);
      
      if (response.data && Array.isArray(response.data)) {
        setItineraries(response.data);
      } else {
        setItineraries([]);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    try {
      await axios.delete(`http://localhost:3001/itineraries/${itineraryId}`);
      toast.success('Itinerary deleted successfully');
      
      // Refresh the list
      if (user) {
        fetchItineraries(user.id);
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete itinerary');
    }
  };

  const handleViewItinerary = (itineraryId) => {
    navigate(`/itinerary/${itineraryId}`);
  };

  const handleGoBack = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading your saved itineraries...</h2>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="saved-itineraries-container">
      <h1>Your Saved Itineraries</h1>
      
      {itineraries.length === 0 ? (
        <div className="no-itineraries">
          <p>You don't have any saved itineraries yet.</p>
          <button onClick={() => navigate('/create-itinerary')} className="create-button">
            Create New Itinerary
          </button>
        </div>
      ) : (
        <div className="itineraries-list">
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} className="itinerary-card">
              <h2>{itinerary.title || 'Untitled Itinerary'}</h2>
              <p className="destination">{itinerary.destination || 'No destination specified'}</p>
              <p className="dates">
                {itinerary.start_date && itinerary.end_date 
                  ? `${new Date(itinerary.start_date).toLocaleDateString()} - ${new Date(itinerary.end_date).toLocaleDateString()}`
                  : 'No dates specified'}
              </p>
              <div className="card-actions">
                <button 
                  onClick={() => handleViewItinerary(itinerary.id)}
                  className="view-button"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleDeleteItinerary(itinerary.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button onClick={handleGoBack} className="back-button">
        Back to Home
      </button>
      
      <style jsx>{`
        .saved-itineraries-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
        }
        
        .no-itineraries {
          text-align: center;
          padding: 2rem;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .itineraries-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .itinerary-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .itinerary-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .itinerary-card h2 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .destination {
          font-weight: bold;
          color: #4285f4;
          margin-bottom: 0.5rem;
        }
        
        .dates {
          color: #666;
          margin-bottom: 1rem;
        }
        
        .card-actions {
          display: flex;
          justify-content: space-between;
        }
        
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .view-button {
          background-color: #4285f4;
          color: white;
        }
        
        .delete-button {
          background-color: #f44336;
          color: white;
        }
        
        .create-button, .back-button {
          background-color: #4285f4;
          color: white;
          padding: 0.75rem 1.5rem;
          margin-top: 1rem;
          font-size: 1rem;
        }
        
        .back-button {
          display: block;
          margin: 2rem auto 0;
        }
        
        .loading-container {
          text-align: center;
          padding: 3rem;
        }
      `}</style>
    </div>
  );
};

export default SavedItinerary;
