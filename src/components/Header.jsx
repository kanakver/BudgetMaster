import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import "../ModernTheme.css";

const Header = () => {
  const location = useLocation();
  return (
    <header className="header">
      <div className="logo">
        <span>BudgetMaster</span>
      </div>
      <nav>
        <ul>
          <li className={location.pathname === "/home" ? "active" : ""}><Link to="/home">Home</Link></li>
          <li className={location.pathname === "/dashboard" ? "active" : ""}><Link to="/dashboard">Dashboard</Link></li>
          <li className={location.pathname === "/goals" ? "active" : ""}><Link to="/goals">Goals</Link></li>
          <li className={location.pathname === "/expenses" ? "active" : ""}><Link to="/expenses">Expenses</Link></li>
          <li className={location.pathname === "/income" ? "active" : ""}><Link to="/income">Income</Link></li>
          <li className={location.pathname === "/budget" ? "active" : ""}><Link to="/budget">Budget Plan</Link></li>
          <li className={location.pathname === "/profile" ? "active" : ""}><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 