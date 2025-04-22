import React, { useState, useEffect, useContext } from 'react';
import './InterestScreen.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from '../Context/UserContext';

export default function InterestPage() {
  const categories = {
    Music: ["Pop", "R&B", "Country Music", "Rock", "Jazz", "Rap"],
    Adventure: ["Hiking", "Off Roading", "Kayaking", "Biking", "Skiing", "Camping"],
    Nightlife: ["Bars", "Live Music", "Clubs"],
    "Social & Community": ["Art", "Local Food", "Boba Shop"],
  };

  const { user, setUser } = useContext(UserContext);
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const navigate = useNavigate();

  // Load previously saved interests if they exist
  useEffect(() => {
    if (user && user.interests && Array.isArray(user.interests)) {
      setSelectedInterests(new Set(user.interests));
    }
  }, [user]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interest)) {
        newSet.delete(interest);
      } else {
        newSet.add(interest);
      }
      return newSet;
    });
  };

  const saveInterests = async () => {
    try {
      // Convert Set to Array for storage
      const interestsArray = Array.from(selectedInterests);
      
      // Update user in context
      if (user) {
        const updatedUser = { ...user, interests: interestsArray };
        setUser(updatedUser);
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Try to update on backend if we have a token
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (updatedUser.id) {
          try {
            const response = await fetch(`http://localhost:3001/users/${updatedUser.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                interests: interestsArray.join(', ')
              })
            });
            
          } catch (error) {
            console.error("Error updating profile on backend:", error);
            // Continue with localStorage update only
          }
        }
        
        toast.success('Your interests have been saved!');
        navigate('/home');
      } else {
        toast.error('Please log in to save your interests');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error saving interests:', error);
      toast.error('Failed to save interests. Please try again.');
    }
  };

  return (
    <div className="interest-page">
      <h1 className="title">Choose Your Interest!</h1>
      {Object.entries(categories).map(([category, interests]) => (
        <div key={category} className="interest-container">
          <h2 className="category-title">{category}</h2>
          <div className="interest-grid">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`interest-button ${selectedInterests.has(interest) ? "selected" : ""}`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="done-button" onClick={saveInterests}>Save Interests</button>
    </div>
  );
}
