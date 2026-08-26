"use client";

import { useState, useEffect } from "react";

interface CourseMaterial {
  id: number;
  course_name: string;
  course_code: string;
  description: string;
  materials: any[];
}

interface Review {
  name: string;
  department: string;
  comment: string;
}

export default function Home() {
  // Payment Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courseCode, setCourseCode] = useState("GST112");
  const [plan, setPlan] = useState<"A500" | "B1000">("B1000");
  const [txnRef, setTxnRef] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Access Verification States
  const [verifyEmail, setVerifyEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Toggle Pricing Modal
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Show More Testimonials Toggle State
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Courses State
  const [courses, setCourses] = useState<CourseMaterial[]>([]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    { name: "Saviour Bassey", department: "Electrical Engineering", comment: "Campus Learning Made Easy helped me ace my past questions without stress. The platform is super smooth!" },
    { name: "Grace Okon", department: "Accounting", comment: "The ₦1,000 semester pass is totally worth it. All materials and past questions in one place." },
    { name: "Daniel Mensah", department: "Computer Science", comment: "The AI study schedule kept me organized throughout the semester. Highly recommended!" },
    { name: "Miriam Bello", department: "Mass Communication", comment: "Having structured general and departmental courses made studying for exams so much easier." },
    { name: "Emmanuel Effiong", department: "Mechanical Engineering", comment: "The verified past questions and step-by-step answers gave me the confidence I needed to score A's." }
  ]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerDept, setReviewerDept] = useState("");
  const [reviewerComment, setReviewerComment] = useState("");

  // Fetch courses on mount
  useEffect(() => {
    fetch("https://learning-made-easy-backend.onrender.com/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.courses) {
          setCourses(data.courses);
        }
      })
      .catch((err) => console.error("Failed to load courses", err));
  }, []);

  // Handle Payment Submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !txnRef) {
      alert("Please fill in all payment details and transaction reference.");
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await fetch("https://learning-made-easy-backend.onrender.com/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          course: courseCode,
          plan: plan,
          transaction_reference: txnRef
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message + "\nYour payment record has been created. Awaiting admin verification.");
        setFullName("");
        setEmail("");
        setPhone("");
        setTxnRef("");
        setShowPricingModal(false);
      } else {
        alert("Error creating payment record.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    } finally {
      setPaymentLoading(false);
    }
  };

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
        setIsAuthorized(true);
        setStudentInfo(data.student);
        alert(data.message);
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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) {
      alert("Please provide your name and review comment.");
      return;
    }
    setReviews([{ name: reviewerName, department: reviewerDept || "University Student", comment: reviewerComment }, ...reviews]);
    setReviewerName("");
    setReviewerDept("");
    setReviewerComment("");
    alert("Thank you! Your review has been posted successfully.");
  };

  // Determine how many reviews to display (First 3 by default, or all if toggled)
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>
      
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #1e293b", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "900", padding: "6px 10px", borderRadius: "8px", fontSize: "0.8rem" }}>CLME</span>
          <span style={{ fontWeight: "700", fontSize: "1rem", color: "#ffffff" }}>Campus Learning Made Easy</span>
        </div>
        <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", alignItems: "center", fontWeight: "500", flexWrap: "wrap" }}>
          <a href="#home" style={{ color: "#f8fafc", textDecoration: "none" }}>Home</a>
          <a href="#about" style={{ color: "#94a3b8", textDecoration: "none" }}>About</a>
          <a href="#how-it-works" style={{ color: "#94a3b8", textDecoration: "none" }}>How It Works</a>
          <a href="#courses" style={{ color: "#94a3b8", textDecoration: "none" }}>Courses</a>
          <button onClick={() => setShowPricingModal(true)} style={{ backgroundColor: "#3b82f6", color: "#ffffff", padding: "8px 14px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
            Unlock Access ⚡
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px 16px", boxSizing: "border-box" }}>
        
        {/* Hero Section */}
        <div id="home" style={{ textAlign: "center", marginBottom: "50px", paddingTop: "10px" }}>
          <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "6px 14px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", display: "inline-block" }}>
            ◆ Achieve A's in All Your Courses
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "900", marginTop: "20px", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: "1.15" }}>
            Master Your Exams With Verified <span style={{ color: "#3b82f6" }}>Past Questions & Answers</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", marginTop: "16px", lineHeight: "1.7", maxWidth: "720px", marginInline: "auto" }}>
            Campus Learning Made Easy provides structured general courses, faculty requirements, departmental notes, and comprehensive past questions with verified answers, backed by an AI study planner to help you conquer your exams without stress.
          </p>
          <div style={{ marginTop: "30px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#courses" style={{ background: "#1e293b", color: "#ffffff", border: "1px solid #334155", padding: "12px 20px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" }}>
              Explore Materials & PQAs
            </a>
            <button onClick={() => setShowPricingModal(true)} style={{ background: "#3b82f6", color: "#ffffff", padding: "12px 20px", borderRadius: "10px", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)" }}>
              Get Access Now →
            </button>
          </div>
        </div>

        {/* Detailed Academic About Section */}
        <div id="about" style={{ background: "#1e293b", border: "1px solid #334155", padding: "30px 20px", borderRadius: "20px", marginBottom: "50px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ffffff", marginBottom: "12px" }}>Structured for Excellence Across All Levels</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.8", marginBottom: "20px" }}>
            We provide structured resources covering general studies (GST), faculty core requirements, and specialized departmental courses. Beyond just reading notes, you get full access to verified past questions, step-by-step answers, and automated AI study schedules tailored to your exam timetable.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "20px" }}>
            <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px", border: "1px solid #334155" }}>
              <h4 style={{ color: "#60a5fa", fontSize: "1rem", marginBottom: "6px", marginTop: 0 }}>📚 Complete PQAs & Notes</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Access comprehensive lecture notes bundled together with accurate past questions and explained answers.</p>
            </div>
            <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px", border: "1px solid #334155" }}>
              <h4 style={{ color: "#60a5fa", fontSize: "1rem", marginBottom: "6px", marginTop: 0 }}>🤖 AI Study Schedule Generator</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Let our intelligent AI analyze your syllabus and build a custom, step-by-step study timetable to guarantee A's.</p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div id="how-it-works" style={{ marginBottom: "50px" }}>
          <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", marginBottom: "8px", textAlign: "center" }}>How It Works</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", textAlign: "center", marginBottom: "30px" }}>Achieve top grades in 3 simple steps.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "24px 16px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ background: "#0f172a", color: "#3b82f6", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: "900", margin: "0 auto 12px auto", border: "2px solid #334155" }}>1</div>
              <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "8px" }}>Select Your Courses</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Browse structured general, faculty, and departmental courses with past questions.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "24px 16px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ background: "#0f172a", color: "#3b82f6", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: "900", margin: "0 auto 12px auto", border: "2px solid #334155" }}>2</div>
              <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "8px" }}>Get AI Study Schedule</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Receive a customized AI timetable and instant explanations for complex topics.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "24px 16px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ background: "#0f172a", color: "#3b82f6", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: "900", margin: "0 auto 12px auto", border: "2px solid #334155" }}>3</div>
              <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "8px" }}>Ace Your Exams</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Download notes & PQAs securely and walk into your exam hall fully prepared.</p>
            </div>
          </div>
        </div>

        {/* DYNAMIC COURSE MATERIALS SECTION */}
        <div id="courses" style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Available Course Materials & PQAs</h3>
            <span style={{ fontSize: "0.75rem", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 10px", borderRadius: "6px", fontWeight: "700" }}>Updated for Semester</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {courses.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>Loading course materials and past questions from backend...</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} style={{ background: "#1e293b", border: "1px solid #334155", padding: "18px 20px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
                  <div style={{ flex: "1 1 250px" }}>
                    <span style={{ fontSize: "0.7rem", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>{course.course_code}</span>
                    <h4 style={{ margin: "6px 0 4px 0", fontSize: "1rem", color: "#ffffff", fontWeight: "700" }}>{course.course_name}</h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8", whiteSpace: "pre-line" }}>{course.description}</p>
                  </div>
                  <button onClick={() => setShowPricingModal(true)} style={{ background: "#3b82f6", color: "#ffffff", border: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
                    Unlock PQAs 🔒
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TESTIMONIALS & REVIEWS SECTION */}
        <div id="reviews" style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", marginBottom: "6px" }}>Trusted by Students Across Campus</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Read honest testimonials from students achieving A's using Campus Learning Made Easy.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {displayedReviews.map((rev, index) => (
              <div key={index} style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ color: "#f8fafc", fontSize: "0.9rem", fontStyle: "italic", margin: "0 0 12px 0", lineHeight: "1.6" }}>"{rev.comment}"</p>
                <p style={{ color: "#60a5fa", fontSize: "0.85rem", fontWeight: "700", margin: 0 }}>— {rev.name} <span style={{ color: "#94a3b8", fontWeight: "normal" }}>({rev.department})</span></p>
              </div>
            ))}
          </div>

          {/* See More Testimonials Toggle Button */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <button onClick={() => setShowAllReviews(!showAllReviews)} style={{ background: "transparent", border: "1px solid #334155", color: "#60a5fa", padding: "10px 20px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>
              {showAllReviews ? "Show Less Testimonials ▲" : "See More Testimonials ▼"}
            </button>
          </div>

          <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "16px" }}>
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "12px", marginTop: 0 }}>Share Your Experience</h4>
            <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Your Full Name" required style={{ padding: "10px 12px", borderRadius: "8px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="text" value={reviewerDept} onChange={(e) => setReviewerDept(e.target.value)} placeholder="Department / Level (e.g. 300L EEE)" style={{ padding: "10px 12px", borderRadius: "8px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
              </div>
              <textarea value={reviewerComment} onChange={(e) => setReviewerComment(e.target.value)} placeholder="Write your review here..." required rows={3} style={{ padding: "10px 12px", borderRadius: "8px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", resize: "vertical", width: "100%", boxSizing: "border-box" }} />
              <button type="submit" style={{ background: "#334155", color: "#60a5fa", border: "1px solid #475569", padding: "10px 14px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>
                Post Review
              </button>
            </form>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div id="faq" style={{ marginBottom: "50px" }}>
          <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", marginBottom: "20px", textAlign: "center" }}>Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "18px", borderRadius: "14px" }}>
              <h4 style={{ color: "#ffffff", fontSize: "1rem", margin: "0 0 8px 0" }}>Do you provide past questions and answers (PQAs)?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: "1.5" }}>Yes! We provide complete lecture materials paired with fully verified past questions and step-by-step answers for general, faculty, and departmental courses.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "18px", borderRadius: "14px" }}>
              <h4 style={{ color: "#ffffff", fontSize: "1rem", margin: "0 0 8px 0" }}>How does the AI study schedule work?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: "1.5" }}>Our AI examines your course materials and exam deadlines to create a personalized, day-by-day study timetable that ensures you cover everything without burning out.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "18px", borderRadius: "14px" }}>
              <h4 style={{ color: "#ffffff", fontSize: "1rem", margin: "0 0 8px 0" }}>What does the B1000 Semester Pass include?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: "1.5" }}>For just ₦1,000, you get full, uninterrupted semester access to all general and departmental notes, past questions & answers, and the AI study room.</p>
            </div>
          </div>
        </div>

        {/* PRICING & ACCESS MODAL */}
        {showPricingModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "24px 20px", borderRadius: "20px", maxWidth: "550px", width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.6)" }}>
              
              <button onClick={() => setShowPricingModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>✕</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "800" }}>CLME ACCESS & PRICING</span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginTop: "8px", color: "#ffffff" }}>Unlock AI Study Room, PQAs & Notes</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "4px" }}>Choose a plan, transfer to the account below, and submit your transaction details.</p>
              </div>

              {/* Pricing Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                <div onClick={() => setPlan("A500")} style={{ background: "#0f172a", border: plan === "A500" ? "2px solid #3b82f6" : "1px solid #334155", padding: "16px", borderRadius: "12px", cursor: "pointer" }}>
                  <span style={{ fontSize: "0.65rem", color: "#60a5fa", fontWeight: "700" }}>PLAN A500</span>
                  <h4 style={{ fontSize: "1.2rem", color: "#ffffff", margin: "4px 0" }}>₦500</h4>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>7 Days Access Plan</p>
                </div>
                <div onClick={() => setPlan("B1000")} style={{ background: "#0f172a", border: plan === "B1000" ? "2px solid #3b82f6" : "1px solid #334155", padding: "16px", borderRadius: "12px", cursor: "pointer" }}>
                  <span style={{ fontSize: "0.65rem", color: "#60a5fa", fontWeight: "700" }}>PLAN B1000 (BEST)</span>
                  <h4 style={{ fontSize: "1.2rem", color: "#ffffff", margin: "4px 0" }}>₦1,000</h4>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>Full Semester Pass</p>
                </div>
              </div>

              {/* Payment Registration Form */}
              <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "16px", borderRadius: "14px", marginBottom: "20px" }}>
                <div style={{ fontSize: "0.8rem", color: "#ffffff", fontWeight: "600", marginBottom: "10px", lineHeight: "1.5" }}>
                  <p style={{ margin: "0 0 3px 0" }}>Bank: <span style={{ color: "#60a5fa" }}>Fidelity Bank</span></p>
                  <p style={{ margin: "0 0 3px 0" }}>Account Number: <span style={{ color: "#ffffff", fontFamily: "monospace", fontSize: "0.95rem" }}>4568971753</span></p>
                  <p style={{ margin: 0 }}>Account Name: <span style={{ color: "#60a5fa" }}>Asuquo Deborah</span></p>
                </div>
                <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                  <input type="text" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} required placeholder="Bank Transaction Reference" style={{ padding: "10px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                  <button type="submit" disabled={paymentLoading} style={{ background: "#3b82f6", color: "#ffffff", padding: "10px", borderRadius: "8px", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "0.85rem", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)", width: "100%" }}>
                    {paymentLoading ? "Submitting..." : "Submit Payment for Verification"}
                  </button>
                </form>
              </div>

              {/* Access Verification Form */}
              <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "16px", borderRadius: "14px" }}>
                <h4 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "8px", marginTop: 0 }}>Already have an Access Code? Verify here:</h4>
                {!isAuthorized ? (
                  <form onSubmit={handleAccessVerify} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input type="email" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} required placeholder="Your Email" style={{ padding: "10px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                    <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required placeholder="Access Code (e.g. GST112-H9LTY)" style={{ padding: "10px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
                    <button type="submit" disabled={verifyLoading} style={{ background: "#334155", color: "#60a5fa", border: "1px solid #475569", padding: "9px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
                      {verifyLoading ? "Verifying..." : "Verify Access Code"}
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: "center", color: "#60a5fa" }}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "700", fontSize: "0.9rem" }}>Access Granted for {studentInfo?.full_name}!</p>
                    <button onClick={() => setShowPricingModal(false)} style={{ background: "#3b82f6", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>
                      Proceed to Platform →
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #1e293b", paddingTop: "30px", marginTop: "50px", color: "#94a3b8", fontSize: "0.85rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "25px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "900", padding: "4px 8px", borderRadius: "6px", fontSize: "0.7rem" }}>CLME</span>
                <span style={{ fontWeight: "700", color: "#ffffff", fontSize: "0.95rem" }}>Campus Learning Made Easy</span>
              </div>
              <p style={{ fontSize: "0.8rem", lineHeight: "1.5", margin: 0 }}>Empowering university students with structured general, faculty, and departmental courses, verified past questions & answers, and AI study schedules.</p>
            </div>

            <div>
              <h5 style={{ color: "#ffffff", fontSize: "0.9rem", marginBottom: "10px", marginTop: 0 }}>Quick Links</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem" }}>
                <li><a href="#how-it-works" style={{ color: "#94a3b8", textDecoration: "none" }}>How It Works</a></li>
                <li><a href="#courses" style={{ color: "#94a3b8", textDecoration: "none" }}>Course Materials & PQAs</a></li>
                <li><a href="#reviews" style={{ color: "#94a3b8", textDecoration: "none" }}>Student Reviews</a></li>
                <li><a href="#faq" style={{ color: "#94a3b8", textDecoration: "none" }}>FAQ</a></li>
              </ul>
            </div>

            <div>
              <h5 style={{ color: "#ffffff", fontSize: "0.9rem", marginBottom: "10px", marginTop: 0 }}>Official Support</h5>
              <p style={{ fontSize: "0.80rem", margin: "0 0 6px 0" }}>Need help with verification or tokens? Reach out to us:</p>
              <p style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "700", margin: 0 }}>newsglobal038@gmail.com</p>
            </div>
          </div>

          <div style={{ textAlign: "center", borderTop: "1px solid #1e293b", paddingTop: "16px", color: "#64748b", fontSize: "0.75rem" }}>
            &copy; 2026 Campus Learning Made Easy (CLME). All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
