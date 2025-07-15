import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import dayjs from "dayjs";
import "./ModernPage.css";

const defaultSources = ["Salary", "Freelance", "Business", "Other"];

const getMonthYear = (date) => {
  const d = dayjs(date);
  return { month: d.month() + 1, year: d.year() };
};

const Income = () => {
  const [income, setIncome] = useState([]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState(defaultSources[0]);
  const [customSource, setCustomSource] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM"));
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);

  const fetchIncome = async (month, year) => {
    setLoading(true);
    const snap = await getDocs(collection(db, "income"));
    // Filter by month/year
    const filtered = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(i => {
        if (!i.date) return false;
        const d = dayjs(i.date);
        return d.month() + 1 === month && d.year() === year;
      });
    setIncome(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncome(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!amount || (!source && !customSource) || !date) return;
    const src = customSource || source;
    await addDoc(collection(db, "income"), {
      source: src,
      amount: Number(amount),
      date: dayjs(date).toISOString(),
    });
    setAmount("");
    setCustomSource("");
    fetchIncome(selectedMonth, selectedYear);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "income", id));
    fetchIncome(selectedMonth, selectedYear);
  };

  // Chart data
  const chartData = {
    labels: income.map(i => i.source),
    datasets: [{
      data: income.map(i => i.amount),
      backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350", "#26a69a"],
    }]
  };
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);

  // Month/year options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i);

  return (
    <div className="modern-page-grid">
      {/* Form + Table */}
      <div className="modern-card">
        <h2>Add New Income</h2>
        <form onSubmit={handleAddIncome} className="modern-form">
          <div>
            <label>Income:</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Enter your income" />
          </div>
          <div>
            <label>Source:</label>
            <select value={source} onChange={e => setSource(e.target.value)}>
              {defaultSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 13, color: "#888", margin: "0.5em 0" }}>or add a new source</div>
          <div>
            <label>Source:</label>
            <input type="text" value={customSource} onChange={e => setCustomSource(e.target.value)} placeholder="Add New Source" />
          </div>
          <div>
            <label>Month/Year:</label>
            <input type="month" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <button type="submit">Submit</button>
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
          <b>Total Income:</b> {totalIncome}
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {income.map(i => (
              <tr key={i.id}>
                <td>{i.source}</td>
                <td>{i.amount}</td>
                <td>{dayjs(i.date).format("MMM YYYY")}</td>
                <td><button className="modern-delete" onClick={() => handleDelete(i.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Chart */}
      <div className="modern-card">
        <h2>Income Sources</h2>
        <Doughnut data={chartData} />
      </div>
    </div>
  );
};

export default Income; 