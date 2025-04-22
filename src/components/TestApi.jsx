import React, { useState } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const testBackendConnection = async () => {
    try {
      setError(null);
      console.log('Testing backend connection...');
      // Try with direct URL first
      console.log('Testing with direct URL...');
      const directResponse = await axios.get('http://localhost:3001/test');
      console.log('Direct URL test response:', directResponse.data);
      setTestResult({
        method: 'Direct URL',
        data: directResponse.data
      });
      
      // Then try with proxy
      console.log('Testing with proxy...');
      const proxyResponse = await axios.get('/api/test');
      console.log('Proxy test response:', proxyResponse.data);
      setTestResult(prev => ({
        ...prev,
        proxyMethod: 'Proxy URL',
        proxyData: proxyResponse.data
      }));
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message);
      // Log more detailed error information
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
      } else if (err.request) {
        console.error("Error request:", err.request);
      }
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', margin: '20px 0' }}>
      <h3>API Connection Test</h3>
      <button 
        onClick={testBackendConnection}
        style={{ padding: '8px 16px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Test Backend Connection
      </button>
      
      {testResult && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#e6f7e6', borderRadius: '4px' }}>
          <h4>Success!</h4>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f7e6e6', borderRadius: '4px' }}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestApi;
