import GoogleAuth from "../components/GoogleAuth";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="register">
      <div className="oauth-container">
        <h1>Create Your Account</h1>
        <p>Get started with Google</p>
        <div className="google-signin-wrapper">
          <GoogleAuth />
        </div>
        <p className="privacy-note">We only use Google for authentication.<br/>No password is stored in our database.</p>
        <Link to="/login" className="auth-link">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;