import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const GoogleAuthSimple = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Google API script
    const loadGoogleScript = () => {
      // Check if the script is already loaded
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = initializeGoogleAuth;
    };

    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '81270836381-l781r2e2kcd5ecg9d9ae3ke51tii106c.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          ux_mode: 'popup',
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'filled_blue', 
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 250
          }
        );
      }
    };

    loadGoogleScript();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      console.log('Google Auth Response:', response);
      
      // Decode the JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      console.log('Decoded Google User Data:', decoded);
      
      // Extract relevant user data
      const userData = {
        name: decoded.name,
        email: decoded.email,
        sub: decoded.sub // Google's unique identifier for this user
      };

      // Send user data to backend
      const apiResponse = await axios.post('/api/auth/google', userData);
      
      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
      localStorage.setItem('token', response.credential);
      
      toast.success('Successfully logged in!');
      navigate('/home');
    } catch (error) {
      console.error('Error during Google authentication:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  return (
    <div>
      <div id="google-signin-button"></div>
    </div>
  );
};

export default GoogleAuthSimple;
