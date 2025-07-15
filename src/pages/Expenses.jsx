import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Bar, Doughnut } from "react-chartjs-2";
import dayjs from "dayjs";
import "./ModernPage.css";

const expenseCategories = ["Food", "Shopping", "Bills", "Transport", "Health", "Other"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i);

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState(expenseCategories[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM"));
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async (month, year) => {
    setLoading(true);
    const snap = await getDocs(collection(db, "expenses"));
    const filtered = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(e => {
        if (!e.date) return false;
        const d = dayjs(e.date);
        return d.month() + 1 === month && d.year() === year;
      });
    setExpenses(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!category || !amount || !date) return;
    await addDoc(collection(db, "expenses"), {
      category,
      amount: Number(amount),
      date: dayjs(date).toISOString(),
    });
    setAmount("");
    fetchExpenses(selectedMonth, selectedYear);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    fetchExpenses(selectedMonth, selectedYear);
  };

  // Chart data
  const barData = {
    labels: expenseCategories,
    datasets: [{
      label: "Expenses",
      data: expenseCategories.map(cat => {
        return expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0);
      }),
      backgroundColor: "#5f4dee",
    }]
  };
  const pieData = {
    labels: expenseCategories,
    datasets: [{
      data: expenseCategories.map(cat => {
        return expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0);
      }),
      backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350", "#26a69a"],
    }]
  };
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="modern-page-grid">
      {/* Form + Table */}
      <div className="modern-card">
        <h2>Add New Expense</h2>
        <form onSubmit={handleAddExpense} className="modern-form">
          <div>
            <label>Category:</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Amount used" />
          </div>
          <div>
            <label>Month/Year:</label>
            <input type="month" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <button type="submit">Add Expense</button>
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
          <b>Total Expenses:</b> {totalExpenses}
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
            {expenses.map(e => (
              <tr key={e.id}>
                <td>{e.category}</td>
                <td>{e.amount}</td>
                <td>{dayjs(e.date).format("MMM YYYY")}</td>
                <td><button className="modern-delete" onClick={() => handleDelete(e.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer style={{ marginTop: 24, color: '#5f4dee', fontWeight: 600, textAlign: 'center', width: '100%' }}>
          &copy; {new Date().getFullYear()} kanak verma
        </footer>
      </div>
      {/* Charts */}
      <div className="modern-card">
        <h2>Expenses Overview</h2>
        <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        <div style={{ height: 32 }} />
        <Doughnut data={pieData} />
      </div>
    </div>
  );
};

export default Expenses; 