import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./ModernPage.css";

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="modern-card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Profile</h2>
      {user ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <b>Email:</b> {user.email}
          </div>
          {user.displayName && (
            <div style={{ marginBottom: 16 }}>
              <b>Name:</b> {user.displayName}
            </div>
          )}
          {user.photoURL && (
            <div style={{ marginBottom: 16 }}>
              <img src={user.photoURL} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%" }} />
            </div>
          )}
          <div style={{ margin: "1.5em 0" }}>
            <label style={{ fontWeight: 600, color: "#5f4dee" }}>Theme: </label>
            <button
              className="modern-form-button"
              style={{ marginLeft: 8, background: theme === "dark" ? "#2D0140" : "#f0f3fa", color: theme === "dark" ? "#fff" : "#222" }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
          <button className="modern-delete" onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Not signed in.</p>
      )}
      <footer style={{ marginTop: 24, color: '#5f4dee', fontWeight: 600, textAlign: 'center', width: '100%' }}>
        &copy; {new Date().getFullYear()} kanak verma
      </footer>
    </div>
  );
};

export default Profile; 