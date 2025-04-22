import React, { useEffect } from 'react';

const GoogleAuthTest = () => {
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
          callback: (response) => {
            console.log('Google Auth Response:', response);
            alert('Authentication successful! Check console for details.');
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-test-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: 250
          }
        );
      }
    };

    loadGoogleScript();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px 0' }}>
      <h3>Simple Google Auth Test</h3>
      <p>This is a minimal implementation to test Google OAuth configuration.</p>
      <div id="google-test-button"></div>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        If this works but your main implementation doesn't, the issue is with your implementation, not the Google Cloud configuration.
      </p>
    </div>
  );
};

export default GoogleAuthTest;
