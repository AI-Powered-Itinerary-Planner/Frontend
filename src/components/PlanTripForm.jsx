import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserContext } from '../Context/UserContext';
import "./Dropdown.css";

const PlanTripForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Get user preferences from profile if available
    const userProfile = user || JSON.parse(localStorage.getItem('user') || '{}');
    
    // Combine text prompt with user preferences
    const tripRequest = {
      prompt: data.tripPrompt,
      userPreferences: {
        preferredCurrency: userProfile.preferred_currency || 'USD',
        country: userProfile.country,
        interests: userProfile.interests || []
      }
    };
    
    console.log("Trip request:", tripRequest);
    
    // Simulate sending to backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Your trip plan is being generated!");
      navigate('/generateItinerary');
    }, 1500);
  };

  return (
    <div className="trip-prompt-container">
      <h1>Plan Your Trip</h1>
      
      <div className="profile-reminder">
        <p>
          Your profile preferences will be used to personalize your trip.
          {!user?.country && (
            <span className="profile-note"> Remember to complete your profile for better recommendations!</span>
          )}
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="prompt-section">
          <label htmlFor="tripPrompt">Describe your dream trip:</label>
          <textarea
            id="tripPrompt"
            {...register("tripPrompt", { 
              required: "Please describe your trip",
              minLength: { value: 20, message: "Please provide more details (at least 20 characters)" }
            })}
            placeholder="Tell us about your dream trip. For example: 'I want to spend 5 days in Tokyo, visit cultural sites, try local food, and shop in Akihabara. My budget is around $2000.'"
            rows="6"
            className="trip-prompt-input"
          />
          {errors.tripPrompt && <p className="error-message">{errors.tripPrompt.message}</p>}
        </div>
        
        <div className="prompt-tips">
          <h3>Tips for better results:</h3>
          <ul>
            <li>Mention your destination(s)</li>
            <li>Include travel dates or duration</li>
            <li>Specify travel group (solo, family, etc.)</li>
            <li>Mention budget range</li>
            <li>List preferred activities or interests</li>
            <li>Note any special requirements</li>
          </ul>
        </div>
        
        <button 
          type="submit" 
          className="generate-button"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default PlanTripForm;