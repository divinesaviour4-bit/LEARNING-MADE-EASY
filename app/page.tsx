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

  // Courses State
  const [courses, setCourses] = useState<CourseMaterial[]>([]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    { name: "Saviour Bassey", department: "Electrical Engineering", comment: "LME helped me ace my past questions without stress. The platform is super smooth!" },
    { name: "Grace Okon", department: "Accounting", comment: "The ₦1,000 semester pass is totally worth it. All materials in one place." }
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", scrollBehavior: "smooth" }}>
      
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #1e293b", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "900", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem" }}>LME</span>
          <span style={{ fontWeight: "700", fontSize: "1.05rem", color: "#ffffff" }}>Learning Made Easy</span>
        </div>
        <div style={{ display: "flex", gap: "25px", fontSize: "0.9rem", alignItems: "center", fontWeight: "500" }}>
          <a href="#home" style={{ color: "#f8fafc", textDecoration: "none" }}>Home</a>
          <a href="#about" style={{ color: "#94a3b8", textDecoration: "none" }}>About Hub</a>
          <a href="#how-it-works" style={{ color: "#94a3b8", textDecoration: "none" }}>How It Works</a>
          <a href="#courses" style={{ color: "#94a3b8", textDecoration: "none" }}>Courses</a>
          <button onClick={() => setShowPricingModal(true)} style={{ backgroundColor: "#3b82f6", color: "#ffffff", padding: "9px 18px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
            Unlock Access ⚡
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Hero Section */}
        <div id="home" style={{ textAlign: "center", marginBottom: "60px", paddingTop: "20px" }}>
          <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "6px 16px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            ◆ The Ultimate Student Academic Companion
          </span>
          <h1 style={{ fontSize: "3.2rem", fontWeight: "900", marginTop: "20px", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: "1.15" }}>
            Master Your Courses & Exams <span style={{ color: "#3b82f6" }}>Without Stress</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.15rem", marginTop: "20px", lineHeight: "1.7", maxWidth: "720px", marginInline: "auto" }}>
            Learning Made Easy (LME) provides structured departmental lecture notes, verified past questions, and intelligent study tools tailored to help you excel in your university exams.
          </p>
          <div style={{ marginTop: "35px", display: "flex", gap: "15px", justifyContent: "center" }}>
            <a href="#courses" style={{ background: "#1e293b", color: "#ffffff", border: "1px solid #334155", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "0.95rem" }}>
              Explore Materials
            </a>
            <button onClick={() => setShowPricingModal(true)} style={{ background: "#3b82f6", color: "#ffffff", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)" }}>
              Get Access Now →
            </button>
          </div>
        </div>

        {/* Detailed Academic About Section */}
        <div id="about" style={{ background: "#1e293b", border: "1px solid #334155", padding: "40px", borderRadius: "20px", marginBottom: "60px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ffffff", marginBottom: "15px" }}>Why Choose Learning Made Easy (LME)?</h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.8", marginBottom: "20px" }}>
            Navigating university coursework can feel overwhelming due to scattered lecture notes, unclear curriculum guidelines, and a lack of structured past questions. LME bridges this gap by centralizing everything a student needs into one streamlined academic portal.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "25px" }}>
            <div style={{ background: "#0f172a", padding: "20px", borderRadius: "14px", border: "1px solid #334155" }}>
              <h4 style={{ color: "#60a5fa", fontSize: "1.05rem", marginBottom: "8px", marginTop: 0 }}>🎯 Focused Curriculum Review</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Our course guides align strictly with university standards, ensuring you focus on core topics that matter for exams.</p>
            </div>
            <div style={{ background: "#0f172a", padding: "20px", borderRadius: "14px", border: "1px solid #334155" }}>
              <h4 style={{ color: "#60a5fa", fontSize: "1.05rem", marginBottom: "8px", marginTop: 0 }}>💡 Smart AI Integration</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Our upcoming Gemini AI study room breaks down complex theories, solves past questions step-by-step, and answers your specific academic queries.</p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div id="how-it-works" style={{ marginBottom: "60px" }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ffffff", marginBottom: "10px", textAlign: "center" }}>How It Works</h3>
          <p style={{ color: "#94a3b8", fontSize: "1rem", textAlign: "center", marginBottom: "40px" }}>Get started in three simple steps.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "30px 20px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ background: "#0f172a", color: "#3b82f6", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "900", margin: "0 auto 15px auto", border: "2px solid #334155" }}>1</div>
              <h4 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "10px" }}>Find Your Course</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Browse our library of updated departmental materials and past questions.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "30px 20px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ background: "#0f172a", color: "#3b82f6", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "900", margin: "0 auto 15px auto", border: "2px solid #334155" }}>2</div>
              <h4 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "10px" }}>Choose a Plan</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Select the 7-day fast pass (₦500) or our highly recommended Full Semester Pass (₦1,000).</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "30px 20px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ background: "#0f172a", color: "#3b82f6", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "900", margin: "0 auto 15px auto", border: "2px solid #334155" }}>3</div>
              <h4 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "10px" }}>Unlock & Study</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Receive your secure access code via email to download notes and use the AI tutor.</p>
            </div>
          </div>
        </div>

        {/* DYNAMIC COURSE MATERIALS SECTION */}
        <div id="courses" style={{ marginBottom: "60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Available Course Materials</h3>
            <span style={{ fontSize: "0.75rem", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 12px", borderRadius: "6px", fontWeight: "700" }}>Updated for Semester</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {courses.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>Loading course materials from backend...</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} style={{ background: "#1e293b", border: "1px solid #334155", padding: "22px 24px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 10px", borderRadius: "6px", fontWeight: "700" }}>{course.course_code}</span>
                    <h4 style={{ margin: "8px 0 4px 0", fontSize: "1.05rem", color: "#ffffff", fontWeight: "700" }}>{course.course_name}</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", whiteSpace: "pre-line" }}>{course.description}</p>
                  </div>
                  <button onClick={() => setShowPricingModal(true)} style={{ background: "#3b82f6", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
                    Get Access 🔒
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TESTIMONIALS & REVIEWS SECTION */}
        <div id="reviews" style={{ marginBottom: "60px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h3 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>Trusted by Students Across Campus</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Read honest testimonials from students who use Learning Made Easy.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            {reviews.map((rev, index) => (
              <div key={index} style={{ background: "#1e293b", border: "1px solid #334155", padding: "24px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ color: "#f8fafc", fontSize: "0.95rem", fontStyle: "italic", margin: "0 0 15px 0", lineHeight: "1.6" }}>"{rev.comment}"</p>
                <p style={{ color: "#60a5fa", fontSize: "0.85rem", fontWeight: "700", margin: 0 }}>— {rev.name} <span style={{ color: "#94a3b8", fontWeight: "normal" }}>({rev.department})</span></p>
              </div>
            ))}
          </div>

          <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "25px", borderRadius: "20px" }}>
            <h4 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "15px", marginTop: 0 }}>Share Your Experience</h4>
            <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Your Full Name" required style={{ padding: "12px", borderRadius: "10px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                <input type="text" value={reviewerDept} onChange={(e) => setReviewerDept(e.target.value)} placeholder="Department / Level (e.g. 300L EEE)" style={{ padding: "12px", borderRadius: "10px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <textarea value={reviewerComment} onChange={(e) => setReviewerComment(e.target.value)} placeholder="Write your review here..." required rows={3} style={{ padding: "12px", borderRadius: "10px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none", resize: "vertical" }} />
              <button type="submit" style={{ background: "#334155", color: "#60a5fa", border: "1px solid #475569", padding: "10px 16px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" }}>
                Post Review
              </button>
            </form>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div id="faq" style={{ marginBottom: "60px" }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ffffff", marginBottom: "25px", textAlign: "center" }}>Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "14px" }}>
              <h4 style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 10px 0" }}>How long does manual verification take?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>Because payments are currently verified manually, it typically takes a few hours. Once confirmed, your unique access code will be sent to the email address you provided.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "14px" }}>
              <h4 style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 10px 0" }}>Can I download the materials to my phone or laptop?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>Yes! Once you verify your access code on the platform, you will unlock direct download links for all PDFs related to your selected course.</p>
            </div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "14px" }}>
              <h4 style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 10px 0" }}>What does the B1000 Semester Pass include?</h4>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>The B1000 plan is our best value. For just ₦1,000, you get uninterrupted access to your course materials and the AI study room for the entire semester (valid through October 31, 2026).</p>
            </div>
          </div>
        </div>

        {/* PRICING & ACCESS MODAL */}
        {showPricingModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", overflowY: "auto" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "35px", borderRadius: "24px", maxWidth: "600px", width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.6)" }}>
              
              <button onClick={() => setShowPricingModal(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>✕</button>

              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "800" }}>LME ACCESS & PRICING</span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: "800", marginTop: "10px", color: "#ffffff" }}>Unlock AI Study Room & Materials</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "5px" }}>Choose a plan, make your transfer, and submit your details to get your access code.</p>
              </div>

              {/* Pricing Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div onClick={() => setPlan("A500")} style={{ background: "#0f172a", border: plan === "A500" ? "2px solid #3b82f6" : "1px solid #334155", padding: "20px", borderRadius: "14px", cursor: "pointer" }}>
                  <span style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: "700" }}>PLAN A500</span>
                  <h4 style={{ fontSize: "1.3rem", color: "#ffffff", margin: "5px 0" }}>₦500</h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>7 Days Access Plan</p>
                </div>
                <div onClick={() => setPlan("B1000")} style={{ background: "#0f172a", border: plan === "B1000" ? "2px solid #3b82f6" : "1px solid #334155", padding: "20px", borderRadius: "14px", cursor: "pointer" }}>
                  <span style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: "700" }}>PLAN B1000 (BEST)</span>
                  <h4 style={{ fontSize: "1.3rem", color: "#ffffff", margin: "5px 0" }}>₦1,000</h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>Full Semester Pass</p>
                </div>
              </div>

              {/* Payment Registration Form */}
              <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "20px", borderRadius: "16px", marginBottom: "25px" }}>
                <div style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: "600", marginBottom: "12px", lineHeight: "1.5" }}>
                  <p style={{ margin: "0 0 4px 0" }}>Bank: <span style={{ color: "#60a5fa" }}>Fidelity Bank</span></p>
                  <p style={{ margin: "0 0 4px 0" }}>Account Number: <span style={{ color: "#ffffff", fontFamily: "monospace", fontSize: "1rem" }}>4568971753</span></p>
                  <p style={{ margin: 0 }}>Account Name: <span style={{ color: "#60a5fa" }}>Asuquo Deborah</span></p>
                </div>
                <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                  <input type="text" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} required placeholder="Bank Transaction Reference" style={{ padding: "12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                  <button type="submit" disabled={paymentLoading} style={{ background: "#3b82f6", color: "#ffffff", padding: "12px", borderRadius: "8px", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}>
                    {paymentLoading ? "Submitting..." : "Submit Payment for Verification"}
                  </button>
                </form>
              </div>

              {/* Access Verification Form */}
              <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "20px", borderRadius: "16px" }}>
                <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "10px", marginTop: 0 }}>Already have an Access Code? Verify here:</h4>
                {!isAuthorized ? (
                  <form onSubmit={handleAccessVerify} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="email" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} required placeholder="Your Email" style={{ padding: "12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                    <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required placeholder="Access Code (e.g. GST112-H9LTY)" style={{ padding: "12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none" }} />
                    <button type="submit" disabled={verifyLoading} style={{ background: "#334155", color: "#60a5fa", border: "1px solid #475569", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" }}>
                      {verifyLoading ? "Verifying..." : "Verify Access Code"}
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: "center", color: "#60a5fa" }}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "700" }}>Access Granted for {studentInfo?.full_name}!</p>
                    <button onClick={() => setShowPricingModal(false)} style={{ background: "#3b82f6", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                      Proceed to Platform →
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #1e293b", paddingTop: "40px", marginTop: "60px", color: "#94a3b8", fontSize: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px", marginBottom: "30px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "900", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}>LME</span>
                <span style={{ fontWeight: "700", color: "#ffffff", fontSize: "1rem" }}>Learning Made Easy</span>
              </div>
              <p style={{ fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>Empowering university students with structured course resources, verified past questions, and intelligent study tools.</p>
            </div>

            <div>
              <h5 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "12px", marginTop: 0 }}>Quick Links</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                <li><a href="#how-it-works" style={{ color: "#94a3b8", textDecoration: "none" }}>How It Works</a></li>
                <li><a href="#courses" style={{ color: "#94a3b8", textDecoration: "none" }}>Course Materials</a></li>
                <li><a href="#reviews" style={{ color: "#94a3b8", textDecoration: "none" }}>Student Reviews</a></li>
                <li><a href="#faq" style={{ color: "#94a3b8", textDecoration: "none" }}>FAQ</a></li>
              </ul>
            </div>

            <div>
              <h5 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "12px", marginTop: 0 }}>Official Support</h5>
              <p style={{ fontSize: "0.85rem", margin: "0 0 8px 0" }}>Need help with verification or tokens? Reach out to us:</p>
              <p style={{ fontSize: "0.9rem", color: "#60a5fa", fontWeight: "700", margin: 0 }}>newsglobal038@gmail.com</p>
            </div>
          </div>

          <div style={{ textAlign: "center", borderTop: "1px solid #1e293b", paddingTop: "20px", color: "#64748b", fontSize: "0.8rem" }}>
            &copy; 2026 Learning Made Easy (LME). All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
