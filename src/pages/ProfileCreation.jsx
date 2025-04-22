import React, { useContext, useEffect, useState } from 'react';
import './ProfileCreation.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";

// Travel preferences options
const travelGroups = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "business", label: "Business" },
];

const accommodationTypes = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "resort", label: "Resort" },
];

const transportTypes = [
  { value: "car", label: "Car" },
  { value: "plane", label: "Plane" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: "ship", label: "Ship" },
];

const activities = [
  { value: "sightseeing", label: "Sightseeing" },
  { value: "shopping", label: "Shopping" },
  { value: "hiking", label: "Hiking" },
  { value: "beach", label: "Beach" },
  { value: "museum", label: "Museum" },
  { value: "food", label: "Local Cuisine" },
  { value: "nightlife", label: "Nightlife" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
];

const budgetRanges = [
  { value: "economy", label: "Economy (min-$100/day)" },
  { value: "moderate", label: "Moderate ($100-$300/day)" },
  { value: "luxury", label: "Luxury ($300+/day)" },
];

const ProfileCreation = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Personal Info, 2 = Travel Preferences
  const [numPeople, setNumPeople] = useState(1);
  const [peopleAges, setPeopleAges] = useState([]);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()
  
  useEffect(() => {
    // Pre-fill form with user data if available
    console.log("User context:", user);
    if (user?.name) {
      reset({
        fullName: user.name,
        email: user.email || '',
        age: '',
        country: '',
        zipCode: '',
        preferredCurrency: '',
        preferredTravelGroup: '',
        preferredAccommodation: '',
        preferredTransport: '',
        preferredActivities: [],
        preferredBudget: '',
        specialNeeds: '',
        typicalTravelGroupSize: user.typical_travel_group_size || 1,
        travelCompanionsAges: user.travel_companions_ages || ''
      });
    } else {
      // If no user context, try to get from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          reset({
            fullName: parsedUser.name || '',
            email: parsedUser.email || '',
            age: parsedUser.age || '',
            country: parsedUser.country || '',
            zipCode: parsedUser.zip_code || '',
            preferredCurrency: parsedUser.preferred_currency || '',
            preferredTravelGroup: parsedUser.preferred_travel_group || '',
            preferredAccommodation: parsedUser.preferred_accommodation || [],
            preferredTransport: parsedUser.preferred_transport || [],
            preferredActivities: parsedUser.preferred_activities || [],
            preferredBudget: parsedUser.preferred_budget || '',
            specialNeeds: parsedUser.special_needs || '',
            typicalTravelGroupSize: parsedUser.typical_travel_group_size || 1,
            travelCompanionsAges: parsedUser.travel_companions_ages || ''
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [user, reset]);
  
  const nextStep = () => {
    setStep(2);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };
  
  const handleNumPeopleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumPeople(num);

    // Create empty fields for people ages if we don't have enough
    if (peopleAges.length < num) {
      const newAges = [...peopleAges];
      while (newAges.length < num) {
        newAges.push("");
      }
      setPeopleAges(newAges);
    }
  };

  const handleAgeChange = (index, age) => {
    const updatedAges = [...peopleAges];
    updatedAges[index] = age;
    setPeopleAges(updatedAges);
  };
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Profile Form Data:", data);
      
      // Format ages if they exist
      let travelCompanionsAges = '';
      if (peopleAges.length > 0 && peopleAges.some(age => age)) {
        travelCompanionsAges = peopleAges.filter(age => age).join(',');
      }
      
      // Gather companion interests
      const companionInterests = {};
      for (let i = 0; i < numPeople - 1; i++) {
        const interestsField = data[`companionInterests-${i}`];
        if (interestsField && interestsField.length > 0) {
          companionInterests[`companion-${i}`] = {
            age: peopleAges[i] || '',
            interests: interestsField.map(item => item.value)
          };
        }
      }
      
      // Get current user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("User information not found. Please log in again.");
        navigate('/login');
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // Format multi-select values
      const preferredAccommodation = data.preferredAccommodation ? 
        data.preferredAccommodation.map(item => item.value) : [];
        
      const preferredTransport = data.preferredTransport ? 
        data.preferredTransport.map(item => item.value) : [];
        
      const preferredActivities = data.preferredActivities ? 
        data.preferredActivities.map(item => item.value) : [];
      
      // Update user data with form values
      const updatedUser = {
        ...parsedUser,
        name: data.fullName || parsedUser.name,
        age: data.age ? parseInt(data.age, 10) : undefined,
        country: data.country || "",
        zip_code: data.zipCode || "",
        preferred_currency: data.preferredCurrency || "",
        preferred_travel_group: data.preferredTravelGroup?.value || "",
        preferred_accommodation: preferredAccommodation,
        preferred_transport: preferredTransport,
        preferred_activities: preferredActivities,
        preferred_budget: data.preferredBudget?.value || "",
        special_needs: data.specialNeeds,
        typical_travel_group_size: numPeople || 1,
        travel_companions_ages: travelCompanionsAges,
        companion_interests: companionInterests && Object.keys(companionInterests).length > 0 ? 
                            JSON.stringify(companionInterests) : ''
      };
      
      // Save updated user data to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update user context if available
      if (setUser) {
        setUser(updatedUser);
      }
      
      // Try to update backend if we have an ID
      if (parsedUser.id) {
        try {
          const response = await fetch(`http://localhost:3001/users/${parsedUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: data.fullName,
              age: data.age ? parseInt(data.age, 10) : undefined,
              country: data.country,
              zip_code: data.zipCode,
              preferred_currency: data.preferredCurrency,
              preferred_travel_group: data.preferredTravelGroup?.value,
              preferred_accommodation: preferredAccommodation,
              preferred_transport: preferredTransport,
              preferred_activities: preferredActivities,
              preferred_budget: data.preferredBudget?.value,
              special_needs: data.specialNeeds
            })
          });
          
          if (!response.ok) {
            console.warn("Backend update failed, but localStorage was updated");
          } else {
            console.log("Profile updated on backend successfully");
          }
        } catch (error) {
          console.error("Error updating profile on backend:", error);
          // Continue with localStorage update only
        }
      }
      
      toast.success("Profile created successfully!");
      navigate('/interestPage');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile information");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Creation</h2>
        <p className="profile-subtitle">Tell us about yourself to personalize your experience</p>
        <div className="step-indicator">
          <div className={`step ${step === 1 ? 'active' : ''}`}>1. Personal Info</div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>2. Travel Preferences</div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="step-content">
              <div className="input-group">
                <label htmlFor="full-name">Full Name</label>
                <input 
                  {...register("fullName", {
                    required: "Full Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })} 
                  type="text" 
                  id="full-name" 
                  placeholder='Your full name'
                />
                {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input 
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 1, message: "Age must be greater than 0" },
                    max: { value: 120, message: "Age must be less than 120" }
                  })} 
                  type="number" 
                  id="age" 
                  placeholder='Your age'
                />
                {errors.age && <p className="error-message">{errors.age.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="country">Country</label>
                <input 
                  {...register("country", { 
                    required: "Country is required" 
                  })} 
                  type="text" 
                  id="country" 
                  placeholder='Your country of residence'
                />
                {errors.country && <p className="error-message">{errors.country.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="zip-code">Zip Code</label>
                <input 
                  {...register("zipCode", { 
                    required: "Zip Code is required" 
                  })} 
                  type="text" 
                  id="zip-code" 
                  placeholder='Your zip/postal code'
                />
                {errors.zipCode && <p className="error-message">{errors.zipCode.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="preferred-currency">Preferred Currency</label>
                <select
                  {...register("preferredCurrency", { 
                    required: "Preferred Currency is required" 
                  })}
                  id="preferred-currency"
                >
                  <option value="">Select a currency</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                </select>
                {errors.preferredCurrency && <p className="error-message">{errors.preferredCurrency.message}</p>}
              </div>

              <button 
                type="button" 
                className="next-btn"
                onClick={nextStep}
              >
                Continue to Travel Preferences
              </button>
            </div>
          )}
          
          {step === 2 && (
            <div className="step-content">
              <h3>Travel Preferences</h3>
              <p className="section-subtitle">Tell us about how you like to travel</p>
              
              <div className="input-group">
                <label>Preferred Travel Group</label>
                <Controller
                  name="preferredTravelGroup"
                  control={control}
                  rules={{ required: "Please select your preferred travel group" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={travelGroups}
                      placeholder="How do you usually travel?"
                      className="react-select"
                    />
                  )}
                />
                {errors.preferredTravelGroup && <p className="error-message">{errors.preferredTravelGroup.message}</p>}
              </div>
              
              <div className="input-group">
                <label>Preferred Accommodation</label>
                <Controller
                  name="preferredAccommodation"
                  control={control}
                  rules={{ required: "Please select your preferred accommodation type(s)" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={accommodationTypes}
                      isMulti
                      placeholder="Where do you prefer to stay?"
                      className="react-select"
                    />
                  )}
                />
                {errors.preferredAccommodation && <p className="error-message">{errors.preferredAccommodation.message}</p>}
              </div>
              
              <div className="input-group">
                <label>Preferred Transportation</label>
                <Controller
                  name="preferredTransport"
                  control={control}
                  rules={{ required: "Please select your preferred transportation method(s)" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={transportTypes}
                      isMulti
                      placeholder="How do you prefer to get around?"
                      className="react-select"
                    />
                  )}
                />
                {errors.preferredTransport && <p className="error-message">{errors.preferredTransport.message}</p>}
              </div>
              
              <div className="input-group">
                <label>Preferred Activities</label>
                <Controller
                  name="preferredActivities"
                  control={control}
                  rules={{ required: "Please select your preferred activities" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={activities}
                      isMulti
                      placeholder="What activities do you enjoy?"
                      className="react-select"
                    />
                  )}
                />
                {errors.preferredActivities && <p className="error-message">{errors.preferredActivities.message}</p>}
              </div>
              
              <div className="input-group">
                <label>Preferred Budget Range</label>
                <Controller
                  name="preferredBudget"
                  control={control}
                  rules={{ required: "Please select your preferred budget range" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={budgetRanges}
                      placeholder="What's your typical travel budget?"
                      className="react-select"
                    />
                  )}
                />
                {errors.preferredBudget && <p className="error-message">{errors.preferredBudget.message}</p>}
              </div>

              <div className="input-group">
                <label>Typical Travel Group Size</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numPeople}
                  onChange={handleNumPeopleChange}
                  className="number-input"
                />
                <small>How many people usually travel with you?</small>
              </div>

              {numPeople > 1 && (
                <>
                  <div className="input-group">
                    <label>Travel Companions</label>
                    <div className="companions-container">
                      {Array.from({ length: numPeople - 1 }).map((_, index) => (
                        <div key={index} className="companion-card">
                          <h4>Travel Companion {index + 1}</h4>
                          <div className="companion-input-group">
                            <label>Age</label>
                            <input
                              type="number"
                              min="0"
                              value={peopleAges[index] || ""}
                              onChange={(e) => handleAgeChange(index, e.target.value)}
                              placeholder="Age"
                              className="age-input"
                            />
                          </div>
                          
                          {peopleAges[index] && parseInt(peopleAges[index], 10) < 18 ? (
                            <div className="companion-input-group">
                              <label>Child's Interests</label>
                              <Controller
                                name={`companionInterests-${index}`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    options={[
                                      { value: "animals", label: "Animals & Wildlife" },
                                      { value: "waterActivities", label: "Water Activities" },
                                      { value: "theme_parks", label: "Theme Parks" },
                                      { value: "museums", label: "Museums & Science" },
                                      { value: "sports", label: "Sports & Physical Activities" },
                                      { value: "arts", label: "Arts & Crafts" },
                                      { value: "nature", label: "Nature & Outdoors" },
                                      { value: "history", label: "History & Culture" }
                                    ]}
                                    isMulti
                                    placeholder="What does this child enjoy?"
                                    className="react-select"
                                  />
                                )}
                              />
                              <small>Help us suggest child-friendly activities</small>
                            </div>
                          ) : (
                            peopleAges[index] && (
                              <div className="companion-input-group">
                                <label>Companion's Interests</label>
                                <Controller
                                  name={`companionInterests-${index}`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      options={activities}
                                      isMulti
                                      placeholder="What does this person enjoy?"
                                      className="react-select"
                                    />
                                  )}
                                />
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="input-group">
                <label>Special Needs or Preferences</label>
                <textarea
                  {...register("specialNeeds")}
                  placeholder="Any dietary restrictions, accessibility needs, or other preferences?"
                  rows="3"
                  className="text-area"
                />
              </div>
              
              <div className="button-group">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={prevStep}
                >
                  Back to Personal Info
                </button>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete Profile"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
