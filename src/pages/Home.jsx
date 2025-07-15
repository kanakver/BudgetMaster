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
    <div className="modern-card" style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>Welcome to BudgetMaster</h2>
      <p style={{ fontSize: "1.1rem", marginBottom: 16 }}>
        BudgetMaster is your all-in-one personal finance tracker. Effortlessly manage your income, expenses, savings, and goals. Visualize your financial health, set targets, and stay on top of your money every month.
      </p>
      <ul style={{ marginBottom: 24 }}>
        <li>✔️ Track income, expenses, and savings by month/year</li>
        <li>✔️ Set and monitor financial goals</li>
        <li>✔️ Visual charts and tables for every section</li>
        <li>✔️ Modern, responsive, and beautiful design</li>
        <li>✔️ Dark and light mode support</li>
      </ul>
      <h3 style={{ color: "#5f4dee", marginBottom: 16 }}>This Month's Overview</h3>
      <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
      <footer style={{ marginTop: 32, color: '#5f4dee', fontWeight: 600, textAlign: 'center', width: '100%' }}>
        &copy; {new Date().getFullYear()} kanak verma
      </footer>
    </div>
  );
};

export default Home; 