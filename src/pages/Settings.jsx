import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    country: "",
    zip_code: "",
    preferred_currency: "",
    interests: []
  });
  const [language, setLanguage] = useState("English");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Debug function to show all localStorage data
    const debugLocalStorage = () => {
      let debug = "localStorage contents:\n";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);
        try {
          // Try to parse JSON values for better display
          const parsed = JSON.parse(value);
          value = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // If not JSON, keep as is
        }
        debug += `${key}: ${value}\n`;
      }
      return debug;
    };

    // Fetch user data from localStorage or API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Debug all localStorage
        const debugData = debugLocalStorage();
        console.log("DEBUG LOCALSTORAGE:", debugData);
        setDebugInfo(debugData);
        
        // First try to get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log("User data from localStorage:", parsedUser);
            
            // Update state with user data
            setUserData({
              name: parsedUser.name || "",
              email: parsedUser.email || "",
              age: parsedUser.age || "",
              country: parsedUser.country || "",
              zip_code: parsedUser.zip_code || "",
              preferred_currency: parsedUser.preferred_currency || "",
              interests: parsedUser.interests || []
            });
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
          }
        } else {
          // If no user data in localStorage, redirect to login
          toast.error("Please log in to view settings");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear user context
    setUser(null);
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to login page instead of home
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      // Get user ID and token
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (storedUser.id) {
        // Call backend to delete the user account
        const response = await fetch(`http://localhost:3001/users/${storedUser.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok && response.status !== 204) {
          console.error("Server responded with status:", response.status);
          throw new Error('Failed to delete account on server');
        }
      }
      
      // Clear ALL localStorage even if the backend call fails
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear user context
      setUser(null);
      
      // Show success message
      toast.success("Account deleted successfully");
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      
      // Even if there's an error with the server, still clear local data and log out
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      
      // Show a warning message but still redirect
      toast.error("There was an issue deleting your account on the server, but you've been logged out.");
      navigate("/login");
    }
  };

  const handleEditProfile = () => {
    // Store current user data in sessionStorage for the edit form
    if (userData) {
      sessionStorage.setItem("editUserData", JSON.stringify(userData));
    }
    navigate("/edit-username");
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="settings-container">
      {/* Debug Info (hidden) */}
      {debugInfo && (
        <div className="debug-info" style={{ display: 'none' }}>
          <pre>{debugInfo}</pre>
        </div>
      )}
      
      {/* Profile Circle */}
      <div className="profile-circle">
        {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
      </div>

      {/* Username */}
      <h2 className="username">{userData.name || "User"}</h2>
      <p className="email">{userData.email || "No email provided"}</p>

      {/* Profile Information */}
      <div className="profile-info">
        {userData.age && <p><strong>Age:</strong> {userData.age}</p>}
        {userData.country && <p><strong>Country:</strong> {userData.country}</p>}
        {userData.zip_code && <p><strong>Zip Code:</strong> {userData.zip_code}</p>}
        {userData.preferred_currency && <p><strong>Preferred Currency:</strong> {userData.preferred_currency}</p>}
        {userData.interests && userData.interests.length > 0 && (
          <p><strong>Interests:</strong> {Array.isArray(userData.interests) ? userData.interests.join(", ") : userData.interests}</p>
        )}
      </div>

      {/* Edit Profile Button */}
      <button className="edit-btn" onClick={handleEditProfile}>
        Edit Profile
      </button>

      {/* Language Preferences */}
      <div className="language-container">
        <h3>Language Preferences</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={() => setShowLogoutDialog(true)}>
        Logout
      </button>

      {/* Delete Account Button */}
      <button className="delete-btn" onClick={() => setShowDeleteDialog(true)}>
        Delete Account
      </button>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="dialog">
          <p>Are you sure you want to logout?</p>
          <button onClick={() => setShowLogoutDialog(false)}>No</button>
          <button onClick={() => {
            setShowLogoutDialog(false);
            handleLogout();
          }}>Yes</button>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button onClick={() => setShowDeleteDialog(false)}>No</button>
          <button onClick={() => {
            setShowDeleteDialog(false);
            handleDeleteAccount();
          }}>Yes</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
