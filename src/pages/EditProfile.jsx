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
          
          // Handle interests
          if (parsedUser.interests) {
            const interestsString = Array.isArray(parsedUser.interests) 
              ? parsedUser.interests.join(", ") 
              : typeof parsedUser.interests === 'string' 
                ? parsedUser.interests 
                : "";
            setValue("interests", interestsString);
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
          interests: data.interests ? data.interests.split(",").map(item => item.trim()) : []
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
    <div className="settings-container">
      <h2>Edit Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
              maxLength: { value: 20, message: "Username must be less than 20 characters" }
            })}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

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
          <label htmlFor="interests">Interests (comma separated)</label>
          <input
            id="interests"
            type="text"
            {...register("interests")}
            placeholder="Travel, Photography, Hiking, etc."
          />
          <p className="field-note">Separate multiple interests with commas</p>
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
