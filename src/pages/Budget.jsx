import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Bar, Doughnut } from "react-chartjs-2";
import dayjs from "dayjs";
import "./ModernPage.css";

const budgetCategories = ["Rent", "Utilities", "Subscriptions", "Groceries", "Transport", "Other"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i);

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState(budgetCategories[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM"));
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);

  const fetchBudgets = async (month, year) => {
    setLoading(true);
    const snap = await getDocs(collection(db, "budget"));
    const filtered = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(b => {
        if (!b.date) return false;
        const d = dayjs(b.date);
        return d.month() + 1 === month && d.year() === year;
      });
    setBudgets(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount || !date) return;
    await addDoc(collection(db, "budget"), {
      category,
      amount: Number(amount),
      date: dayjs(date).toISOString(),
    });
    setAmount("");
    fetchBudgets(selectedMonth, selectedYear);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "budget", id));
    fetchBudgets(selectedMonth, selectedYear);
  };

  // Chart data
  const barData = {
    labels: budgetCategories,
    datasets: [{
      label: "Budget Allocation",
      data: budgetCategories.map(cat => {
        return budgets.filter(b => b.category === cat).reduce((sum, b) => sum + Number(b.amount), 0);
      }),
      backgroundColor: "#5f4dee",
    }]
  };
  const pieData = {
    labels: budgetCategories,
    datasets: [{
      data: budgetCategories.map(cat => {
        return budgets.filter(b => b.category === cat).reduce((sum, b) => sum + Number(b.amount), 0);
      }),
      backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350", "#26a69a"],
    }]
  };
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <div className="modern-page-grid">
      {/* Form + Table */}
      <div className="modern-card">
        <h2>Add New Budget Item</h2>
        <form onSubmit={handleAddBudget} className="modern-form">
          <div>
            <label>Category:</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {budgetCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Amount" />
          </div>
          <div>
            <label>Month/Year:</label>
            <input type="month" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <button type="submit">Add Budget</button>
        </form>
        <div className="modern-table-controls">
          <label>Show for: </label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {months.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="modern-table-summary">
          <b>Total Budget:</b> {totalBudget}
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(b => (
              <tr key={b.id}>
                <td>{b.category}</td>
                <td>{b.amount}</td>
                <td>{dayjs(b.date).format("MMM YYYY")}</td>
                <td><button className="modern-delete" onClick={() => handleDelete(b.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
    
      </div>
      {/* Charts */}
      <div className="modern-card">
        <h2>Budget Allocation</h2>
        <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        <div style={{ height: 32 }} />
        <Doughnut data={pieData} />
      </div>
    </div>
  );
};

export default Budget; 