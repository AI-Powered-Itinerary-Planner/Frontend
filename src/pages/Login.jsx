import { useLocation } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";

const Login = () => {
  return (
    <div className="login">
      <div className="oauth-container">
        <h1>Login</h1>
        <p>Continue with Google to access your account</p>
        <div className="google-signin-wrapper">
          <GoogleAuth />
        </div>
        <p className="privacy-note">We only use Google for authentication.<br/>No password is stored in our database.</p>
      </div>
    </div>
  );
}

export default Login;