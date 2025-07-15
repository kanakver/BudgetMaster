import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import "./ModernPage.css";
import "../ModernTheme.css";

const Home = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const month = dayjs().month() + 1;
      const year = dayjs().year();
      const incomeSnap = await getDocs(collection(db, "income"));
      const expenseSnap = await getDocs(collection(db, "expenses"));
      const totalIncome = incomeSnap.docs
        .map(doc => doc.data())
        .filter(i => {
          if (!i.date) return false;
          const d = dayjs(i.date);
          return d.month() + 1 === month && d.year() === year;
        })
        .reduce((sum, i) => sum + Number(i.amount), 0);
      const totalExpenses = expenseSnap.docs
        .map(doc => doc.data())
        .filter(e => {
          if (!e.date) return false;
          const d = dayjs(e.date);
          return d.month() + 1 === month && d.year() === year;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setLoading(false);
    };
    fetchData();
  }, []);

  const remaining = income - expenses;

  const chartData = {
    labels: ["Income", "Expenses", "Remaining"],
    datasets: [
      {
        label: "Amount",
        data: [income, expenses, remaining],
        backgroundColor: ["#5f4dee", "#ef5350", "#66bb6a"],
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f3fa 0%, #b1c9ef 100%)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <section style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#5f4dee", marginBottom: 8 }}>BudgetMaster</h1>
          <p style={{ fontSize: "1.3rem", color: "#395886", marginBottom: 16 }}>
            Your all-in-one personal finance tracker
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(95,77,222,0.08)", minWidth: 180 }}>
              <span role="img" aria-label="income" style={{ fontSize: 32 }}>💰</span>
              <div style={{ fontWeight: 700, color: "#5f4dee", fontSize: 18 }}>Track Income</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(95,77,222,0.08)", minWidth: 180 }}>
              <span role="img" aria-label="expenses" style={{ fontSize: 32 }}>🛒</span>
              <div style={{ fontWeight: 700, color: "#ef5350", fontSize: 18 }}>Track Expenses</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(95,77,222,0.08)", minWidth: 180 }}>
              <span role="img" aria-label="goals" style={{ fontSize: 32 }}>🎯</span>
              <div style={{ fontWeight: 700, color: "#66bb6a", fontSize: 18 }}>Set Goals</div>
            </div>
          </div>
          <p style={{ fontSize: "1.1rem", color: "#395886", marginBottom: 0 }}>
            Visualize your financial health, set targets, and stay on top of your money every month.
          </p>
        </section>
        <section style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(95,77,222,0.08)", padding: 32, marginBottom: 32 }}>
          <h3 style={{ color: "#5f4dee", marginBottom: 16, textAlign: "center" }}>This Month's Overview</h3>
          <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "#5f4dee", fontSize: 20 }}>Income</div>
              <div style={{ fontSize: 22 }}>{income}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "#ef5350", fontSize: 20 }}>Expenses</div>
              <div style={{ fontSize: 22 }}>{expenses}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "#66bb6a", fontSize: 20 }}>Remaining</div>
              <div style={{ fontSize: 22 }}>{remaining}</div>
            </div>
          </div>
        </section>
        <footer style={{ marginTop: 32, color: '#5f4dee', fontWeight: 600, textAlign: 'center', width: '100%' }}>
          &copy; {new Date().getFullYear()} kanak verma
        </footer>
      </div>
    </div>
  );
};

export default Home; 