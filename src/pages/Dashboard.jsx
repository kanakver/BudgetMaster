import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "./Dashboard.css";
import "./ModernPage.css";
import "../ModernTheme.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const iconStyles = {
  fontSize: 32,
  marginRight: 10,
  verticalAlign: "middle",
};

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budget, setBudget] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setExpenses((await getDocs(collection(db, "expenses"))).docs.map(doc => doc.data()));
      setIncome((await getDocs(collection(db, "income"))).docs.map(doc => doc.data()));
      setBudget((await getDocs(collection(db, "budget"))).docs.map(doc => doc.data()));
      setGoals((await getDocs(collection(db, "goals"))).docs.map(doc => doc.data()));
    };
    fetchData();
  }, []);

  // Vibrant chart colors
  const chartColors = [
    "#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350", "#26a69a", "#f06292", "#ffd54f", "#8d6e63", "#00bcd4"
  ];

  const expenseData = {
    labels: expenses.map(e => e.category),
    datasets: [{
      data: expenses.map(e => e.amount),
      backgroundColor: chartColors,
    }]
  };

  const incomeData = {
    labels: income.map(i => i.source),
    datasets: [{
      data: income.map(i => i.amount),
      backgroundColor: chartColors,
    }]
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalBudget = budget.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalGoals = goals.reduce((sum, g) => sum + Number(g.amount), 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f3fa 0%, #b1c9ef 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
        <section style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#5f4dee", marginBottom: 8 }}>Dashboard</h1>
          <p style={{ fontSize: "1.2rem", color: "#395886", marginBottom: 0 }}>
            Get a quick overview of your finances at a glance
          </p>
        </section>
        <div className="dashboard-grid" style={{ gap: "2.5rem" }}>
          {/* Budget Plan */}
          <div className="dashboard-card" style={{ boxShadow: "0 2px 16px rgba(95,77,222,0.08)", background: "linear-gradient(135deg, #fff 60%, #b1c9ef 100%)" }}>
            <h3><span role="img" aria-label="budget" style={iconStyles}>💸</span>Budget Plan</h3>
            <table style={{ width: "100%", marginBottom: 8 }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((b, idx) => (
                  <tr key={idx}>
                    <td>{b.category}</td>
                    <td>{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontWeight: 600, color: "#5f4dee" }}><b>Total Budget:</b> {totalBudget}</div>
          </div>

          {/* Expenses */}
          <div className="dashboard-card" style={{ boxShadow: "0 2px 16px rgba(239,83,80,0.08)", background: "linear-gradient(135deg, #fff 60%, #ef5350 100%)" }}>
            <h3><span role="img" aria-label="expenses" style={iconStyles}>🛒</span>Expenses</h3>
            <Doughnut data={expenseData} />
            <div style={{ marginTop: 8, fontWeight: 600, color: "#ef5350" }}><b>Total Expenses:</b> {totalExpenses}</div>
          </div>

          {/* Income/Salary */}
          <div className="dashboard-card" style={{ boxShadow: "0 2px 16px rgba(95,77,222,0.08)", background: "linear-gradient(135deg, #fff 60%, #42a5f5 100%)" }}>
            <h3><span role="img" aria-label="income" style={iconStyles}>💰</span>Income</h3>
            <Doughnut data={incomeData} />
            <div style={{ marginTop: 8, fontWeight: 600, color: "#42a5f5" }}><b>Total Income:</b> {totalIncome}</div>
          </div>

          {/* Goals */}
          <div className="dashboard-card" style={{ boxShadow: "0 2px 16px rgba(102,2,115,0.08)", background: "linear-gradient(135deg, #fff 60%, #A305A6 100%)" }}>
            <h3><span role="img" aria-label="goals" style={iconStyles}>🎯</span>Goals</h3>
            <ul style={{ padding: 0, listStyle: "none", marginBottom: 12 }}>
              {goals.map((g, idx) => (
                <li key={idx} style={{ fontWeight: 500, color: "#A305A6" }}><b>{g.name}</b>: {g.amount}</li>
              ))}
            </ul>
            <div style={{ fontWeight: 600, color: "#A305A6" }}><b>Total Goals:</b> {totalGoals}</div>
          </div>
        </div>
        <footer style={{ marginTop: 40, color: '#5f4dee', fontWeight: 600, textAlign: 'center', width: '100%' }}>
          &copy; {new Date().getFullYear()} kanak verma
        </footer>
      </div>
    </div>
  );
};

export default Dashboard; 