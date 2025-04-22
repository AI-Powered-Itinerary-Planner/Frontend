import React, { useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";  
import { useLocation, useNavigate } from "react-router-dom";  
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

const GoogleAuth = () => {
  const navigate = useNavigate();  
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const { setUser } = useContext(UserContext); 

  const handleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    // Decode JWT to get user details
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded Google User Data:", decoded);
    console.log("User Name:", decoded.name);
    console.log("User Email:", decoded.email);
    
    try {
      const response = await fetch("http://localhost:3001/auth/google", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          sub: decoded.sub, // Google unique ID
        })
      });
  
      const data = await response.json();
      console.log("Backend Response:", data);
  
      if (data.success) {
        // Clear any existing data first to prevent old data persistence
        localStorage.clear();
        sessionStorage.clear();
        
        // Store new authentication data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Update user context
        setUser(data.user);
        
        // Check if this is a new user (no profile data)
        const isNewUser = !data.user.age && !data.user.country && !data.user.zip_code;
        
        if (isNewUser) {
          // If new user, redirect to profile creation
          toast.success("Welcome! Please complete your profile.");
          navigate("/profileCreation");
        } else {
          // If existing user, redirect to home
          toast.success(`Welcome back, ${data.user.name}!`);
          navigate("/home");
        }
      } else {
        console.error("Google authentication failed:", data.message);
        toast.error("Google authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      toast.error("Authentication error. Please try again later.");
    }
  };

  const handleFailure = () => {
    console.error("Google Login Failed");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="81270836381-l781r2e2kcd5ecg9d9ae3ke51tii106c.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
