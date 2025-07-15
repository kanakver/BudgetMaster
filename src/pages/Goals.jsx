import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import "./ModernPage.css";

const goalCategories = ["Saving", "Buying", "Travel", "Education", "Other"];
const periodTypes = ["Monthly", "Yearly"];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i);

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState(1000);
  const [goalMax, setGoalMax] = useState(10000);
  const [goalMin, setGoalMin] = useState(0);
  const [category, setCategory] = useState(goalCategories[0]);
  const [periodType, setPeriodType] = useState(periodTypes[0]);
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "goals"));
    const filtered = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(g => {
        if (g.periodType === "Monthly") {
          return g.month === month && g.year === year;
        } else if (g.periodType === "Yearly") {
          return g.year === year;
        }
        return false;
      });
    setGoals(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line
  }, [month, year, periodType]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalName || !goalAmount || !category) return;
    await addDoc(collection(db, "goals"), {
      name: goalName,
      amount: Number(goalAmount),
      min: Number(goalMin),
      max: Number(goalMax),
      category,
      periodType,
      month: Number(month),
      year: Number(year),
      progress: 0,
    });
    setGoalName("");
    setGoalAmount(1000);
    setGoalMin(0);
    setGoalMax(10000);
    setCategory(goalCategories[0]);
    setPeriodType(periodTypes[0]);
    fetchGoals();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "goals", id));
    fetchGoals();
  };

  // Chart data
  const chartData = {
    labels: goals.map(g => g.name),
    datasets: [{
      label: "Goal Amount",
      data: goals.map(g => g.amount),
      backgroundColor: "#5f4dee",
    }]
  };

  return (
    <div className="modern-page-grid">
      {/* Form + Table */}
      <div className="modern-card">
        <h2>Add New Goal</h2>
        <form onSubmit={handleAddGoal} className="modern-form">
          <div>
            <label>Goal Name:</label>
            <input type="text" value={goalName} onChange={e => setGoalName(e.target.value)} required placeholder="Goal name" />
          </div>
          <div>
            <label>Category:</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {goalCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Period:</label>
            <select value={periodType} onChange={e => setPeriodType(e.target.value)}>
              {periodTypes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {periodType === "Monthly" && (
              <>
                <select value={month} onChange={e => setMonth(Number(e.target.value))}>
                  {months.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
                </select>
              </>
            )}
            <select value={year} onChange={e => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label>Goal Amount: {goalAmount}</label>
            <input type="range" min={goalMin} max={goalMax} value={goalAmount} onChange={e => setGoalAmount(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" value={goalMin} onChange={e => setGoalMin(e.target.value)} style={{ width: 70 }} placeholder="Min" />
              <input type="number" value={goalMax} onChange={e => setGoalMax(e.target.value)} style={{ width: 70 }} placeholder="Max" />
            </div>
          </div>
          <button type="submit">Add Goal</button>
        </form>
        <div className="modern-table-summary">
          <b>Total Goals:</b> {goals.reduce((sum, g) => sum + Number(g.amount), 0)}
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(g => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.category}</td>
                <td>{g.amount}</td>
                <td>{g.periodType === "Monthly" ? `${months[g.month - 1]}, ${g.year}` : g.year}</td>
                <td><button className="modern-delete" onClick={() => handleDelete(g.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer style={{ marginTop: 24, color: '#5f4dee', fontWeight: 600, textAlign: 'center', width: '100%' }}>
          &copy; {new Date().getFullYear()} kanak verma
        </footer>
      </div>
      {/* Chart */}
      <div className="modern-card">
        <h2>Goals Overview</h2>
        <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
};

export default Goals; 