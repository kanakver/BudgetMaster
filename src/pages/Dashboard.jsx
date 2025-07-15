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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

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

  const expenseData = {
    labels: expenses.map(e => e.category),
    datasets: [{
      data: expenses.map(e => e.amount),
      backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350", "#26a69a"],
    }]
  };

  const incomeData = {
    labels: income.map(i => i.source),
    datasets: [{
      data: income.map(i => i.amount),
      backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350", "#26a69a"],
    }]
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalBudget = budget.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalGoals = goals.reduce((sum, g) => sum + Number(g.amount), 0);

  return (
    <div className="dashboard-grid">
      {/* Budget Plan */}
      <div className="dashboard-card">
        <h3>Budget Plan</h3>
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
        <div><b>Total Budget:</b> {totalBudget}</div>
      </div>

      {/* Expenses */}
      <div className="dashboard-card">
        <h3>Expenses</h3>
        <Doughnut data={expenseData} />
        <div style={{ marginTop: 8 }}><b>Total Expenses:</b> {totalExpenses}</div>
      </div>

      {/* Income/Salary */}
      <div className="dashboard-card">
        <h3>Income</h3>
        <Doughnut data={incomeData} />
        <div style={{ marginTop: 8 }}><b>Total Income:</b> {totalIncome}</div>
      </div>

      {/* Goals */}
      <div className="dashboard-card">
        <h3>Goals</h3>
        <ul style={{ padding: 0, listStyle: "none" }}>
          {goals.map((g, idx) => (
            <li key={idx}><b>{g.name}</b>: {g.amount}</li>
          ))}
        </ul>
        <div><b>Total Goals:</b> {totalGoals}</div>
      </div>
    </div>
  );
};

export default Dashboard; 