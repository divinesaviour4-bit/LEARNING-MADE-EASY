"use client";

import { useState, useEffect } from "react";

// AKSU GST 112 QUESTIONS (30 non-repeating per session)
const GST112_QUESTIONS = [
  { question: "Amalgamation of Northern and Southern protectorate in Nigeria took place on ________ by a British man called _________", options: ["1st January 1914, Sir Frederick Lord Lugard", "1st October 1960, Sir James Robertson", "1914, Mungo Park", "1900, George Goldie"], answer: 0 },
  { question: "The Edo people were best known for their ability to build a strong kingdom known as ________", options: ["The Benin Empire", "The Oyo Empire", "The Kanem-Borno Empire", "The Sokoto Caliphate"], answer: 0 },
  { question: "The man Udo has projected that by the year 2050, this country will expand to _______ ethnic groups.", options: ["850", "250", "500", "1000"], answer: 0 },
  { question: "In the year ______ to ______ was the first census in Nigeria.", options: ["1952 - 1953", "1960 - 1961", "1914 - 1915", "1970 - 1971"], answer: 0 },
  { question: "The people of the _______ are believed to be the oldest surviving group in Nigeria.", options: ["Forest belt", "Savanna belt", "Coastal wetlands", "Sahel region"], answer: 0 },
  { question: "______ and ______ is the largest forest belt group.", options: ["Yoruba and Edo", "Hausa and Fulani", "Igbo and Efik", "Tiv and Nupe"], answer: 0 },
  { question: "The first person to have lived in Tiv was ______ and had two sons named ______ and _______", options: ["Takuruku, Ipusu and Ichongo", "Bayajidda, Bawo and Biram", "Oduduwa, Olofin and Oranyan", "Uthman, Bello and Abdullahi"], answer: 0 },
  { question: "The Nupe live in large nucleated villages and have daughter settlements, which consist of small farm outlets called _____", options: ["Tunga", "Sabon-gari", "Emirates", "Fadama"], answer: 0 },
  { question: "In addition to farming, the Hausa were and are still ______", options: ["Shrewd traders", "Fishermen", "Goldsmiths", "Carvers"], answer: 0 },
  { question: "_______ was given to Bayajidda by a community of blacksmith when he reached Daura.", options: ["A special sword", "A golden crown", "A shield", "A spear"], answer: 0 },
  { question: "With this ______, Bayajidda killed a troublesome snake which had prevented the people of Daura from drawing water.", options: ["Special sword", "Bow and arrow", "Magic charm", "Fire"], answer: 0 },
  { question: "The place made for migrant people by the Hausa is called______", options: ["Sabon-gari", "Tunga", "Emirate", "Gidan"], answer: 0 },
  { question: "Thurstan Shaw, a leading scholar in archaeology, categorized Nigerian history into how many epochs?", options: ["3 epochs (Early, Middle, Late Stone Age)", "2 epochs", "4 epochs", "5 epochs"], answer: 0 },
  { question: "In Nigeria, the earliest site of iron industry is _____", options: ["Nok culture on the Jos plateau", "Ife bronze site", "Igbo-Ukwu", "Oyo Ile"], answer: 0 },
  { question: "The date for the Nok culture is reported to be around _____", options: ["500 BC", "1000 AD", "1914", "300 AD"], answer: 0 },
  { question: "It was towards the end of the Acheulian period that _____ was discovered.", options: ["Fire", "Iron", "Bronze", "Electricity"], answer: 0 },
  { question: "In Nigeria, the areas around ______ and ______ is believed to have produced Acheulian products.", options: ["The Sahara and Jos plateau", "Lagos and Ibadan", "Port Harcourt and Calabar", "Enugu and Onitsha"], answer: 0 },
  { question: "The fundamental human rights are entrenched in ________ sections of the 1999 Nigerian constitution.", options: ["Section 33 - Section 46", "Section 1 - Section 10", "Section 100 - Section 110", "Section 50 - Section 60"], answer: 0 },
  { question: "The oldest religion in Nigeria is _____", options: ["African Traditional Religion (ATR)", "Christianity", "Islam", "Buddhism"], answer: 0 },
  { question: "The middle stone age covers a period between _____ and ______", options: ["35,000 BC and 12,999 BC", "500 BC and 1 AD", "1914 and 1960", "10,000 BC and 5,000 BC"], answer: 0 },
  { question: "It is believed that iron technology diffused from Nok to Yoruba land in ______ and Igbo land, specifically Afikpo and Nri.", options: ["300 BC", "1914 AD", "500 AD", "1804 AD"], answer: 0 },
  { question: "The Yoruba god of iron is called_____", options: ["Ogun", "Sango", "Esu", "Obatala"], answer: 0 },
  { question: "Igbo-Ukwu specialized in ______", options: ["Bronze work", "Iron smelting", "Pottery", "Wood carving"], answer: 0 },
  { question: "______ are rules or patterns of behavior.", options: ["Norms", "Values", "Institutions", "Mores"], answer: 0 },
  { question: "There are two approaches to the definition of norms namely:", options: ["The idealist approach and the behaviourist approach", "The legal and spiritual approach", "The traditional and modern approach", "The political and economic approach"], answer: 0 },
  { question: "According to the Tiv people of Benue State, the first man to live on Earth was ______ and his brother was ______", options: ["Takuruku, A'ondo the sky god", "Oduduwa, Ogun", "Bayajidda, Bawo", "Uthman, Danfodio"], answer: 0 },
  { question: "Central to belief systems is ____", options: ["Religion", "Politics", "Commerce", "Agriculture"], answer: 0 },
  { question: "_______ are attributes and standards of judgment about what things are important, desirable and right.", options: ["Values", "Norms", "Laws", "Taboos"], answer: 0 },
  { question: "The scientific version of the origin of man was stated by an English biologist called_____", options: ["Charles Robert Darwin", "Thurstan Shaw", "Lord Lugard", "Mary Slessor"], answer: 0 },
  { question: "The four types of ancient man identified in human evolution are:", options: ["Australopithecus, Homo habilis, Homo erectus, Homo sapiens", "Homo sapien, Homo industrial, Homo digital, Homo superior", "Neanderthal, Viking, Roman, Spartan", "Palaeolithic, Neolithic, Bronze, Iron"], answer: 0 }
];

export default function Home() {
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalSearchResult, setGlobalSearchResult] = useState<null | { found: boolean; courseName?: string; details?: string }>(null);

  // CBT Payment & Token States
  const [showCbtPayModal, setShowCbtPayModal] = useState(false);
  const [cbtFullName, setCbtFullName] = useState("");
  const [cbtEmail, setCbtEmail] = useState("");
  const [cbtPhone, setCbtPhone] = useState("");
  const [cbtTxnRef, setCbtTxnRef] = useState("");
  const [cbtPayLoading, setCbtPayLoading] = useState(false);

  const [enteredToken, setEnteredToken] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  // AI Study Room Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiFullName, setAiFullName] = useState("");
  const [aiEmail, setAiEmail] = useState("");
  const [aiPhone, setAiPhone] = useState("");
  const [aiPlan, setAiPlan] = useState<"A500" | "B1000">("B1000");
  const [aiTxnRef, setAiTxnRef] = useState("");
  const [aiPayLoading, setAiPayLoading] = useState(false);

  // CBT Exam Execution States
  const [examStarted, setExamStarted] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Testimonials State
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState([
    { name: "Saviour Bassey", department: "Electrical Engineering", comment: "Campus Learning Hub CBT mode gives you the exact feel of how real exams will be. Grabbed A's easily!" },
    { name: "Grace Okon", department: "Accounting", comment: "The AI Study Room explains complex university concepts brilliantly. Highly recommended!" }
  ]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerDept, setReviewerDept] = useState("");
  const [reviewerComment, setReviewerComment] = useState("");

  // Timer Effect for CBT
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && examStarted && !examSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalQuery.trim()) return;

    const query = globalQuery.toLowerCase();
    if (query.includes("gst 112") || query.includes("nigerian peoples")) {
      setGlobalSearchResult({ found: true, courseName: "GST 112: Nigerian Peoples and Culture", details: "Available on Campus Learning Hub! CBT Mock & AI Study Room ready." });
    } else {
      setGlobalSearchResult({ found: false, courseName: globalQuery.toUpperCase(), details: "Campus Learning Hub course repository indexed successfully." });
    }
  };

  const handleCbtPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cbtFullName || !cbtEmail || !cbtPhone || !cbtTxnRef) {
      alert("Please fill in all details and bank transaction reference.");
      return;
    }
    setCbtPayLoading(true);
    setTimeout(() => {
      setCbtPayLoading(false);
      alert("₦500 CBT payment submitted! Once verified by our team, your access token will be issued.");
      setShowCbtPayModal(false);
      setCbtFullName(""); setCbtEmail(""); setCbtPhone(""); setCbtTxnRef("");
    }, 800);
  };

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredToken.trim().length >= 5) {
      setIsTokenVerified(true);
      alert("Token verified successfully! You can now start your examination simulation.");
    } else {
      alert("Invalid access token. Please enter your verified access token.");
    }
  };

  const handleAiPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFullName || !aiEmail || !aiPhone || !aiTxnRef) {
      alert("Please fill in all details and bank transaction reference.");
      return;
    }
    setAiPayLoading(true);
    setTimeout(() => {
      setAiPayLoading(false);
      alert("AI Study Room access pass request submitted! Awaiting verification.");
      setShowAiModal(false);
      setAiFullName(""); setAiEmail(""); setAiPhone(""); setAiTxnRef("");
    }, 800);
  };

  const handleStartExam = () => {
    if (!isTokenVerified) {
      alert("Please input your verified access token to unlock this examination session.");
      return;
    }
    const shuffled = [...GST112_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected30 = shuffled.slice(0, 30);
    setActiveQuestions(selected30);
    setExamStarted(true);
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
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setExamSubmitted(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;
    setReviews([{ name: reviewerName, department: reviewerDept || "Undergraduate Student", comment: reviewerComment }, ...reviews]);
    setReviewerName(""); setReviewerDept(""); setReviewerComment("");
    alert("Testimonial posted successfully!");
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden", userSelect: "none" }}>
      
      {/* Royal Blue Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#1d4ed8", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ backgroundColor: "#fbbf24", color: "#0f172a", fontWeight: "900", padding: "6px 10px", borderRadius: "6px", fontSize: "0.85rem" }}>CLH</span>
          <span style={{ fontWeight: "900", fontSize: "1.1rem", color: "#ffffff", letterSpacing: "-0.02em" }}>CAMPUS LEARNING HUB</span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.9rem", alignItems: "center", fontWeight: "700" }}>
          <a href="#cbt-section" style={{ color: "#fbbf24", textDecoration: "none" }}>CBT Exams (₦500) 💻</a>
          <button onClick={() => setShowAiModal(true)} style={{ background: "transparent", border: "1px solid #fbbf24", color: "#fbbf24", padding: "6px 12px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>
            AI Study Room (₦500 / ₦1000) 🤖
          </button>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", color: "#ffffff", padding: "60px 20px", textAlign: "center", borderBottom: "4px solid #fbbf24" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ background: "#fbbf24", color: "#1d4ed8", padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.05em", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
            ◆ Premier Digital Academic Success Platform
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: "900", margin: "0 0 16px 0", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Master Your Coursework & <span style={{ color: "#fbbf24" }}>Achieve Distinction</span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#e2e8f0", lineHeight: "1.6", maxWidth: "700px", margin: "0 auto 30px auto" }}>
            Campus Learning Hub bridges the traditional gap between complex coursework and distinction-level achievement by combining realistic examination simulations with intelligent academic tools.
          </p>

          {/* Instant Course Search */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "12px", maxWidth: "580px", margin: "0 auto 20px auto", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <form onSubmit={handleGlobalSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input 
                type="text" 
                value={globalQuery} 
                onChange={(e) => setGlobalQuery(e.target.value)} 
                placeholder="Search course (e.g. GST 112)..." 
                style={{ flex: "1 1 260px", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }}
              />
              <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Search Course 🔎
              </button>
            </form>

            {globalSearchResult && (
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", background: globalSearchResult.found ? "#d1fae5" : "#fef3c7", border: `1px solid ${globalSearchResult.found ? "#10b981" : "#f59e0b"}`, textAlign: "left" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: "800", color: globalSearchResult.found ? "#065f46" : "#b45309", margin: "0 0 4px 0" }}>
                  {globalSearchResult.found ? `✅ ${globalSearchResult.courseName}` : `🔍 ${globalSearchResult.courseName}`}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#334155", margin: 0 }}>{globalSearchResult.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 16px", boxSizing: "border-box" }}>
        
        {/* CBT MODE EXAMS SECTION */}
        <div id="cbt-section" style={{ marginBottom: "50px", background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "14px", padding: "28px", boxShadow: "0 10px 25px rgba(29, 78, 216, 0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>SIMULATED CBT CENTER</span>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0" }}>Experience Authentic Examination Conditions</h2>
            </div>
            <button onClick={() => setShowCbtPayModal(true)} style={{ fontSize: "0.85rem", background: "#fef3c7", color: "#b45309", border: "1px solid #f59e0b", padding: "6px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
              Pay ₦500 for CBT Access ⚡
            </button>
          </div>

          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
            Access authentic, timed examination simulations that replicate official university testing environments, complete with structured navigation and immediate performance analytics.
          </p>

          {!isTokenVerified ? (
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "10px", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", marginBottom: "8px" }}>Enter Examination Access Token</h3>
              <p style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "16px" }}>Paid ₦500? Enter your verified access token below to unlock your examination simulation session.</p>
              
              <form onSubmit={handleVerifyToken} style={{ display: "flex", gap: "10px", maxWidth: "400px", margin: "0 auto 12px auto", flexWrap: "wrap" }}>
                <input 
                  type="text" 
                  value={enteredToken} 
                  onChange={(e) => setEnteredToken(e.target.value)} 
                  placeholder="Enter Access Token..." 
                  required 
                  style={{ flex: "1 1 200px", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }}
                />
                <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Verify Token 🔐
                </button>
              </form>

              <button onClick={() => setShowCbtPayModal(true)} style={{ background: "transparent", border: "none", color: "#1d4ed8", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}>
                Don't have a token yet? Click here to pay ₦500 ↗
              </button>
            </div>
          ) : !examStarted ? (
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "10px", textAlign: "center" }}>
              <p style={{ color: "#059669", fontWeight: "900", marginBottom: "8px" }}>✅ Token Verified Successfully!</p>
              <p style={{ color: "#475569", fontSize: "0.85rem", marginBottom: "16px" }}>Your session is ready: 30 Questions, 15-Minute Timer, Instant Scoring & Review.</p>
              <button onClick={handleStartExam} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "14px 32px", borderRadius: "8px", fontWeight: "900", fontSize: "0.95rem", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 12px rgba(29,78,216,0.3)" }}>
                Start Examination Simulation 🚀
              </button>
            </div>
          ) : !examSubmitted ? (
            /* ACTIVE EXAM INTERFACE */
            <div style={{ background: "#0f172a", color: "#ffffff", padding: "24px", borderRadius: "10px", border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
                <span style={{ fontWeight: "900", color: "#fbbf24" }}>GST 112: Nigerian Peoples and Culture — Simulation (30 Qs)</span>
                <span style={{ background: timeLeft < 120 ? "#ef4444" : "#1e293b", color: "#ffffff", padding: "6px 12px", borderRadius: "6px", fontWeight: "900", fontFamily: "monospace" }}>
                  ⏳ Time Left: {formatTime(timeLeft)}
                </span>
              </div>

              {/* Question Status Grid */}
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

              {/* Current Question Box */}
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

              {/* Navigation Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button 
                  disabled={currentQIndex === 0} 
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  style={{ background: "#334155", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "800", cursor: currentQIndex === 0 ? "not-allowed" : "pointer", opacity: currentQIndex === 0 ? 0.5 : 1 }}
                >
                  ← Previous
                </button>

                {currentQIndex < activeQuestions.length - 1 ? (
                  <button 
                    onClick={() => setCurrentQIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                    style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "800", cursor: "pointer" }}
                  >
                    Next →
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitExam}
                    style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", textTransform: "uppercase" }}
                  >
                    Submit Exam 🏁
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* EXAM SUBMISSION & SCORE REVIEW */
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "10px", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1e293b", marginBottom: "8px" }}>Simulation Completed Successfully!</h3>
              <p style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1d4ed8", marginBottom: "16px" }}>
                Your Score: {score} / {activeQuestions.length} ({Math.round((score / activeQuestions.length) * 100)}%)
              </p>
              
              <div style={{ textAlign: "left", maxHeight: "300px", overflowY: "auto", background: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>Detailed Answer Review:</h4>
                {activeQuestions.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isCorrect = userChoice === q.answer;
                  return (
                    <div key={idx} style={{ marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
                      <p style={{ fontWeight: "800", margin: "0 0 4px 0", color: "#1e293b" }}>{idx + 1}. {q.question}</p>
                      <p style={{ margin: "0 0 2px 0", color: isCorrect ? "#059669" : "#dc2626" }}>
                        Your Answer: {userChoice !== undefined ? q.options[userChoice] : "Not Answered"} {isCorrect ? "✅" : "❌"}
                      </p>
                      {!isCorrect && (
                        <p style={{ margin: 0, color: "#059669", fontWeight: "700" }}>Correct Answer: {q.options[q.answer]}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={handleStartExam} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
                Retake Simulation (Fresh Non-Repeating Questions) 🔄
              </button>
            </div>
          )}
        </div>

        {/* CORE PILLARS SECTION */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>PLATFORM ECOSYSTEM</span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0", textTransform: "uppercase" }}>Our Core Pillars</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>💻</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>Simulated CBT Center</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", margin: 0 }}>Access authentic, timed examination simulations that replicate official university testing environments.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>🤖</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>Intelligent AI Companion</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", margin: 0 }}>Engage with a dedicated virtual study room providing clear contextual breakdowns and conceptual explanations.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>📚</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>Academic Repository</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", margin: 0 }}>Explore curated course materials, foundational textbook revision notes, and verified past examination questions.</p>
            </div>
          </div>
        </div>

        {/* WHY CHOOSE US SECTION */}
        <div style={{ marginBottom: "50px", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "30px", borderRadius: "14px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ background: "#1d4ed8", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>EXCELLENCE ASSURED</span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0", textTransform: "uppercase" }}>Why Choose Us</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "900", color: "#1d4ed8", margin: "0 0 6px 0" }}>🎯 Authentic Examination Simulation</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: "1.5" }}>Gain realistic practice that mirrors official testing conditions, building confidence and eliminating exam-day anxiety.</p>
            </div>
            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "900", color: "#1d4ed8", margin: "0 0 6px 0" }}>🤖 Intelligent Academic Support</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: "1.5" }}>Leverage advanced AI-assisted study tools designed to break down complex coursework into digestible explanations.</p>
            </div>
            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "900", color: "#1d4ed8", margin: "0 0 6px 0" }}>📚 Curated Course Materials</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: "1.5" }}>Access reliable, verified revision notes and past questions organized by subject matter experts to streamline revision.</p>
            </div>
            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "900", color: "#1d4ed8", margin: "0 0 6px 0" }}>⚡ Seamless & Secure Access</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: "1.5" }}>Enjoy a user-friendly platform with streamlined access passes, moving effortlessly from revision to mock exams.</p>
            </div>
          </div>
        </div>

        {/* STUDENT STORIES & TESTIMONIALS */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", marginBottom: "6px", textTransform: "uppercase" }}>Student Stories</h3>
            <p style={{ color: "#475569", fontSize: "0.9rem" }}>See what undergraduates are saying about Campus Learning Hub.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {displayedReviews.map((rev, index) => (
              <div key={index} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ color: "#1e293b", fontSize: "0.9rem", fontStyle: "italic", margin: "0 0 12px 0", lineHeight: "1.6" }}>"{rev.comment}"</p>
                <p style={{ color: "#1d4ed8", fontSize: "0.85rem", fontWeight: "900", margin: 0 }}>— {rev.name} <span style={{ color: "#475569", fontWeight: "normal" }}>({rev.department})</span></p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <button onClick={() => setShowAllReviews(!showAllReviews)} style={{ background: "transparent", border: "1px solid #cbd5e1", color: "#1d4ed8", padding: "8px 16px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>
              {showAllReviews ? "Show Less ▲" : "See More Testimonials ▼"}
            </button>
          </div>

          {/* Submit Testimonial Form */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h4 style={{ color: "#1e293b", fontSize: "1rem", marginBottom: "12px", marginTop: 0, textTransform: "uppercase", fontWeight: "900" }}>Share Your Student Story</h4>
            <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Your Full Name" required style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={reviewerDept} onChange={(e) => setReviewerDept(e.target.value)} placeholder="Department / Institution" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
              </div>
              <textarea value={reviewerComment} onChange={(e) => setReviewerComment(e.target.value)} placeholder="Write your story here..." required rows={3} style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none", resize: "vertical" }} />
              <button type="submit" style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                Submit Story 💬
              </button>
            </form>
          </div>
        </div>

        {/* ₦500 CBT PAYMENT & TOKEN MODAL */}
        {showCbtPayModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #1d4ed8", padding: "24px 20px", borderRadius: "12px", maxWidth: "500px", width: "100%", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
              
              <button onClick={() => setShowCbtPayModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>✕</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>CBT ACCESS PASS (₦500)</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginTop: "8px", color: "#1e293b" }}>Submit Payment & Request Access Token</h3>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.8rem", color: "#1e293b" }}>
                <p style={{ margin: "0 0 3px 0" }}>Bank: <span style={{ color: "#1d4ed8", fontWeight: "800" }}>Fidelity Bank</span></p>
                <p style={{ margin: "0 0 3px 0" }}>Account Number: <span style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: "800" }}>4568971753</span></p>
                <p style={{ margin: 0 }}>Account Name: <span style={{ color: "#1d4ed8", fontWeight: "800" }}>Asuquo Deborah</span></p>
              </div>

              <form onSubmit={handleCbtPaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" value={cbtFullName} onChange={(e) => setCbtFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="email" value={cbtEmail} onChange={(e) => setCbtEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={cbtPhone} onChange={(e) => setCbtPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={cbtTxnRef} onChange={(e) => setCbtTxnRef(e.target.value)} required placeholder="Bank Transaction Reference" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <button type="submit" disabled={cbtPayLoading} style={{ background: "#1d4ed8", color: "#ffffff", padding: "10px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  {cbtPayLoading ? "Submitting..." : "Submit CBT Payment Record"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* OPENAI AI STUDY ROOM PRICING MODAL (₦500 / ₦1000) */}
        {showAiModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #1d4ed8", padding: "24px 20px", borderRadius: "12px", maxWidth: "500px", width: "100%", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
              
              <button onClick={() => setShowAiModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>✕</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>AI STUDY ROOM ACCESS</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginTop: "8px", color: "#1e293b" }}>Unlock AI Study Room (₦500 or ₦1,000)</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
                <div onClick={() => setAiPlan("A500")} style={{ background: aiPlan === "A500" ? "#eff6ff" : "#f8fafc", border: aiPlan === "A500" ? "2px solid #1d4ed8" : "1px solid #cbd5e1", padding: "14px", borderRadius: "8px", cursor: "pointer", textAlign: "center" }}>
                  <span style={{ fontSize: "0.65rem", color: "#1d4ed8", fontWeight: "900" }}>1 WEEK PASS</span>
                  <h4 style={{ fontSize: "1.1rem", color: "#1e293b", margin: "4px 0" }}>₦500</h4>
                </div>
                <div onClick={() => setAiPlan("B1000")} style={{ background: aiPlan === "B1000" ? "#eff6ff" : "#f8fafc", border: aiPlan === "B1000" ? "2px solid #1d4ed8" : "1px solid #cbd5e1", padding: "14px", borderRadius: "8px", cursor: "pointer", textAlign: "center" }}>
                  <span style={{ fontSize: "0.65rem", color: "#1d4ed8", fontWeight: "900" }}>SEMESTER PASS</span>
                  <h4 style={{ fontSize: "1.1rem", color: "#1e293b", margin: "4px 0" }}>₦1,000</h4>
                </div>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.8rem", color: "#1e293b" }}>
                <p style={{ margin: "0 0 3px 0" }}>Bank: <span style={{ color: "#1d4ed8", fontWeight: "800" }}>Fidelity Bank</span></p>
                <p style={{ margin: "0 0 3px 0" }}>Account Number: <span style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: "800" }}>4568971753</span></p>
                <p style={{ margin: 0 }}>Account Name: <span style={{ color: "#1d4ed8", fontWeight: "800" }}>Asuquo Deborah</span></p>
              </div>

              <form onSubmit={handleAiPaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" value={aiFullName} onChange={(e) => setAiFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="email" value={aiEmail} onChange={(e) => setAiEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={aiPhone} onChange={(e) => setAiPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={aiTxnRef} onChange={(e) => setAiTxnRef(e.target.value)} required placeholder="Bank Transaction Reference" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <button type="submit" disabled={aiPayLoading} style={{ background: "#1d4ed8", color: "#ffffff", padding: "10px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  {aiPayLoading ? "Submitting..." : "Submit AI Room Payment"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "2px solid #cbd5e1", paddingTop: "24px", marginTop: "50px", color: "#475569", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <span style={{ fontWeight: "900", color: "#1e293b", fontSize: "0.95rem" }}>Campus Learning Hub</span>
              <p style={{ margin: "4px 0 0 0" }}>Digital learning & academic success platform for undergraduate students.</p>
            </div>
            <p style={{ margin: 0, color: "#1d4ed8", fontWeight: "800" }}>newsglobal038@gmail.com</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
