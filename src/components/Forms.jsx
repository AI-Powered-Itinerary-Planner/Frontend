import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";

const Forms = () => {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    // Function to check if email exists
    const checkEmailExists = async (email) => {
        try {
            setIsCheckingEmail(true);
            const response = await fetch(`http://localhost:3001/users/check-email?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        } finally {
            setIsCheckingEmail(false);
        }
    };

    // Handle email blur to check if account exists
    const handleEmailBlur = async (e) => {
        const email = e.target.value;
        if (email && email.includes("@")) {
            const exists = await checkEmailExists(email);
            
            // If on login page and email doesn't exist
            if (isLogin && !exists) {
                toast.error("No account found with this email. Redirecting to registration.");
                setTimeout(() => navigate("/register"), 2000);
            } 
            // If on register page and email exists
            else if (!isLogin && exists) {
                toast.error("An account with this email already exists. Redirecting to login.");
                setTimeout(() => navigate("/login"), 2000);
            }
        }
    };

    const onSubmit = async (data) => {
        if (!isLogin) {
            try {
                // Check if passwords match
                if (data.password !== data.confirmpassword) {
                    return toast.error("Passwords do not match");
                }
                
                const response = await fetch('http://localhost:3001/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.username,
                        email: data.email,
                        password: data.password,
                    }),
                });
        
                const result = await response.json();
        
                if (!response.ok) {
                    toast.error(result.error || "An error occurred during registration");
                } else {
                    toast.success("User registered successfully");
                    const userData = {
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        isNewUser: true
                    };
                    
                    // Save user to context and localStorage
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', result.token);
                    
                    // Navigate to profile creation
                    navigate("/profileCreation");
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred during registration");
            }
        }
        else {
            try {
                const response = await fetch('http://localhost:3001/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                    }),
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    toast.error(result.error || "An error occurred during login");
                } else {
                    toast.success("Login successful!");
                    const userData = {
                        id: result.user.id,
                        name: result.user.name,
                        email: result.user.email,
                        age: result.user.age,
                        country: result.user.country,
                        zip_code: result.user.zip_code,
                        preferred_currency: result.user.preferred_currency,
                        interests: result.user.interests || []
                    };
                    
                    // Save user to context and localStorage
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', result.token);
                    
                    // Redirect to home
                    navigate("/home");
                }
            } catch (error) {
                console.error('Error during login:', error);
                toast.error("An error occurred while trying to log in.");
            }
        }
    };
    
    return (
        <div className="forms">
            <h1>{isLogin ? "Login" : "Register"}</h1>
            <form onSubmit={handleSubmit(onSubmit)}> 
                <input 
                    {...register("email", {
                        required: "Email is required",
                        validate: (value) => value.includes("@") || "Email must include @"
                    })} 
                    type="text" 
                    id="email" 
                    placeholder="Enter Email" 
                    onBlur={handleEmailBlur}
                />
                {errors.email && <p>{errors.email.message}</p>}
                
                <input
                    {...register("username", {
                        required: "Username is required",
                        minLength: {value: 3, message: "Username must be at least 3 characters long"},
                        maxLength: {value: 20, message: "Username must be at most 20 characters long"}
                    })} 
                    type="text" 
                    id="username" 
                    placeholder="Enter Username" 
                />
                {errors.username && <p>{errors.username.message}</p>}
                
                <input
                    {...register("password", {
                        required: "Password is required",
                        validate: (value) => value.length >= 8 || "Password must be at least 8 characters long",
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                        }
                    })} 
                    type="password" 
                    id="password" 
                    placeholder="Enter Password" 
                />
                {errors.password && <p>{errors.password.message}</p>}
                
                {!isLogin && (
                    <>
                        <input 
                            {...register("confirmpassword", {
                                required: "Confirm Password is required",
                                validate: (value) => value === getValues("password") || "Passwords do not match"
                            })}
                            type="password" 
                            placeholder="Confirm Password" 
                            id="confirmpassword" 
                        />
                        {errors.confirmpassword && <p>{errors.confirmpassword.message}</p>}
                    </>
                )}
                
                <button type="submit" disabled={isCheckingEmail}>
                    {isCheckingEmail ? "Checking..." : "Submit"}
                </button>

                {/* Google Login Button */}
                <GoogleAuth /> 

                {isLogin ? (
                    <Link to='/register'><h3>New To Voyage AI?</h3></Link>
                ) : (
                    <Link to='/login'><h3>Have An Account?</h3></Link>
                )}
            </form>
        </div>
    );
};

export default Forms;