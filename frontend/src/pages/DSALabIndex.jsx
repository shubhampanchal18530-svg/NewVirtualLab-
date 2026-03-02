import React from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

export default function DSALabIndex() {
  const experiments = [
    { name: "Sorting Experiments", path: "/labs/dsa/sorting", desc: "Visualize and quiz on sorting algorithms", icon: "🔢", color: "#38bdf8" },
    { name: "Queue", path: "/labs/dsa/queue", desc: "Queue operations (enqueue/dequeue) with quiz", icon: "📋", color: "#10b981" },
    { name: "Linked List", path: "/labs/dsa/linked-list", desc: "Singly linked list operations and quiz", icon: "🔗", color: "#f59e0b" }
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">📊 DSA Lab</h1>
        <p className="lab-desc">Choose an experiment to begin. Each experiment contains an interactive visual demo and a short quiz.</p>
      </div>

      <section className="lab-list">
        {experiments.map((exp, i) => (
          <div key={i} className="card experiment-card" style={{borderLeftColor: exp.color}}>
            <div className="experiment-header">
              <span className="experiment-icon">{exp.icon}</span>
              <h3 className="experiment-name">{exp.name}</h3>
            </div>
            <p className="experiment-info">{exp.desc}</p>
            <Link to={exp.path} className="experiment-btn">Start Experiment <span>→</span></Link>
          </div>
        ))}
      </section>
    </div>
  );
}
