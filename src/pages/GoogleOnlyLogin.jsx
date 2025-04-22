import React from "react";
import { Link } from "react-router-dom";
import GoogleOnlyAuth from "../components/GoogleOnlyAuth";

const GoogleOnlyLogin = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to Voyage AI</h1>
        <p>Sign in with Google to continue</p>
        
        <div className="google-auth-wrapper">
          <GoogleOnlyAuth />
        </div>
        
        <div className="auth-info">
          <p>We only use Google for authentication. No password is stored.</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleOnlyLogin;
