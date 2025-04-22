import { useState, useContext, useEffect } from 'react'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import "./Navbar.css"
import { UserContext } from '../Context/UserContext'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    useEffect(() => {
        // Update authentication state when user context changes
        setIsLoggedIn(!!user)
    }, [user])

    const closeMenu = () => setMenuOpen(false)
    
    return (
        <nav>
            <Link to="/" className="title">AI-POWERED ITINERARY</Link>
            <div className="menu" onClick={() => {
                setMenuOpen(!menuOpen)
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
                <li><NavLink to="/home" onClick={closeMenu}>Home</NavLink></li>
                
                {isLoggedIn ? (
                    // Navigation links for authenticated users
                    <>
                        <li><NavLink to="/interestPage" onClick={closeMenu}>Interests</NavLink></li>
                        <li><NavLink to="/explore" onClick={closeMenu}>Explore</NavLink></li>
                        <li><NavLink to="/plantrip" onClick={closeMenu}>Plan Trip</NavLink></li>
                        <li><NavLink to="/saved-itineary" onClick={closeMenu}>Saved Itineraries</NavLink></li>
                        <li><NavLink to="/settings" onClick={closeMenu}>Settings</NavLink></li>
                    </>
                ) : (
                    // Navigation links for non-authenticated users
                    <>
                        <li><NavLink to="/register" onClick={closeMenu}>Register</NavLink></li>
                        <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar
