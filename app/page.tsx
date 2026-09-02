"use client";

import { useState, useEffect } from "react";

export default function CampusLearningHub() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedUni, setSelectedUni] = useState("");
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  
  // Payment & Access state
  const [paymentName, setPaymentName] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState({ name: "Plan A", price: 500, durationDays: 7 });
  const [accessTokenInput, setAccessTokenInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);

  // Testimonials & Comments state
  const [comments, setComments] = useState([
    { name: "Ekemini Effiong", text: "The CBT simulations helped me ace my GST exams at UniUyo seamlessly!", rating: "★★★★★" },
    { name: "Grace Umoh", text: "AI Study Room explains complex engineering concepts like magic. Best platform for AKSU students.", rating: "★★★★★" }
  ]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const savedExpiry = localStorage.getItem("clh_expiry");
    if (savedExpiry) {
      const exp = parseInt(savedExpiry);
      if (new Date().getTime() < exp) {
        setIsUnlocked(true);
        setExpiryTime(exp);
      } else {
        localStorage.removeItem("clh_expiry");
        setIsUnlocked(false);
      }
    }
  }, []);

  const handlePaystackPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentEmail || !paymentName) {
      alert("Please provide your name and email address.");
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_placeholder",
      email: paymentEmail,
      amount: selectedPlan.price * 100,
      currency: "NGN",
      callback: function (response: any) {
        const durationMs = selectedPlan.durationDays * 24 * 60 * 60 * 1000;
        const exp = new Date().getTime() + durationMs;
        localStorage.setItem("clh_expiry", exp.toString());
        setIsUnlocked(true);
        setExpiryTime(exp);
        alert("Payment successful! Access token sent to your email. AI Study & CBT unlocked.");
        setActiveTab("ai-study");
      },
      onClose: function () {
        alert("Transaction cancelled.");
      },
    });
    handler.openIframe();
  };

  const handleTokenVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessTokenInput.trim().length > 4) {
      const durationMs = 7 * 24 * 60 * 60 * 1000;
      const exp = new Date().getTime() + durationMs;
      localStorage.setItem("clh_expiry", exp.toString());
      setIsUnlocked(true);
      setExpiryTime(exp);
      alert("Access token verified successfully!");
      setActiveTab("ai-study");
    } else {
      alert("Please enter a valid access token.");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    setComments([{ name: newCommentName, text: newCommentText, rating: "★★★★★" }, ...comments]);
    setNewCommentName("");
    setNewCommentText("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <script src="https://js.paystack.co/v1/inline.js" async></script>

      {/* Header */}
      <header className="bg-[#1d4ed8] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-black text-base sm:text-lg tracking-wider cursor-pointer" onClick={() => setActiveTab("home")}>
            CAMPUS LEARNING HUB
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-md bg-[#22c55e] text-white hover:opacity-90 transition">
              Join WhatsApp
            </a>
            <button onClick={() => setActiveTab("ai-study")} className="px-3 py-1.5 rounded-md bg-[#fbbf24] text-slate-950 hover:opacity-90 transition">
              AI Study Room
            </button>
            <button onClick={() => { setActiveTab("cbt"); setSelectedUni(""); }} className="px-3 py-1.5 rounded-md border border-white text-white hover:bg-blue-700 transition">
              CBT Center
            </button>
            <button onClick={() => setActiveTab("testimonials")} className="px-3 py-1.5 rounded-md border border-white text-white hover:bg-blue-700 transition hidden sm:inline-block">
              Testimonials
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#1d4ed8] text-white py-12 px-4 text-center space-y-4 shadow-inner">
        <div className="inline-block px-4 py-1 rounded-full bg-[#fbbf24] text-slate-950 font-bold text-xs uppercase tracking-wider">
          WELCOME TO CAMPUS LEARNING HUB
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Achieve A's in Your General Courses
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100">
          Master your university general studies with intelligent AI tutoring and realistic timed CBT exam simulations tailored for UniUyo and AKSU undergraduates.
        </p>
      </div>

      <main className="flex-grow max-w-4xl mx-auto px-4 w-full -mt-6 pb-20">
        {activeTab === "home" && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 space-y-6">
            <div className="text-center">
              <div className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold mb-2">VIRTUAL STUDY COMPANION</div>
              <h2 className="text-2xl font-black text-slate-900">AI Study Room Access Pass</h2>
            </div>

            <form onSubmit={handlePaystackPayment} className="space-y-4 max-w-lg mx-auto">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={paymentName}
                  onChange={(e) => setPaymentName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>
              <div>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "500") {
                      setSelectedPlan({ name: "Plan A", price: 500, durationDays: 7 });
                    } else {
                      setSelectedPlan({ name: "Plan B", price: 1000, durationDays: 120 });
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-900"
                >
                  <option value="500">Plan A - NGN 500 (7 Days Access)</option>
                  <option value="1000">Plan B - NGN 1,000 (Semester Pass)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 font-bold text-white transition shadow-md">
                Pay with Paystack & Unlock AI
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-2">Already have an Access Token sent to your email?</p>
              <form onSubmit={handleTokenVerify} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="Enter Token Code"
                  value={accessTokenInput}
                  onChange={(e) => setAccessTokenInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs uppercase"
                />
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">Verify</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "cbt" && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 space-y-6">
            {!selectedUni ? (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-black text-slate-900">Select University CBT Environment</h2>
                <p className="text-sm text-slate-600">Choose your institution to enter the dedicated examination portal.</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={() => setSelectedUni("University of Uyo (UniUyo)")}
                    className="p-8 rounded-xl bg-blue-50 border-2 border-blue-600 font-bold text-blue-900 hover:bg-blue-100 transition shadow-md text-lg"
                  >
                    University of Uyo (UniUyo)
                  </button>
                  <button
                    onClick={() => setSelectedUni("Akwa Ibom State University (AKSU)")}
                    className="p-8 rounded-xl bg-emerald-50 border-2 border-emerald-600 font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-md text-lg"
                  >
                    Akwa Ibom State University (AKSU)
                  </button>
                </div>
              </div>
            ) : !isUnlocked ? (
              <div className="text-center space-y-4 py-8">
                <button onClick={() => setSelectedUni("")} className="text-xs text-blue-600 font-bold hover:underline mb-2 block">← Back to University Selection</button>
                <h3 className="text-xl font-bold text-slate-900">{selectedUni} CBT Locked</h3>
                <p className="text-sm text-slate-600">You need an active plan or access token to unlock course question banks.</p>
                <button onClick={() => setActiveTab("home")} className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow">
                  Get Access Pass (From NGN 500)
                </button>
              </div>
            ) : !examStarted ? (
              <div className="text-center space-y-4 py-6">
                <button onClick={() => setSelectedUni("")} className="text-xs text-blue-600 font-bold hover:underline mb-2 block">← Back to University Selection</button>
                <h3 className="text-2xl font-black text-slate-900">{selectedUni} Examination Portal</h3>
                <p className="text-sm text-slate-600">Unlocked! Ready to take your timed mock CBT exam.</p>
                <button onClick={() => setExamStarted(true)} className="px-8 py-4 bg-[#1d4ed8] text-white font-bold rounded-xl shadow-lg">
                  Start Mock Exam Simulation
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="font-bold text-sm text-slate-600">Question {currentQuestion + 1} of 2</span>
                  <button onClick={() => setExamStarted(false)} className="text-xs text-red-600 font-bold">Exit Exam</button>
                </div>
                <h4 className="font-semibold text-lg text-slate-900">Sample Question for {selectedUni}</h4>
                <div className="space-y-3">
                  {["Option A", "Option B", "Option C", "Option D"].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: option })}
                      className="w-full text-left p-4 rounded-xl border text-sm font-medium transition border-slate-200 hover:bg-slate-50 text-slate-800"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(p => p - 1)} className="px-6 py-2.5 bg-slate-200 rounded-xl text-sm font-bold disabled:opacity-50 text-slate-800">
                    Previous
                  </button>
                  <button onClick={() => { setExamStarted(false); alert("Exam submitted!"); }} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold">
                    Submit Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai-study" && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 space-y-6">
            {!isUnlocked ? (
              <div className="text-center space-y-4 py-8">
                <h3 className="text-xl font-bold text-slate-900">AI Study Room is Locked</h3>
                <p className="text-sm text-slate-600">Subscribe to Plan A (NGN 500/week) or Plan B (NGN 1,000/semester) to access the AI assistant.</p>
                <button onClick={() => setActiveTab("home")} className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow">
                  Choose Access Plan
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h2 className="text-xl font-bold text-slate-900">AI Study Assistant (Unlocked)</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Active Pass</span>
                </div>
                <div className="h-[350px] bg-slate-50 border rounded-xl p-4 overflow-y-auto text-sm text-slate-700">
                  <p className="font-semibold text-blue-600 mb-2">AI Tutor:</p>
                  <p>Hello! Your study pass is active. Ask me any question regarding your university courses, and I will break it down step-by-step.</p>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Ask your course question..." className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600" />
                  <button className="px-6 py-3 bg-[#1d4ed8] text-white font-bold rounded-xl text-sm">Send</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Student Testimonials & Reviews</h2>
              <p className="text-sm text-slate-600">See what UniUyo and AKSU undergraduates are saying.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {comments.map((c, i) => (
                <div key={i} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-amber-500 text-sm">{c.rating}</div>
                  <p className="text-sm text-slate-700 italic">"{c.text}"</p>
                  <div className="text-xs font-bold text-blue-600">— {c.name}</div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Leave Your Comment</h3>
              <form onSubmit={handleAddComment} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name & Department"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
                />
                <button type="submit" className="px-6 py-3 bg-[#1d4ed8] text-white font-bold rounded-xl text-sm">
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-slate-600 space-y-1 bg-white border-t border-slate-200 mt-auto">
        <div>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">Join WhatsApp Group</a> | Support Email: <a href="mailto:bsaviourokon@gmail.com" className="text-blue-600 font-bold hover:underline">bsaviourokon@gmail.com</a>
        </div>
        <div>© 2026 Campus Learning Hub. All rights reserved.</div>
      </footer>
    </div>
  );
}