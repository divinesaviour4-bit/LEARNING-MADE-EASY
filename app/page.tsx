"use client";import { AKSU_GST212_QUESTIONS } from "../data/aksu_gst212";


import { useState, useEffect } from "react";
import { GST111_QUESTIONS, GST112_QUESTIONS, GST212_QUESTIONS } from "../data/questions";

export default function CampusLearningHub() {
  const [activeTab, setActiveTab] = useState<"ai" | "cbt" | "about" | "feedback">("ai");
  
  // AI Study Room States
  const [hasAiAccess, setHasAiAccess] = useState(false);
  const [aiFullName, setAiFullName] = useState("");
  const [aiEmail, setAiEmail] = useState("");
  const [aiPhone, setAiPhone] = useState("");
  const [aiPlan, setAiPlan] = useState<"PlanA" | "PlanB">("PlanA");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! Welcome to the AI Study Room. Ask me any question about your coursework." }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiChatLoading, setAiChatLoading] = useState(false);

  // CBT Section States
  const [selectedSchool, setSelectedSchool] = useState<"UniUyo" | "AKSU" | null>(null);
  const [paidCourses, setPaidCourses] = useState<{ [key: string]: boolean }>({});
  
  // Payment Modal States
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerPhone, setPayerPhone] = useState("");

  // Exam Room States
  const [inExamRoom, setInExamRoom] = useState(false);
  const [activeCourseCode, setActiveCourseCode] = useState<string>("");
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Testimonials & Feedback States
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [testimonials, setTestimonials] = useState([
    { name: "Mfoniso Etuk", dept: "Electrical & Electronics Engineering", text: "Achieve As in your general courses became a reality for me using Campus Learning Hub! The 40-question CBT simulations are exceptionally accurate." },
    { name: "David Okon", dept: "Computer Science", text: "The independent course unlock feature is amazing. Best study portal for UniUyo and AKSU students!" },
    { name: "Grace Umoh", dept: "Accounting", text: "Using the AI Study Room made complex topics so easy to understand. Highly recommended!" },
    { name: "Anietie Akpan", dept: "Mechanical Engineering", text: "The curated course materials and timed practice questions gave me total confidence before entering the hall." }
  ]);

  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackDept, setFeedbackDept] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (!(window as any).PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inExamRoom && !examSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && inExamRoom && !examSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [inExamRoom, examSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFullName || !aiEmail || !aiPhone) {
      alert("Please fill in all your details.");
      return;
    }
    if (!(window as any).PaystackPop) {
      alert("Paystack is still loading. Please try again.");
      return;
    }

    setAiLoading(true);
    const amount = aiPlan === "PlanA" ? 500 : 1000;

    try {
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_live_46af751280a7a8c388a4ed2e90d2b3ed9d84c548',
        email: aiEmail,
        amount: amount * 100,
        currency: 'NGN',
        ref: 'AI_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function() {
          setAiLoading(false);
          setHasAiAccess(true);
          alert("Payment verified! AI Study Room unlocked.");
        },
        onClose: function() {
          setAiLoading(false);
          alert("Payment was closed.");
        }
      });
      handler.openIframe();
    } catch (err) {
      setAiLoading(false);
      alert("Payment gateway error.");
    }
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiChatLoading) return;
    const userText = aiInput.trim();
    const updated = [...aiMessages, { role: "user", content: userText }];
    setAiMessages(updated);
    setAiInput("");
    setAiChatLoading(true);

    try {
      const res = await fetch("https://learning-made-easy-backend.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated })
      });
      const data = await res.json();
      const reply = data.reply || data.message || data.choices?.[0]?.message?.content || "Here is your course explanation.";
      setAiMessages([...updated, { role: "assistant", content: reply }]);
    } catch (err) {
      setAiMessages([...updated, { role: "assistant", content: "Network error connecting to AI server." }]);
    } finally {
      setAiChatLoading(false);
    }
  };

  const openCbtPaymentModal = (courseCode: string) => {
    setPaymentCourse(courseCode);
    setShowPayModal(true);
  };

  const handleCbtPaystackPayment = () => {
    if (!payerName || !payerEmail || !payerPhone) {
      alert("Please fill in your payment details.");
      return;
    }
    if (!(window as any).PaystackPop) {
      alert("Paystack is loading.");
      return;
    }

    try {
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_live_46af751280a7a8c388a4ed2e90d2b3ed9d84c548',
        email: payerEmail,
        amount: 500 * 100,
        currency: 'NGN',
        ref: 'CBT_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function() {
          setPaidCourses((prev) => ({ ...prev, [paymentCourse]: true }));
          setShowPayModal(false);
          setPayerName(""); setPayerEmail(""); setPayerPhone("");
          alert(`Payment verified! Access unlocked exclusively for ${paymentCourse}.`);
        },
        onClose: function() {
          alert("Transaction was not completed.");
        }
      });
      handler.openIframe();
    } catch (err) {
      alert("Payment gateway error.");
    }
  };

  const handleStartExam = (courseCode: string) => {
    if (!paidCourses[courseCode]) {
      openCbtPaymentModal(courseCode);
      return;
    }

    setActiveCourseCode(courseCode);
    let sourceQuestions = GST111_QUESTIONS;
    if (courseCode.includes("112")) sourceQuestions = GST112_QUESTIONS;
    if (courseCode.includes("AKSU") && courseCode.includes("212")) {
      sourceQuestions = AKSU_GST212_QUESTIONS;
    } else if (courseCode.includes("212") || courseCode.includes("202")) {
      sourceQuestions = GST212_QUESTIONS;
    }

    const shuffled = [...sourceQuestions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, Math.min(40, shuffled.length)));
    setInExamRoom(true);
    setTimeLeft(15 * 60);
    setExamSubmitted(false);
    setUserAnswers({});
    setCurrentQIndex(0);
  };

  const handleSubmitExam = () => {
    let scoreCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) scoreCount++;
    });
    setScore(scoreCount);
    setExamSubmitted(true);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackDept.trim() || !feedbackText.trim()) {
      alert("Please fill in all feedback fields.");
      return;
    }
    setTestimonials([{ name: feedbackName.trim(), dept: feedbackDept.trim(), text: feedbackText.trim() }, ...testimonials]);
    setFeedbackName(""); setFeedbackDept(""); setFeedbackText("");
    alert("Thank you! Your feedback has been successfully submitted.");
    setActiveTab("about");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Navbar */}
      <nav style={{ background: "#1d4ed8", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ffffff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "900", cursor: "pointer" }} onClick={() => setActiveTab("ai")}>CAMPUS LEARNING HUB</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ background: "#22c55e", color: "#ffffff", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "900", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            Join WhatsApp
          </a>
          <button onClick={() => { setActiveTab("ai"); setInExamRoom(false); }} style={{ background: activeTab === "ai" ? "#fbbf24" : "transparent", color: activeTab === "ai" ? "#0f172a" : "#ffffff", border: "1px solid #fbbf24", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
            AI Study Room
          </button>
          <button onClick={() => { setActiveTab("cbt"); setInExamRoom(false); }} style={{ background: activeTab === "cbt" ? "#fbbf24" : "transparent", color: activeTab === "cbt" ? "#0f172a" : "#ffffff", border: "1px solid #fbbf24", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
            CBT Center
          </button>
          <button onClick={() => { setActiveTab("about"); setInExamRoom(false); }} style={{ background: activeTab === "about" ? "#fbbf24" : "transparent", color: activeTab === "about" ? "#0f172a" : "#ffffff", border: "1px solid #fbbf24", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
            About & Testimonials
          </button>
          <button onClick={() => { setActiveTab("feedback"); setInExamRoom(false); }} style={{ background: activeTab === "feedback" ? "#fbbf24" : "transparent", color: activeTab === "feedback" ? "#0f172a" : "#ffffff", border: "1px solid #fbbf24", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
            Give Feedback
          </button>
        </div>
      </nav>

      {/* Hero Welcome Banner */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", color: "#ffffff", padding: "40px 20px", textAlign: "center", borderBottom: "4px solid #fbbf24" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ background: "#fbbf24", color: "#1d4ed8", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase" }}>
            WELCOME TO CAMPUS LEARNING HUB
          </span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: "900", margin: "12px 0 10px 0" }}>
            Achieve As in Your General Courses
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#e2e8f0", lineHeight: "1.6", maxWidth: "700px", margin: "0 auto" }}>
            Master your university general studies with intelligent AI tutoring and realistic 40-question timed CBT exam simulations tailored for UniUyo and AKSU undergraduates.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "30px auto", padding: "0 16px" }}>

        {/* ================= AI STUDY ROOM VIEW ================= */}
        {activeTab === "ai" && (
          <div>
            {!hasAiAccess ? (
              <div style={{ background: "#ffffff", border: "2px solid #fbbf24", borderRadius: "12px", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "900" }}>VIRTUAL STUDY COMPANION</span>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 0 0" }}>AI Study Room Access Pass</h2>
                </div>
                <form onSubmit={handleAiPayment} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="text" value={aiFullName} onChange={(e) => setAiFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                  <input type="email" value={aiEmail} onChange={(e) => setAiEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                  <input type="text" value={aiPhone} onChange={(e) => setAiPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                  <select value={aiPlan} onChange={(e) => setAiPlan(e.target.value as any)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }}>
                    <option value="PlanA">Plan A - ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500 (7 Days)</option>
                    <option value="PlanB">Plan B - ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦1,000 (Semester Pass)</option>
                  </select>
                  <button type="submit" disabled={aiLoading} style={{ background: "#1d4ed8", color: "#ffffff", padding: "14px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer" }}>
                    {aiLoading ? "Processing..." : "Pay with Paystack & Unlock AI"}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ background: "#0f172a", borderRadius: "12px", border: "2px solid #fbbf24", height: "70vh", display: "flex", flexDirection: "column", overflow: "hidden", color: "#ffffff" }}>
                <div style={{ background: "#1e293b", padding: "14px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "900" }}>AI Study Room (Unlocked)</span>
                  <button onClick={() => setHasAiAccess(false)} style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>Lock Pass</button>
                </div>
                <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {aiMessages.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: "8px", background: m.role === "user" ? "#1d4ed8" : "#1e293b", fontSize: "0.9rem" }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {aiChatLoading && <div style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.85rem" }}>AI is thinking...</div>}
                </div>
                <form onSubmit={handleSendAiMessage} style={{ padding: "12px", background: "#1e293b", borderTop: "1px solid #334155", display: "flex", gap: "8px" }}>
                  <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask coursework question..." style={{ flex: 1, padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", outline: "none" }} />
                  <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>Send</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= CBT CENTER VIEW ================= */}
        {activeTab === "cbt" && !inExamRoom && (
          <div style={{ background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "12px", padding: "28px" }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>EXAM PREPARATION CENTER</span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 16px 0" }}>Select University CBT Center</h2>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
              <button onClick={() => setSelectedSchool("UniUyo")} style={{ background: selectedSchool === "UniUyo" ? "#1d4ed8" : "#f1f5f9", color: selectedSchool === "UniUyo" ? "#ffffff" : "#1e293b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>
                University of Uyo (UniUyo)
              </button>
              <button onClick={() => setSelectedSchool("AKSU")} style={{ background: selectedSchool === "AKSU" ? "#1d4ed8" : "#f1f5f9", color: selectedSchool === "AKSU" ? "#ffffff" : "#1e293b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>
                Akwa Ibom State University (AKSU)
              </button>
            </div>

            {selectedSchool && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                
                {selectedSchool === "UniUyo" && (
                  <>
                    {["GST 111", "GST 112", "GST 212"].map((course) => {
                      const isUnlocked = paidCourses[course];
                      return (
                        <div key={course} style={{ background: "#f8fafc", border: `2px solid ${isUnlocked ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <span style={{ background: isUnlocked ? "#d1fae5" : "#dbeafe", color: isUnlocked ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                              {isUnlocked ? "UNLOCKED" : "LOCKED (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)"}
                            </span>
                            <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>{course} CBT Exam</h3>
                          </div>
                          <button onClick={() => handleStartExam(course)} style={{ background: isUnlocked ? "#10b981" : "#1d4ed8", color: "#ffffff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase", marginTop: "12px" }}>
                            {isUnlocked ? "Take CBT Exam" : "Unlock Course (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)"}
                          </button>
                        </div>
                      );
                    })}
                  </>
                )}

                {selectedSchool === "AKSU" && (
                  <>
                    {["AKSU GST 112", "AKSU GST 212"].map((course) => {
                      const isUnlocked = paidCourses[course];
                      return (
                        <div key={course} style={{ background: "#f8fafc", border: `2px solid ${isUnlocked ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <span style={{ background: isUnlocked ? "#d1fae5" : "#dbeafe", color: isUnlocked ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                              {isUnlocked ? "UNLOCKED" : "LOCKED (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)"}
                            </span>
                            <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>{course} CBT Exam</h3>
                          </div>
                          <button onClick={() => handleStartExam(course)} style={{ background: isUnlocked ? "#10b981" : "#1d4ed8", color: "#ffffff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase", marginTop: "12px" }}>
                            {isUnlocked ? "Take CBT Exam" : "Unlock Course (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)"}
                          </button>
                        </div>
                      );
                    })}
                  </>
                )}

              </div>
            )}
          </div>
        )}

        {/* ================= ABOUT US & WHY CHOOSE US & TESTIMONIALS VIEW ================= */}
        {activeTab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "12px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>ABOUT CAMPUS LEARNING HUB</span>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 16px 0" }}>Achieve As In Your General Courses</h2>
              <p style={{ color: "#475569", fontSize: "1rem", lineHeight: "1.7", marginBottom: "16px" }}>
                Campus Learning Hub is an advanced digital learning platform designed specifically for university undergraduates. Our mission is to bridge the gap between complex lecture materials and distinction-level achievement.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ background: "#22c55e", color: "#ffffff", padding: "10px 18px", borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem", fontWeight: "900", display: "inline-block" }}>
                  Join WhatsApp Study Group
                </a>
                <button onClick={() => setActiveTab("feedback")} style={{ background: "#1d4ed8", color: "#ffffff", padding: "10px 18px", borderRadius: "6px", border: "none", fontSize: "0.9rem", fontWeight: "900", cursor: "pointer" }}>
                  Give Your Feedback
                </button>
              </div>
              <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                Support email: <strong style={{ color: "#1d4ed8" }}>bsaviourokon@gmail.com</strong>
              </p>
            </div>

            {/* Why Choose Us Section */}
            <div style={{ background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "12px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>WHY CHOOSE US</span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 20px 0" }}>Built For Student Excellence</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#1d4ed8", fontWeight: "900" }}>Verified Question Banks</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>Curated past questions tailored specifically to UniUyo and AKSU exam standards to eliminate exam anxiety.</p>
                </div>
                <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#1d4ed8", fontWeight: "900" }}>Instant Pay-Per-Course Unlock</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>Flexible ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500 access per course via secure Paystack integration so you only pay for what you practice.</p>
                </div>
                <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#1d4ed8", fontWeight: "900" }}>24/7 Virtual AI Companion</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>Clear, intelligent AI tutoring designed to simplify difficult academic concepts instantly.</p>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div style={{ background: "#ffffff", border: "2px solid #fbbf24", borderRadius: "12px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
              <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>STUDENT TESTIMONIALS</span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 20px 0" }}>What Students Are Saying</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(showAllTestimonials ? testimonials : testimonials.slice(0, 2)).map((t, idx) => (
                  <div key={idx} style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "18px", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#334155", fontStyle: "italic" }}>"{t.text}"</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: "900", color: "#1d4ed8" }}>{t.name} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â <span style={{ color: "#64748b", fontWeight: "700" }}>{t.dept}</span></p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", flexWrap: "wrap", gap: "10px" }}>
                <button onClick={() => setShowAllTestimonials(!showAllTestimonials)} style={{ background: "#1e293b", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem" }}>
                  {showAllTestimonials ? "Show Less (ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²)" : "See More Testimonials (ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼)"}
                </button>
                <button onClick={() => setActiveTab("feedback")} style={{ background: "#22c55e", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem" }}>
                  Give Your Feedback
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= GIVE FEEDBACK VIEW ================= */}
        {activeTab === "feedback" && (
          <div style={{ background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "12px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>STUDENT FEEDBACK PORTAL</span>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 8px 0" }}>Give Your Feedback</h2>
            <p style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "20px" }}>Share your experience with Campus Learning Hub to help us improve student success.</p>
            
            <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} required placeholder="Your Full Name (e.g. Samuel Etim)" style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
              <input type="text" value={feedbackDept} onChange={(e) => setFeedbackDept(e.target.value)} required placeholder="Your Department (e.g. Electrical Engineering)" style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} required rows={4} placeholder="Write your feedback or review here..." style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", resize: "vertical" }} />
              <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", padding: "14px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                Submit Feedback
              </button>
            </form>
          </div>
        )}

        {/* ================= EXAM ROOM SIMULATION ================= */}
        {inExamRoom && (
          <div style={{ background: "#0f172a", color: "#ffffff", padding: "28px", borderRadius: "14px", border: "2px solid #fbbf24" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#fbbf24", margin: 0 }}>{activeCourseCode} Examination Room</h2>
              <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: "6px", fontWeight: "900", fontFamily: "monospace" }}>{formatTime(timeLeft)}</span>
            </div>

            {!examSubmitted ? (
              <div>
                <div style={{ background: "#1e293b", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "bold", margin: "0 0 8px 0" }}>Question {currentQIndex + 1} of {activeQuestions.length}</p>
                  <p style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0" }}>{activeQuestions[currentQIndex].question}</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeQuestions[currentQIndex].options.map((opt: string, optIdx: number) => {
                      const isSelected = userAnswers[currentQIndex] === optIdx;
                      return (
                        <label key={optIdx} onClick={() => setUserAnswers({ ...userAnswers, [currentQIndex]: optIdx })} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "6px", background: isSelected ? "#1d4ed8" : "#0f172a", border: "1px solid #334155", cursor: "pointer", fontSize: "0.9rem" }}>
                          <input type="radio" checked={isSelected} onChange={() => {}} />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button disabled={currentQIndex === 0} onClick={() => setCurrentQIndex((p) => Math.max(0, p - 1))} style={{ background: "#334155", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "800", cursor: "pointer" }}>Previous</button>
                  {currentQIndex < activeQuestions.length - 1 ? (
                    <button onClick={() => setCurrentQIndex((p) => Math.min(activeQuestions.length - 1, p + 1))} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "800", cursor: "pointer" }}>Next</button>
                  ) : (
                    <button onClick={handleSubmitExam} style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>Submit Exam</button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#ffffff", marginBottom: "8px" }}>Exam Completed!</h3>
                <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fbbf24", marginBottom: "20px" }}>Your Score: {score} / {activeQuestions.length}</p>
                <button onClick={() => setInExamRoom(false)} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>Back to CBT Center</button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= PAYSTACK MODAL FOR CBT ================= */}
      {showPayModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", zIndex: 100 }}>
          <div style={{ background: "#ffffff", padding: "28px", borderRadius: "12px", maxWidth: "420px", width: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "14px", color: "#1e293b" }}>Unlock {paymentCourse} (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" value={payerName} onChange={(e) => setPayerName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="text" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <button type="button" onClick={handleCbtPaystackPayment} style={{ background: "#22c55e", color: "#ffffff", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", marginTop: "8px" }}>
                Pay ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500 via Paystack
              </button>
              <button type="button" onClick={() => setShowPayModal(false)} style={{ background: "#64748b", color: "#ffffff", padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #cbd5e1", marginTop: "60px", padding: "20px", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
        <p style={{ margin: "0 0 6px 0" }}>
          <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ color: "#22c55e", fontWeight: "900", textDecoration: "none", marginRight: "15px" }}>
            Join WhatsApp Group
          </a>
          Support Email: <a href="mailto:bsaviourokon@gmail.com" style={{ color: "#1d4ed8", fontWeight: "800", textDecoration: "none" }}>bsaviourokon@gmail.com</a>
        </p>
        <p style={{ margin: 0, fontWeight: "700" }}>Ãƒâ€šÃ‚Â© 2026 Campus Learning Hub. All rights reserved.</p>
      </footer>

    </div>
  );
}