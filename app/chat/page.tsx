"use client";

import { useState, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I am your Campus Learning Hub AI Assistant. Ask me to explain difficult topics, break down past questions and answers, or generate a custom study schedule for your exams!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Access Verification States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Check session storage on load
  useEffect(() => {
    const verified = sessionStorage.getItem("clh_verified_student");
    if (verified) {
      setIsUnlocked(true);
    }
  }, []);

  // Handle Access Token Verification
  const handleAccessVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyEmail || !accessCode) {
      alert("Please enter both your email and access code.");
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch("https://learning-made-easy-backend.onrender.com/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verifyEmail,
          access_code: accessCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsUnlocked(true);
        sessionStorage.setItem("clh_verified_student", "true");
        alert(data.message || "Access granted to AI Study Room!");
      } else {
        alert(data.message || "Invalid credentials, payment not verified, or access expired.");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please check your credentials.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
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
      
      {/* Sky Sports Athletic Header Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#121212", borderBottom: "3px solid #e11d48", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ backgroundColor: "#e11d48", color: "#ffffff", fontWeight: "900", padding: "6px 10px", borderRadius: "4px", fontSize: "0.85rem" }}>CLH</span>
          <span style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>Campus Learning AI Study Room</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {isUnlocked && (
            <button 
              onClick={() => {
                setIsUnlocked(false);
                sessionStorage.removeItem("clh_verified_student");
              }} 
              style={{ backgroundColor: "#7c2d12", color: "#ffffff", border: "none", padding: "6px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
            >
              Lock Session 🔒
            </button>
          )}
          <a href="/" style={{ backgroundColor: "#182232", color: "#fb7185", border: "1px solid #334155", padding: "8px 14px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "800", textDecoration: "none" }}>
            ← Home
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", padding: "20px 16px", flex: 1, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        
        <div style={{ textAlign: "center", marginBottom: "20px", marginTop: "10px" }}>
          <span style={{ background: "rgba(225, 29, 72, 0.15)", color: "#fb7185", border: "1px solid rgba(225, 29, 72, 0.3)", padding: "4px 12px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900", textTransform: "uppercase" }}>
            Powered by Gemini AI
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#ffffff", marginTop: "10px", textTransform: "uppercase" }}>Your Personal Examination Tutor</h2>
        </div>

        {!isUnlocked ? (
          {/* Locked State - Enter Access Code */}
          <div style={{ flex: 1, background: "#182232", border: "1px solid #334155", borderTop: "4px solid #e11d48", borderRadius: "12px", padding: "30px 20px", maxWidth: "450px", margin: "20px auto", width: "100%", textAlign: "center", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <span style={{ fontSize: "2.5rem" }}>🔒</span>
            <h3 style={{ color: "#ffffff", fontSize: "1.2rem", margin: "10px 0 6px 0", fontWeight: "900" }}>Enter Access Code to Unlock</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "20px", lineHeight: "1.5" }}>
              Please enter your verified email address and access code to access the Campus Learning AI Study Room.
            </p>
            <form onSubmit={handleAccessVerify} style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              <input 
                type="email" 
                value={verifyEmail} 
                onChange={(e) => setVerifyEmail(e.target.value)} 
                required 
                placeholder="Your Email Address" 
                style={{ padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} 
              />
              <input 
                type="text" 
                value={accessCode} 
                onChange={(e) => setAccessCode(e.target.value)} 
                required 
                placeholder="Access Code (e.g. GEN101-H9LTY)" 
                style={{ padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} 
              />
              <button 
                type="submit" 
                disabled={verifyLoading} 
                style={{ background: "#e11d48", color: "#ffffff", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", width: "100%", marginTop: "6px", textTransform: "uppercase", boxShadow: "0 4px 12px rgba(225, 29, 72, 0.4)" }}
              >
                {verifyLoading ? "Verifying Token..." : "Verify & Enter Study Room ⚡"}
              </button>
            </form>
            <div style={{ marginTop: "16px", fontSize: "0.8rem", color: "#94a3b8" }}>
              Don't have an access code yet? <a href="/#pricing" style={{ color: "#fb7185", textDecoration: "none", fontWeight: "bold" }}>Get a Pass here →</a>
            </div>
          </div>
        ) : (
          {/* Unlocked Chat Interface */}
          <>
            <div style={{ flex: 1, background: "#182232", border: "1px solid #334155", borderRadius: "12px", padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px", maxHeight: "60vh" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.sender === "user" ? "#e11d48" : "#0f172a", color: "#ffffff", padding: "12px 16px", borderRadius: "8px", border: msg.sender === "ai" ? "1px solid #334155" : "none", fontSize: "0.9rem", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                  <strong style={{ display: "block", fontSize: "0.75rem", color: msg.sender === "user" ? "#fbcfe8" : "#fb7185", marginBottom: "4px" }}>
                    {msg.sender === "user" ? "You" : "Campus Learning AI Tutor"}
                  </strong>
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", background: "#0f172a", border: "1px solid #334155", padding: "12px 16px", borderRadius: "8px", color: "#94a3b8", fontSize: "0.85rem" }}>
                  AI is analyzing course materials and generating your response...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask a question or request a study schedule..." 
                style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", background: "#182232", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
              <button type="submit" disabled={loading} style={{ background: "#e11d48", color: "#ffffff", border: "none", padding: "12px 20px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "0.9rem", textTransform: "uppercase", boxShadow: "0 4px 12px rgba(225, 29, 72, 0.4)" }}>
                {loading ? "Thinking..." : "Send 🚀"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
