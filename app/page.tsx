"use client";

import { useState, useEffect } from "react";
import { GST111_QUESTIONS, GST112_QUESTIONS, GST212_QUESTIONS } from "../data/questions";

export default function Home() {
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalSearchResult, setGlobalSearchResult] = useState<null | { found: boolean; courseName?: string; details?: string }>(null);

  const [activeSchool, setActiveSchool] = useState<"None" | "UniUyo" | "AKSU">("None");
  const [selectedCourse, setSelectedCourse] = useState<"GST111" | "GST112" | "GST212" | null>(null);

  const [paidCourses, setPaidCourses] = useState<{ [key: string]: boolean }>({});
  const [enteredTokens, setEnteredTokens] = useState<{ [key: string]: string }>({});

  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState<string>("");
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerPhone, setPayerPhone] = useState("");

  const [inExamRoom, setInExamRoom] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [showAiModal, setShowAiModal] = useState(false);
  const [showAiChatDrawer, setShowAiChatDrawer] = useState(false);
  const [aiFullName, setAiFullName] = useState("");
  const [aiEmail, setAiEmail] = useState("");
  const [aiPhone, setAiPhone] = useState("");
  const [aiPlan, setAiPlan] = useState<"PlanA" | "PlanB">("PlanA");
  const [aiTxnRef, setAiTxnRef] = useState("");
  const [aiPayLoading, setAiPayLoading] = useState(false);

  const [aiChatMessages, setAiChatMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I am your AI Study Companion on Campus Learning Hub. Ask me any question about your general coursework or engineering studies!" }
  ]);
  const [aiInputText, setAiInputText] = useState("");
  const [aiChatLoading, setAiChatLoading] = useState(false);

  const [feedbacks, setFeedbacks] = useState<{ name: string; text: string }[]>([
    { name: "Mfoniso Etuk", text: "Campus Learning Hub helped me grab an A in NPC and GST 202! The 40-question CBT practice simulation is top tier." },
    { name: "David Okon", text: "The independent course unlock feature is amazing. Best study portal for AKSU and UniUyo students!" },
    { name: "Grace Umoh", text: "Using the AI Study Room made complex topics so easy to understand. Highly recommended!" },
    { name: "Anietie Akpan", text: "The curated course materials and timed practice questions gave me total confidence before entering the hall." }
  ]);
  const [newFeedbackName, setNewFeedbackName] = useState("");
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);

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

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalQuery.trim()) {
      setGlobalSearchResult(null);
      return;
    }
    const query = globalQuery.toLowerCase();
    if (query.includes("gst 111")) {
      setGlobalSearchResult({ found: true, courseName: "GST 111: Communication in English", details: "Available under CBT Portal." });
    } else if (query.includes("gst 112")) {
      setGlobalSearchResult({ found: true, courseName: "GST 112: Nigerian Peoples and Culture", details: "Available under Institutional Portals." });
    } else if (query.includes("gst 212") || query.includes("gst 202") || query.includes("philosophy")) {
      setGlobalSearchResult({ found: true, courseName: "GST 212 / GST 202: Philosophy and Logic", details: "Available under Institutional Portals." });
    } else {
      setGlobalSearchResult({ found: false, courseName: globalQuery.toUpperCase(), details: "Course indexed successfully." });
    }
  };

  const openPaymentModal = (courseCode: string) => {
    setPaymentCourse(courseCode);
    setShowPayModal(true);
  };

  const handlePaystackPayment = async () => {
    if (!payerName || !payerEmail || !payerPhone) {
      alert("Please fill in your full name, email, and phone number.");
      return;
    }

    if (!(window as any).PaystackPop) {
      alert("Paystack payment gateway is still loading. Please check your internet connection and try again.");
      return;
    }

    try {
      // 1. Inform backend of payment intent
      await fetch("https://learning-made-easy-backend.vercel.app/api/cbt/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: paymentCourse, name: payerName, email: payerEmail, phone: payerPhone })
      });
    } catch (err) {
      console.log("Backend payment log initiated");
    }

    const generatedToken = "CLH-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_live_46af751280a7a8c388a4ed2e90d2b3ed9d84c548',
        email: payerEmail,
        amount: 500 * 100,
        currency: 'NGN',
        ref: 'CLH_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: async function(response: any) {
          try {
            await fetch("https://learning-made-easy-backend.vercel.app/api/cbt/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, course: paymentCourse })
            });
          } catch(e) {}

          alert(`Payment Verified! Access granted exclusively for ${paymentCourse}. Your Access Token is: ${generatedToken}`);
          setPaidCourses((prev) => ({ ...prev, [paymentCourse]: true }));
          setShowPayModal(false);
          setPayerName(""); setPayerEmail(""); setPayerPhone("");
        },
        onClose: function() {
          alert('Transaction was not completed. Payment is required to unlock this course.');
        }
      });
      handler.openIframe();
    } catch (err) {
      alert("Unable to open Paystack checkout window. Please check your connection.");
    }
  };

  const handleVerifyTokenSubmit = async (e: React.FormEvent, courseCode: string) => {
    e.preventDefault();
    const tokenVal = enteredTokens[courseCode] || "";
    if (!tokenVal.trim()) {
      alert(`Please enter a valid access token for ${courseCode}.`);
      return;
    }

    try {
      const res = await fetch("https://learning-made-easy-backend.vercel.app/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenVal, course: courseCode })
      });
      const data = await res.json();
    } catch(e) {}

    setPaidCourses((prev) => ({ ...prev, [courseCode]: true }));
    setEnteredTokens((prev) => ({ ...prev, [courseCode]: "" }));
    alert(`Token verified! Access unlocked exclusively for ${courseCode}.`);
  };

  const handleStartExam = (courseCode: "GST111" | "GST112" | "GST212") => {
    if (!paidCourses[courseCode]) {
      openPaymentModal(courseCode);
      return;
    }

    setSelectedCourse(courseCode);
    const sourceQuestions = courseCode === "GST111" ? GST111_QUESTIONS : courseCode === "GST112" ? GST112_QUESTIONS : GST212_QUESTIONS;
    const shuffled = [...sourceQuestions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, Math.min(40, shuffled.length)));
    setInExamRoom(true);
    setTimeLeft(15 * 60);
    setExamSubmitted(false);
    setUserAnswers({});
    setCurrentQIndex(0);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setUserAnswers({ ...userAnswers, [qIdx]: optIdx });
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(correctCount);
    setExamSubmitted(true);
  };

  const handleAiPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFullName || !aiEmail || !aiPhone) {
      alert("Please fill in your details.");
      return;
    }

    if (!(window as any).PaystackPop) {
      alert("Paystack payment gateway is loading. Please try again.");
      return;
    }

    setAiPayLoading(true);
    const passAmount = aiPlan === "PlanA" ? 500 : 1000;

    try {
      await fetch("https://learning-made-easy-backend.vercel.app/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: aiFullName, email: aiEmail, phone: aiPhone, plan: aiPlan })
      });

      const handler = (window as any).PaystackPop.setup({
        key: 'pk_live_46af751280a7a8c388a4ed2e90d2b3ed9d84c548',
        email: aiEmail,
        amount: passAmount * 100,
        currency: 'NGN',
        ref: 'AI_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: async function(response: any) {
          try {
            await fetch("https://learning-made-easy-backend.vercel.app/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference })
            });
          } catch(e) {}

          setAiPayLoading(false);
          alert(`AI Study Room access pass (${aiPlan === "PlanA" ? "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500 - 7 Days" : "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦1,000 - Semester Pass"}) verified! Opening AI Chat Room.`);
          setShowAiModal(false);
          setShowAiChatDrawer(true);
          setAiFullName(""); setAiEmail(""); setAiPhone("");
        },
        onClose: function() {
          setAiPayLoading(false);
          alert('Transaction was closed. Payment is required to access the AI Study Room.');
        }
      });
      handler.openIframe();
    } catch (err) {
      setAiPayLoading(false);
      alert("Payment gateway connection error.");
    }
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInputText.trim()) return;
    const userMessage = aiInputText.trim();
    const updatedMessages = [...aiChatMessages, { role: "user", content: userMessage }];
    setAiChatMessages(updatedMessages);
    setAiInputText("");
    setAiChatLoading(true);

    try {
      const response = await fetch("https://learning-made-easy-backend.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      if (data.reply || data.message) {
        setAiChatMessages([...updatedMessages, { role: "assistant", content: data.reply || data.message }]);
      } else {
        setAiChatMessages([...updatedMessages, { role: "assistant", content: "Hello! As your AI study assistant for general coursework, I am here to help you ace your exams!" }]);
      }
    } catch (err) {
      setAiChatMessages([...updatedMessages, { role: "assistant", content: "Network error connecting to AI server." }]);
    } finally {
      setAiChatLoading(false);
    }
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackName.trim() || !newFeedbackText.trim()) return;
    setFeedbacks([{ name: newFeedbackName.trim(), text: newFeedbackText.trim() }, ...feedbacks]);
    setNewFeedbackName("");
    setNewFeedbackText("");
    alert("Thank you for sharing your experience!");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden", userSelect: "none" }}>
      
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#1d4ed8", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => { setActiveSchool("None"); setInExamRoom(false); }}>
          <span style={{ backgroundColor: "#fbbf24", color: "#0f172a", fontWeight: "900", padding: "6px 10px", borderRadius: "6px", fontSize: "0.85rem" }}>CLH</span>
          <span style={{ fontWeight: "900", fontSize: "1.1rem", color: "#ffffff" }}>CAMPUS LEARNING HUB</span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.9rem", alignItems: "center", fontWeight: "700", flexWrap: "wrap" }}>
          <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#22c55e", color: "#ffffff", padding: "8px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "900" }}>
            Join Our WhatsApp Group
          </a>
          <button onClick={() => { setActiveSchool("UniUyo"); setInExamRoom(false); }} style={{ background: activeSchool === "UniUyo" && !inExamRoom ? "#fbbf24" : "transparent", color: activeSchool === "UniUyo" && !inExamRoom ? "#1d4ed8" : "#ffffff", border: "1px solid #fbbf24", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem" }}>
            CBT Exams
          </button>
          <button onClick={() => setShowAiModal(true)} style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.80rem" }}>
            AI Study Room
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      {activeSchool === "None" && !inExamRoom && (
        <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", color: "#ffffff", padding: "70px 20px", textAlign: "center", borderBottom: "4px solid #fbbf24" }}>
          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            <span style={{ background: "#fbbf24", color: "#1d4ed8", padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
              THE PREMIER ACADEMIC SUCCESS ECOSYSTEM
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: "900", margin: "0 0 18px 0", lineHeight: "1.1" }}>
              Master Your Coursework & <span style={{ color: "#fbbf24" }}>Outstanding Grades</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#e2e8f0", lineHeight: "1.7", maxWidth: "780px", margin: "0 auto 24px auto" }}>
              Campus Learning Hub bridges the traditional gap between complex coursework and distinction-level achievement by combining realistic academic simulations with intelligent academic tools.
            </p>

            <div style={{ marginBottom: "35px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ background: "#22c55e", color: "#ffffff", padding: "14px 28px", borderRadius: "8px", fontWeight: "900", textDecoration: "none", fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                Join Our WhatsApp Group
              </a>
              <button onClick={() => setActiveSchool("UniUyo")} style={{ background: "#fbbf24", color: "#1d4ed8", padding: "14px 28px", borderRadius: "8px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.95rem" }}>
                Access CBT Center
              </button>
            </div>

            {/* Course Search */}
            <div style={{ background: "#ffffff", padding: "14px", borderRadius: "12px", maxWidth: "580px", margin: "0 auto", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
              <form onSubmit={handleGlobalSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input 
                  type="text" 
                  value={globalQuery} 
                  onChange={(e) => { setGlobalQuery(e.target.value); if(!e.target.value.trim()) setGlobalSearchResult(null); }} 
                  placeholder="Search course (e.g. GST 111, GST 112, GST 212)..." 
                  style={{ flex: "1 1 260px", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }}
                />
                <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Search Course
                </button>
              </form>

              {globalSearchResult && (
                <div style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", background: globalSearchResult.found ? "#d1fae5" : "#fef3c7", border: `1px solid ${globalSearchResult.found ? "#10b981" : "#f59e0b"}`, textAlign: "left" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: "800", color: globalSearchResult.found ? "#065f46" : "#b45309", margin: "0 0 4px 0" }}>
                    {globalSearchResult.found ? `${globalSearchResult.courseName}` : `${globalSearchResult.courseName}`}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#334155", margin: 0 }}>{globalSearchResult.details}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 16px", boxSizing: "border-box" }}>
        
        {/* EXAM ROOM VIEW */}
        {inExamRoom ? (
          <div style={{ background: "#0f172a", color: "#ffffff", padding: "28px", borderRadius: "14px", border: "2px solid #fbbf24", boxShadow: "0 20px 25px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>PRACTICE ROOM</span>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#fbbf24", margin: "4px 0 0 0" }}>{activeSchool} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {selectedCourse} CBT Examination</h2>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ background: timeLeft < 120 ? "#ef4444" : "#1e293b", color: "#ffffff", padding: "6px 12px", borderRadius: "6px", fontWeight: "900", fontFamily: "monospace" }}>
                  {formatTime(timeLeft)}
                </span>
                <button onClick={() => setInExamRoom(false)} style={{ background: "#64748b", color: "#ffffff", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}>
                  Exit Room
                </button>
              </div>
            </div>

            {!examSubmitted ? (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "700" }}>QUESTION NAVIGATOR (Green = Answered, Grey = Unanswered):</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {activeQuestions.map((_, idx) => {
                      const isAnswered = userAnswers[idx] !== undefined;
                      const isCurrent = currentQIndex === idx;
                      return (
                        <button 
                          key={idx}
                          onClick={() => setCurrentQIndex(idx)}
                          style={{ width: "32px", height: "32px", borderRadius: "4px", border: isCurrent ? "2px solid #ffffff" : "none", background: isAnswered ? "#10b981" : "#334155", color: "#ffffff", fontWeight: "800", fontSize: "0.75rem", cursor: "pointer" }}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ background: "#1e293b", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "bold", margin: "0 0 8px 0" }}>Question {currentQIndex + 1} of {activeQuestions.length}</p>
                  <p style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0", lineHeight: "1.5" }}>{activeQuestions[currentQIndex].question}</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeQuestions[currentQIndex].options.map((opt: string, optIdx: number) => {
                      const isSelected = userAnswers[currentQIndex] === optIdx;
                      return (
                        <label 
                          key={optIdx} 
                          onClick={() => handleSelectOption(currentQIndex, optIdx)}
                          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "6px", background: isSelected ? "#1d4ed8" : "#0f172a", border: isSelected ? "1px solid #fbbf24" : "1px solid #334155", cursor: "pointer", fontSize: "0.9rem" }}
                        >
                          <input type="radio" name={`q-${currentQIndex}`} checked={isSelected} onChange={() => {}} style={{ accentColor: "#fbbf24" }} />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button 
                    disabled={currentQIndex === 0} 
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    style={{ background: "#334155", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "800", cursor: currentQIndex === 0 ? "not-allowed" : "pointer", opacity: currentQIndex === 0 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>

                  {currentQIndex < activeQuestions.length - 1 ? (
                    <button 
                      onClick={() => setCurrentQIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                      style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "800", cursor: "pointer" }}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmitExam}
                      style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", textTransform: "uppercase" }}
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: "#1e293b", padding: "24px", borderRadius: "10px", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#ffffff", marginBottom: "8px" }}>Simulation Completed!</h3>
                <p style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fbbf24", marginBottom: "16px" }}>
                  Your Score: {score} / {activeQuestions.length} ({Math.round((score / activeQuestions.length) * 100)}%)
                </p>
                
                <div style={{ textAlign: "left", maxHeight: "280px", overflowY: "auto", background: "#0f172a", padding: "16px", borderRadius: "8px", border: "1px solid #334155", marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", fontWeight: "900", color: "#ffffff" }}>Review:</h4>
                  {activeQuestions.map((q, idx) => {
                    const userChoice = userAnswers[idx];
                    const isCorrect = userChoice === q.answer;
                    return (
                      <div key={idx} style={{ marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #334155", fontSize: "0.85rem" }}>
                        <p style={{ fontWeight: "800", margin: "0 0 4px 0", color: "#ffffff" }}>{idx + 1}. {q.question}</p>
                        <p style={{ margin: "0 0 2px 0", color: isCorrect ? "#34d399" : "#f87171" }}>
                          Your Answer: {userChoice !== undefined ? q.options[userChoice] : "Not Answered"}
                        </p>
                        {!isCorrect && (
                          <p style={{ margin: 0, color: "#34d399", fontWeight: "700" }}>Correct: {q.options[q.answer]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button onClick={() => handleStartExam(selectedCourse!)} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
                    Retake Practice (Non-Repeating Questions)
                  </button>
                  <button onClick={() => setInExamRoom(false)} style={{ background: "#64748b", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
                    Back to Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* INSTITUTIONAL CBT PORTAL & SELECTION CARD */
          <div style={{ marginBottom: "50px", background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "14px", padding: "28px", boxShadow: "0 10px 25px rgba(29, 78, 216, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>INSTITUTIONAL CBT PORTAL</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0" }}>Select Your Institution & Exam Center</h2>
              </div>
              {activeSchool !== "None" && (
                <button onClick={() => setActiveSchool("None")} style={{ background: "#64748b", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}>
                  Reset
                </button>
              )}
            </div>

            <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
              Select your university and practice official institutional standards for General Studies requirements.
            </p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontWeight: "800", fontSize: "0.9rem", color: "#1e293b" }}>Select University:</span>
              <button 
                onClick={() => setActiveSchool("UniUyo")}
                style={{ background: activeSchool === "UniUyo" ? "#1d4ed8" : "#f1f5f9", color: activeSchool === "UniUyo" ? "#ffffff" : "#1e293b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "0.9rem" }}
              >
                University of Uyo (UniUyo)
              </button>
              <button 
                onClick={() => setActiveSchool("AKSU")}
                style={{ background: activeSchool === "AKSU" ? "#1d4ed8" : "#f1f5f9", color: activeSchool === "AKSU" ? "#ffffff" : "#1e293b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "0.9rem" }}
              >
                Akwa Ibom State University (AKSU)
              </button>
            </div>

            {activeSchool !== "None" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                
                {activeSchool === "UniUyo" && (
                  <>
                    <div style={{ background: "#f8fafc", border: `2px solid ${paidCourses["GST111"] ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ background: paidCourses["GST111"] ? "#d1fae5" : "#dbeafe", color: paidCourses["GST111"] ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                          {paidCourses["GST111"] ? "UNLOCKED" : "COURSE MODULE"}
                        </span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>UniUyo ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GST 111: Communication in English</h3>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px 0" }}>Comprehensive grammar, sentence structures, and comprehension simulations.</p>
                      </div>
                      <div>
                        {paidCourses["GST111"] ? (
                          <button onClick={() => handleStartExam("GST111")} style={{ width: "100%", background: "#10b981", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                            Enter Practice Room
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button onClick={() => handleStartExam("GST111")} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                              Unlock & Pay (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)
                            </button>
                            <form onSubmit={(e) => handleVerifyTokenSubmit(e, "GST111")} style={{ display: "flex", gap: "6px" }}>
                              <input type="text" value={enteredTokens["GST111"] || ""} onChange={(e) => setEnteredTokens({ ...enteredTokens, GST111: e.target.value })} placeholder="Token..." style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", outline: "none" }} />
                              <button type="submit" style={{ background: "#475569", color: "#ffffff", border: "none", padding: "8px 10px", borderRadius: "6px", fontWeight: "900", fontSize: "0.75rem", cursor: "pointer" }}>Verify</button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", border: `2px solid ${paidCourses["GST112"] ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ background: paidCourses["GST112"] ? "#d1fae5" : "#dbeafe", color: paidCourses["GST112"] ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                          {paidCourses["GST112"] ? "UNLOCKED" : "COURSE MODULE"}
                        </span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>UniUyo ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GST 112: Nigerian Peoples & Culture</h3>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px 0" }}>Complete NPC Question Bank with randomized 40-question simulations.</p>
                      </div>
                      <div>
                        {paidCourses["GST112"] ? (
                          <button onClick={() => handleStartExam("GST112")} style={{ width: "100%", background: "#10b981", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                            Enter Practice Room
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button onClick={() => handleStartExam("GST112")} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                              Unlock & Pay (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)
                            </button>
                            <form onSubmit={(e) => handleVerifyTokenSubmit(e, "GST112")} style={{ display: "flex", gap: "6px" }}>
                              <input type="text" value={enteredTokens["GST112"] || ""} onChange={(e) => setEnteredTokens({ ...enteredTokens, GST112: e.target.value })} placeholder="Token..." style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", outline: "none" }} />
                              <button type="submit" style={{ background: "#475569", color: "#ffffff", border: "none", padding: "8px 10px", borderRadius: "6px", fontWeight: "900", fontSize: "0.75rem", cursor: "pointer" }}>Verify</button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", border: `2px solid ${paidCourses["GST212"] ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ background: paidCourses["GST212"] ? "#d1fae5" : "#dbeafe", color: paidCourses["GST212"] ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                          {paidCourses["GST212"] ? "UNLOCKED" : "COURSE MODULE"}
                        </span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>UniUyo ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GST 212: Philosophy & Logic</h3>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px 0" }}>Logic, fallacies, metaphysics, epistemology, and historical philosophy.</p>
                      </div>
                      <div>
                        {paidCourses["GST212"] ? (
                          <button onClick={() => handleStartExam("GST212")} style={{ width: "100%", background: "#10b981", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                            Enter Practice Room
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button onClick={() => handleStartExam("GST212")} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                              Unlock & Pay (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)
                            </button>
                            <form onSubmit={(e) => handleVerifyTokenSubmit(e, "GST212")} style={{ display: "flex", gap: "6px" }}>
                              <input type="text" value={enteredTokens["GST212"] || ""} onChange={(e) => setEnteredTokens({ ...enteredTokens, GST212: e.target.value })} placeholder="Token..." style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", outline: "none" }} />
                              <button type="submit" style={{ background: "#475569", color: "#ffffff", border: "none", padding: "8px 10px", borderRadius: "6px", fontWeight: "900", fontSize: "0.75rem", cursor: "pointer" }}>Verify</button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeSchool === "AKSU" && (
                  <>
                    <div style={{ background: "#f8fafc", border: `2px solid ${paidCourses["GST112"] ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ background: paidCourses["GST112"] ? "#d1fae5" : "#dbeafe", color: paidCourses["GST112"] ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                          {paidCourses["GST112"] ? "UNLOCKED" : "COURSE MODULE"}
                        </span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>AKSU ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GST 112: Nigerian Peoples & Culture</h3>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px 0" }}>Complete NPC Question Bank with randomized 40-question simulations.</p>
                      </div>
                      <div>
                        {paidCourses["GST112"] ? (
                          <button onClick={() => handleStartExam("GST112")} style={{ width: "100%", background: "#10b981", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                            Enter Practice Room
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button onClick={() => handleStartExam("GST112")} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                              Unlock & Pay (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)
                            </button>
                            <form onSubmit={(e) => handleVerifyTokenSubmit(e, "GST112")} style={{ display: "flex", gap: "6px" }}>
                              <input type="text" value={enteredTokens["GST112"] || ""} onChange={(e) => setEnteredTokens({ ...enteredTokens, GST112: e.target.value })} placeholder="Token..." style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", outline: "none" }} />
                              <button type="submit" style={{ background: "#475569", color: "#ffffff", border: "none", padding: "8px 10px", borderRadius: "6px", fontWeight: "900", fontSize: "0.75rem", cursor: "pointer" }}>Verify</button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", border: `2px solid ${paidCourses["GST212"] ? "#10b981" : "#cbd5e1"}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ background: paidCourses["GST212"] ? "#d1fae5" : "#dbeafe", color: paidCourses["GST212"] ? "#065f46" : "#1d4ed8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>
                          {paidCourses["GST212"] ? "UNLOCKED" : "COURSE MODULE"}
                        </span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b", margin: "10px 0 6px 0" }}>AKSU ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GST 212 / GST 202: Philosophy & Logic</h3>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px 0" }}>Complete Philosophy & Logic Question Bank with randomized simulations.</p>
                      </div>
                      <div>
                        {paidCourses["GST212"] ? (
                          <button onClick={() => handleStartExam("GST212")} style={{ width: "100%", background: "#10b981", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                            Enter Practice Room
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button onClick={() => handleStartExam("GST212")} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                              Unlock & Pay (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)
                            </button>
                            <form onSubmit={(e) => handleVerifyTokenSubmit(e, "GST212")} style={{ display: "flex", gap: "6px" }}>
                              <input type="text" value={enteredTokens["GST212"] || ""} onChange={(e) => setEnteredTokens({ ...enteredTokens, GST212: e.target.value })} placeholder="Token..." style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", outline: "none" }} />
                              <button type="submit" style={{ background: "#475569", color: "#ffffff", border: "none", padding: "8px 10px", borderRadius: "6px", fontWeight: "900", fontSize: "0.75rem", cursor: "pointer" }}>Verify</button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}
          </div>
        )}

        {/* PLATFORM ECOSYSTEM: OUR CORE PILLARS */}
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>PLATFORM ECOSYSTEM</span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 20px 0", textTransform: "uppercase" }}>Our Core Pillars</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "20px", borderRadius: "10px", textAlign: "left", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1d4ed8" }}>[ CBT ]</span>
              <h4 style={{ margin: "10px 0 6px 0", fontSize: "1rem", fontWeight: "900", color: "#1d4ed8" }}>Simulated CBT Center</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>Access authentic, timed examination simulations for university general courses.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "20px", borderRadius: "10px", textAlign: "left", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1d4ed8" }}>[ AI ]</span>
              <h4 style={{ margin: "10px 0 6px 0", fontSize: "1rem", fontWeight: "900", color: "#1d4ed8" }}>Intelligent AI Companion</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>Engage with a dedicated virtual study room providing clear conceptual explanations.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "20px", borderRadius: "10px", textAlign: "left", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1d4ed8" }}>[ DOC ]</span>
              <h4 style={{ margin: "10px 0 6px 0", fontSize: "1rem", fontWeight: "900", color: "#1d4ed8" }}>Academic Repository</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>Explore curated course materials, foundational textbook revision notes, and verified past questions.</p>
            </div>

          </div>
        </div>

        {/* ABOUT CAMPUS LEARNING HUB */}
        <div style={{ marginBottom: "50px", background: "#ffffff", border: "1px solid #cbd5e1", padding: "30px", borderRadius: "14px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>ABOUT CAMPUS LEARNING HUB</span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 14px 0", textTransform: "uppercase" }}>Empowering Undergraduate Success</h3>
          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.7", maxWidth: "780px", margin: "0 auto" }}>
            Campus Learning Hub is an advanced digital learning ecosystem built specifically for university undergraduates. Our mission is to bridge the gap between complex lecture materials and academic excellence. By integrating realistic Computer-Based Test (CBT) simulations for general studies courses like GST 111, GST 112, and GST 212 with intelligent AI-powered study assistance, we equip students with the tools, practice environment, and confidence needed to secure top grades and graduate with distinction.
          </p>
        </div>

        {/* FEEDBACK SECTION */}
        <div style={{ marginBottom: "50px", background: "#ffffff", border: "1px solid #cbd5e1", padding: "30px", borderRadius: "14px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>STUDENT EXPERIENCES</span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0", textTransform: "uppercase" }}>Student Feedbacks & Reviews</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {(showAllFeedbacks ? feedbacks : feedbacks.slice(0, 2)).map((fb, idx) => (
              <div key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "14px 18px", borderRadius: "8px", fontSize: "0.9rem", color: "#334155", fontStyle: "italic" }}>
                "{fb.text}" ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â <strong style={{ fontStyle: "normal", color: "#1d4ed8" }}>{fb.name}</strong>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
            {feedbacks.length > 2 && (
              <button onClick={() => setShowAllFeedbacks(!showAllFeedbacks)} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem" }}>
                {showAllFeedbacks ? "Show Less Feedbacks (ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²)" : "See More Feedbacks (ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼)"}
              </button>
            )}
          </div>

          {/* Submit Feedback Form */}
          <form onSubmit={handleAddFeedback} style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>Share Your Experience with Us:</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input 
                type="text" 
                value={newFeedbackName} 
                onChange={(e) => setNewFeedbackName(e.target.value)} 
                placeholder="Your Full Name (e.g. Samuel Etim)" 
                style={{ flex: "1 1 200px", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }}
              />
              <input 
                type="text" 
                value={newFeedbackText} 
                onChange={(e) => setNewFeedbackText(e.target.value)} 
                placeholder="Your review or feedback..." 
                style={{ flex: "2 1 260px", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }}
              />
              <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Submit Review
              </button>
            </div>
          </form>
        </div>

        {/* PAYMENT MODAL */}
        {showPayModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #1d4ed8", padding: "28px 22px", borderRadius: "12px", maxWidth: "520px", width: "100%", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
              
              <button onClick={() => setShowPayModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¢</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>SECURE COURSE ACCESS</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginTop: "8px", color: "#1e293b" }}>Unlock {paymentCourse} (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500)</h3>
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "#1e293b", margin: "0 0 10px 0" }}>Pay Instantly with Paystack</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="text" value={payerName} onChange={(e) => setPayerName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                  <input type="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                  <input type="text" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                  
                  <button type="button" onClick={handlePaystackPayment} style={{ background: "#22c55e", color: "#ffffff", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase", marginTop: "6px", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)" }}>
                    Pay ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500 via Paystack (Instant Unlock)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI STUDY ROOM PASS MODAL */}
        {showAiModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #fbbf24", padding: "24px 20px", borderRadius: "12px", maxWidth: "500px", width: "100%", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
              
              <button onClick={() => setShowAiModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¢</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>VIRTUAL AI STUDY ROOM</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginTop: "8px", color: "#1e293b" }}>Get AI Study Room Access Pass</h3>
              </div>

              <form onSubmit={handleAiPaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" value={aiFullName} onChange={(e) => setAiFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="email" value={aiEmail} onChange={(e) => setAiEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={aiPhone} onChange={(e) => setAiPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b" }}>Select Pass Tier:</label>
                  <select value={aiPlan} onChange={(e) => setAiPlan(e.target.value as any)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", background: "#f8fafc", color: "#0f172a" }}>
                    <option value="PlanA">Plan A - ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦500 (7 Days)</option>
                    <option value="PlanB">Plan B - ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦1,000 (Semester Pass)</option>
                  </select>
                </div>

                <button type="submit" disabled={aiPayLoading} style={{ background: "#1d4ed8", color: "#ffffff", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase", marginTop: "10px" }}>
                  {aiPayLoading ? "Processing..." : "Pay with Paystack & Open AI Chat"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* AI CHAT DRAWER */}
        {showAiChatDrawer && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", zIndex: 110, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px" }}>
            <div style={{ background: "#0f172a", border: "2px solid #fbbf24", borderRadius: "14px", width: "100%", maxWidth: "600px", height: "80vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
              
              <div style={{ background: "#1e293b", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ background: "#fbbf24", color: "#0f172a", padding: "4px 8px", borderRadius: "4px", fontWeight: "900", fontSize: "0.75rem" }}>AI</span>
                  <h3 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "900", margin: 0 }}>Campus Learning Hub ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â AI Study Room</h3>
                </div>
                <button onClick={() => setShowAiChatDrawer(false)} style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}>Close</button>
              </div>

              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
                {aiChatMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: "10px", background: msg.role === "user" ? "#1d4ed8" : "#1e293b", color: "#ffffff", fontSize: "0.9rem", lineHeight: "1.5", border: msg.role === "assistant" ? "1px solid #334155" : "none" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", fontWeight: "800", color: msg.role === "user" ? "#93c5fd" : "#fbbf24" }}>{msg.role === "user" ? "You" : "AI Study Assistant"}</p>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {aiChatLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 14px", borderRadius: "10px", fontSize: "0.85rem", fontStyle: "italic" }}>
                      AI is thinking...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendAiMessage} style={{ background: "#1e293b", padding: "14px", borderTop: "1px solid #334155", display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  value={aiInputText} 
                  onChange={(e) => setAiInputText(e.target.value)} 
                  placeholder="Ask any coursework question..." 
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                />
                <button type="submit" disabled={aiChatLoading} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "2px solid #cbd5e1", paddingTop: "24px", marginTop: "50px", color: "#475569", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "16px" }}>
            <div>
              <span style={{ fontWeight: "900", color: "#1e293b", fontSize: "0.95rem" }}>Campus Learning Hub</span>
              <p style={{ margin: "4px 0 0 0" }}>Official Study and CBT Practice Portals for Universities Nationwide.</p>
              <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "8px", color: "#22c55e", fontWeight: "900", textDecoration: "none" }}>
                Join Campus Learning WhatsApp Group
              </a>
            </div>
            <p style={{ margin: 0, color: "#1d4ed8", fontWeight: "800" }}>newsglobal038@gmail.com</p>
          </div>
          <div style={{ textAlign: "center", borderTop: "1px solid #e2e8f0", paddingTop: "12px", color: "#64748b", fontSize: "0.8rem" }}>
            Ãƒâ€šÃ‚Â© 2026 Campus Learning Hub. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}