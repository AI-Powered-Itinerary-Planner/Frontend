import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";


const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const isLoggedIn = !!user;
  const isRegister = user?.isNewUser;

  useEffect(() => {
    if (!isLoggedIn) {
      // Optionally redirect or show guest options
      console.log("No user logged in");
    }
  }, [user]);

  return (
    <div>
      {!isLoggedIn ? (
        <>
          <h1>Welcome! Please login or register to get started</h1>
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      ) : isRegister ? (
        <h1>
          Welcome {user.name}! Let's get started on your first adventure!
        </h1>
      ) : (
        <h1>Welcome back, {user.name}!</h1>
      )}

      {isLoggedIn && (
        <>
          <button onClick={() => navigate("/explore")}>Explore</button>
          <button onClick={() => navigate("/plantrip")}>Plan Trip</button>
          <button onClick={() => navigate("/saveditineraries")}>Saved Itineraries</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
        </>
      )}
    </div>
  );
};

export default Home;