"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to the LME AI Study Room! Ask questions about your general courses below." }
  ]);
  const [input, setInput] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) {
      alert("Please enter both your email and access token.");
      return;
    }
    setIsAuthorized(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "Here is the detailed explanation for your general course question." }]);
    }, 1000);
  };

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div style={{ maxWidth: "400px", width: "100%", background: "#1e293b", border: "1px solid #334155", padding: "30px", borderRadius: "20px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px", textAlign: "center", color: "#ffffff" }}>Enter Access Token</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "5px" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@uniuyo.edu.ng" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "5px" }}>Token</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)} required placeholder="e.g. LME-9921" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", boxSizing: "border-box" }} />
            </div>
            <button type="submit" style={{ width: "100%", background: "#10b981", color: "#0f172a", padding: "12px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer" }}>Unlock AI Room →</button>
          </form>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link href="/" style={{ color: "#94a3b8", fontSize: "0.85rem", textDecoration: "none" }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid #334155", background: "#1e293b", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#ffffff" }}>Authorized Study Room ({email})</span>
        <Link href="/" style={{ color: "#94a3b8", fontSize: "0.85rem", textDecoration: "none" }}>Log Out</Link>
      </header>
      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
        <div style={{ overflowY: "auto", marginBottom: "20px", flex: 1, paddingRight: "5px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "15px" }}>
              <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: "12px", fontSize: "0.95krem", background: m.role === "user" ? "#10b981" : "#1e293b", color: m.role === "user" ? "#0f172a" : "#f8fafc", border: m.role === "assistant" ? "1px solid #334155" : "none", fontWeight: m.role === "user" ? "500" : "normal" }}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", background: "#1e293b", padding: "10px", borderRadius: "14px", border: "1px solid #334155" }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." style={{ flex: 1, padding: "10px", background: "transparent", border: "none", color: "#ffffff", outline: "none", fontSize: "0.95rem" }} />
          <button type="submit" style={{ background: "#10b981", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Send</button>
        </form>
      </main>
    </div>
  );
}
