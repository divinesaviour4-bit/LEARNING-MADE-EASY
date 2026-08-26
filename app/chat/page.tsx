"use client";

import { useState } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I am your Campus Learning Made Easy AI Assistant. Ask me to explain difficult topics, break down past questions and answers, or generate a custom study schedule for your AKSU exams!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Connect to your backend AI study endpoint
      const res = await fetch("https://learning-made-easy-backend.onrender.com/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage })
      });
      const data = await res.json();
      
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply || "I've received your query! Once your backend AI model is fully connected, I will provide a detailed answer here." }]);
      }
    } catch (err) {
      console.error(err);
      // Fallback response for testing UI before backend endpoint is live
      setMessages((prev) => [
        ...prev, 
        { sender: "ai", text: `Here is a structured study insight regarding your request: "${userMessage}". Keep pushing for those A's!` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #1e293b", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "900", padding: "6px 10px", borderRadius: "8px", fontSize: "0.8rem" }}>AI</span>
          <span style={{ fontWeight: "700", fontSize: "1rem", color: "#ffffff" }}>AKSU AI Study Room</span>
        </div>
        <a href="/" style={{ backgroundColor: "#1e293b", color: "#60a5fa", border: "1px solid #334155", padding: "8px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700", textDecoration: "none" }}>
          ← Back to Home
        </a>
      </nav>

      {/* Chat Container */}
      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", padding: "20px 16px", flex: 1, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase" }}>
            Powered by Gemini AI
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", marginTop: "10px" }}>Your Personal Examination Tutor</h2>
        </div>

        {/* Messages Box */}
        <div style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px", maxHeight: "60vh" }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.sender === "user" ? "#3b82f6" : "#0f172a", color: "#ffffff", padding: "12px 16px", borderRadius: "12px", border: msg.sender === "ai" ? "1px solid #334155" : "none", fontSize: "0.9rem", lineHeight: "1.5", whiteSpace: "pre-line" }}>
              <strong style={{ display: "block", fontSize: "0.75rem", color: msg.sender === "user" ? "#93c5fd" : "#60a5fa", marginBottom: "4px" }}>
                {msg.sender === "user" ? "You" : "AKSU AI Tutor"}
              </strong>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", background: "#0f172a", border: "1px solid #334155", padding: "12px 16px", borderRadius: "12px", color: "#94a3b8", fontSize: "0.85rem" }}>
              AI is analyzing course materials and generating your response...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask a question or request a study schedule..." 
            style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
          />
          <button type="submit" disabled={loading} style={{ background: "#3b82f6", color: "#ffffff", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}>
            {loading ? "Thinking..." : "Send 🚀"}
          </button>
        </form>

      </div>
    </div>
  );
}
