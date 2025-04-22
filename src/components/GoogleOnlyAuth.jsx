import React, { useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";  
import { useNavigate } from "react-router-dom";  
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

const GoogleOnlyAuth = () => {
  const navigate = useNavigate();  
  const { setUser } = useContext(UserContext); 

  const handleSuccess = async (credentialResponse) => {
    console.log("Google Login Success");

    try {
      // Instead of sending decoded user data, send the ID token directly
      // The backend will verify it with Google
      const response = await fetch("http://localhost:3001/auth/google", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_token: credentialResponse.credential
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store authentication data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Update user context
        setUser(data.user);
        
        // Check if this is a new user
        const isNewUser = !data.user.country;
        
        if (isNewUser) {
          toast.success("Welcome! Please complete your profile.");
          navigate("/profileCreation");
        } else {
          toast.success(`Welcome back, ${data.user.name}!`);
          navigate("/home");
        }
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication error. Please try again later.");
    }
  };

  const handleFailure = () => {
    toast.error("Google sign-in failed. Please try again.");
  };

  return (
    <div className="google-signin-container">
      <GoogleOAuthProvider clientId="81270836381-l781r2e2kcd5ecg9d9ae3ke51tii106c.apps.googleusercontent.com">
        <GoogleLogin 
          onSuccess={handleSuccess} 
          onError={handleFailure}
          text="signin_with"
          shape="rectangular"
          size="large"
          theme="filled_blue"
          logo_alignment="center"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleOnlyAuth;
