import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./EditProfile.css"; // Using our new CSS file

const EditProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // First check sessionStorage for data passed from Settings page
        const editData = sessionStorage.getItem("editUserData");
        
        // Then check localStorage as fallback
        const storedUser = localStorage.getItem("user");
        
        if (!editData && !storedUser) {
          toast.error("You must be logged in to edit your profile");
          navigate("/login");
          return;
        }

        let parsedUser = null;
        
        // Prioritize data from sessionStorage (passed from Settings)
        if (editData) {
          try {
            parsedUser = JSON.parse(editData);
            console.log("User data from sessionStorage:", parsedUser);
            // Clear sessionStorage after retrieving the data
            sessionStorage.removeItem("editUserData");
          } catch (error) {
            console.error("Error parsing sessionStorage data:", error);
          }
        }
        
        // If no data from sessionStorage or parsing failed, try localStorage
        if (!parsedUser && storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
            console.log("User data from localStorage:", parsedUser);
          } catch (error) {
            console.error("Error parsing localStorage data:", error);
          }
        }
        
        if (parsedUser) {
          // Set the user data
          setUserData(parsedUser);
          
          // Pre-fill form with user data
          setValue("name", parsedUser.name || "");
          setValue("email", parsedUser.email || "");
          setValue("age", parsedUser.age || "");
          setValue("country", parsedUser.country || "");
          setValue("zip_code", parsedUser.zip_code || "");
          setValue("preferred_currency", parsedUser.preferred_currency || "");
          setValue("preferred_travel_group", parsedUser.preferred_travel_group || "");
          setValue("preferred_budget_range", parsedUser.preferred_budget_range || "");
          setValue("typical_travel_group_size", parsedUser.typical_travel_group_size || "");
          setValue("special_needs", parsedUser.special_needs || "");
          
          // Handle interests
          if (parsedUser.interests) {
            const interestsString = Array.isArray(parsedUser.interests) 
              ? parsedUser.interests.join(", ") 
              : typeof parsedUser.interests === 'string' 
                ? parsedUser.interests 
                : "";
            setValue("interests", interestsString);
          }
          
          // Handle preferred accommodation
          if (parsedUser.preferred_accommodation) {
            const accommodationString = Array.isArray(parsedUser.preferred_accommodation) 
              ? parsedUser.preferred_accommodation.join(", ") 
              : typeof parsedUser.preferred_accommodation === 'string' 
                ? parsedUser.preferred_accommodation 
                : "";
            setValue("preferred_accommodation", accommodationString);
          }
          
          // Handle preferred transportation
          if (parsedUser.preferred_transportation) {
            const transportationString = Array.isArray(parsedUser.preferred_transportation) 
              ? parsedUser.preferred_transportation.join(", ") 
              : typeof parsedUser.preferred_transportation === 'string' 
                ? parsedUser.preferred_transportation 
                : "";
            setValue("preferred_transportation", transportationString);
          }
          
          // Handle preferred activities
          if (parsedUser.preferred_activities) {
            const activitiesString = Array.isArray(parsedUser.preferred_activities) 
              ? parsedUser.preferred_activities.join(", ") 
              : typeof parsedUser.preferred_activities === 'string' 
                ? parsedUser.preferred_activities 
                : "";
            setValue("preferred_activities", activitiesString);
          }
        } else {
          toast.error("Could not load user data");
          navigate("/settings");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
        navigate("/settings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Get user from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("You must be logged in to update your profile");
        navigate("/login");
        return;
      }
      
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Create updated user data
        const updatedUser = {
          ...parsedUser,
          name: data.name,
          age: data.age ? parseInt(data.age, 10) : undefined,
          country: data.country || "",
          zip_code: data.zip_code || "",
          preferred_currency: data.preferred_currency || "",
          preferred_travel_group: data.preferred_travel_group || "",
          preferred_budget_range: data.preferred_budget_range || "",
          typical_travel_group_size: data.typical_travel_group_size ? parseInt(data.typical_travel_group_size, 10) : undefined,
          special_needs: data.special_needs || "",
          interests: data.interests ? data.interests.split(",").map(item => item.trim()) : [],
          preferred_accommodation: data.preferred_accommodation ? data.preferred_accommodation.split(",").map(item => item.trim()) : [],
          preferred_transportation: data.preferred_transportation ? data.preferred_transportation.split(",").map(item => item.trim()) : [],
          preferred_activities: data.preferred_activities ? data.preferred_activities.split(",").map(item => item.trim()) : []
        };
        
        // Remove undefined values
        Object.keys(updatedUser).forEach(key => 
          updatedUser[key] === undefined && delete updatedUser[key]
        );
        
        console.log("Updating user data in localStorage:", updatedUser);
        
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        toast.success("Profile updated successfully");
        navigate("/settings");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="settings-container" id="edit-profile-container">
      <h2>Edit Profile</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            disabled // Email cannot be changed
            className="disabled-input"
          />
          <p className="field-note">Email cannot be changed</p>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" },
              maxLength: { value: 20, message: "Name must be less than 20 characters" }
            })}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            {...register("age", {
              min: { value: 1, message: "Age must be greater than 0" },
              max: { value: 120, message: "Age must be less than 120" }
            })}
            placeholder="Your age"
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            {...register("country")}
            placeholder="Your country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="zip_code">Zip Code</label>
          <input
            id="zip_code"
            type="text"
            {...register("zip_code")}
            placeholder="Your zip code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferred_currency">Preferred Currency</label>
          <select
            id="preferred_currency"
            {...register("preferred_currency")}
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
        </div>

        <div className="form-group">
          <label htmlFor="preferred_travel_group">Preferred Travel Group</label>
          <select
            id="preferred_travel_group"
            {...register("preferred_travel_group")}
          >
            <option value="">Select a travel group</option>
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_budget_range">Preferred Budget Range</label>
          <select
            id="preferred_budget_range"
            {...register("preferred_budget_range")}
          >
            <option value="">Select a budget range</option>
            <option value="economy">Economy (min-$100/day)</option>
            <option value="moderate">Moderate ($100-$300/day)</option>
            <option value="luxury">Luxury ($300+/day)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_accommodation">Preferred Accommodation (comma separated)</label>
          <input
            id="preferred_accommodation"
            type="text"
            {...register("preferred_accommodation")}
            placeholder="Nightlife, Food, Nature, etc."
          />
          <p className="field-note">Separate multiple preferred accommodation with commas</p>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_transportation">Preferred Transportation (comma separated)</label>
          <input
            id="preferred_transportation"
            type="text"
            {...register("preferred_transportation")}
            placeholder="Train, Plane, Car, etc."
          />
          <p className="field-note">Separate multiple preferred transportation with commas</p>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_activities">Preferred Activities (comma separated)</label>
          <input
            id="preferred_activities"
            type="text"
            {...register("preferred_activities")}
            placeholder="Nightlife, Food, Nature, etc."
          />
          <p className="field-note">Separate multiple preferred activities with commas</p>
        </div>

        <div className="form-group">
          <label htmlFor="typical_travel_group_size">Typical Travel Group Size</label>
          <input
            id="typical_travel_group_size"
            type="number"
            {...register("typical_travel_group_size", {
              min: { value: 1, message: "Typical travel group size must be greater than 0" }
            })}
            placeholder="Your typical travel group size"
          />
          {errors.typical_travel_group_size && <p className="error-message">{errors.typical_travel_group_size.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="interests">Interests (comma separated)</label>
          <input
            id="interests"
            type="text"
            {...register("interests")}
            placeholder="Travel, Photography, Hiking, etc."
          />
          <p className="field-note">Separate multiple interests with commas</p>
        </div>

        <div className="form-group">
          <label htmlFor="special_needs">Special Needs or Preferences</label>
          <textarea
            id="special_needs"
            type="text"
            {...register("special_needs")}
            placeholder="Any dietary restrictions, accessibility needs, or other preferences?"
            rows="3"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate("/settings")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
