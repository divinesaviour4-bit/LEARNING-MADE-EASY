"use client";

import { useState, useEffect } from "react";
import { GST111_QUESTIONS, GST112_QUESTIONS, GST212_QUESTIONS } from "../data/aksu_gst212";

export default function CampusLearningHub() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedUni, setSelectedUni] = useState("UniUyo");
  const [selectedCourse, setSelectedCourse] = useState("GST 111");
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Study Assistant powered by OpenAI. Ask me anything about your university courses!" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Paystack / Payment state
  const [paymentEmail, setPaymentEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState({ name: "Full Semester Access", price: 2000, currency: "NGN" });

  useEffect(() => {
    let timer: any;
    if (examStarted && !examSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && examStarted && !examSubmitted) {
      submitExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, examSubmitted]);

  const getActiveQuestions = () => {
    if (selectedCourse === "GST 212" && selectedUni === "AKSU") return GST212_QUESTIONS;
    if (selectedCourse === "GST 112") return GST112_QUESTIONS;
    return GST111_QUESTIONS;
  };

  const startCbtExam = () => {
    if (!isUnlocked) {
      setActiveTab("pricing");
      return;
    }
    setExamStarted(true);
    setExamSubmitted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers({});
    setTimeLeft(900);
  };

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: option });
  };

  const submitExam = () => {
    let calculatedScore = 0;
    const questions = getActiveQuestions();
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setExamSubmitted(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiLoading) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, { role: "user", content: userMsg }] }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error connecting to AI." }]);
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please check your connection." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePaystackPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentEmail) {
      alert("Please enter your valid student email address for payment verification.");
      return;
    }
    
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_placeholder",
      email: paymentEmail,
      amount: selectedPlan.price * 100,
      currency: "NGN",
      callback: function (response: any) {
        alert("Payment successful! Reference: " + response.reference);
        setIsUnlocked(true);
        setActiveTab("cbt");
      },
      onClose: function () {
        alert("Transaction was not completed, window closed.");
      },
    });
    handler.openIframe();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <script src="https://js.paystack.co/v1/inline.js" async></script>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30">
              L
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              Campus Learning Hub
            </span>
          </div>
          <nav className="hidden md:flex space-x-1">
            {["home", "cbt", "ai-study", "pricing", "resources", "about", "contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize }
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <span>✨ Achieve A's In All Your Courses</span>
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
                  Master Your University Exams with <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">AI & CBT Simulations</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                  Built specifically for Nigerian undergraduates at UniUyo and AKSU. Access verified question banks, 15-minute mock CBT engines, and 24/7 personal AI tutoring.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <button onClick={() => setActiveTab("cbt")} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5">
                    Launch CBT Practice Center
                  </button>
                  <button onClick={() => setActiveTab("ai-study")} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold transition-all">
                    Open AI Study Room
                  </button>
                </div>
              </div>
            </section>

            {/* Platform Statistics / Trust Bar */}
            <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-indigo-400">10,000+</div>
                  <div className="text-sm text-slate-400 mt-1">Questions Answered</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-violet-400">95%</div>
                  <div className="text-sm text-slate-400 mt-1">Exam Pass Rate</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-pink-400">2 Unis</div>
                  <div className="text-sm text-slate-400 mt-1">UniUyo & AKSU Coverage</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">24/7</div>
                  <div className="text-sm text-slate-400 mt-1">AI Tutor Availability</div>
                </div>
              </div>
            </section>

            {/* Key Features Overview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything You Need to Graduate with Distinction</h2>
                <p className="text-slate-400 max-w-xl mx-auto">Designed by high-achieving student engineers to tackle difficult general studies and departmental courses.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xl font-bold">⚡</div>
                  <h3 className="text-xl font-bold">Timed CBT Engines</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Simulate exact school examination environments with automated countdown timers, randomized questions, and instant score evaluation.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl font-bold">🤖</div>
                  <h3 className="text-xl font-bold">OpenAI Personal Tutor</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Stuck on complex engineering, philosophy, or cultural concepts? Ask our integrated AI tutor for step-by-step breakdowns anytime.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/50 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center text-xl font-bold">🔒</div>
                  <h3 className="text-xl font-bold">Instant Paystack Access</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Secure, automated access token distribution using Paystack integration so you can unlock premium semester materials instantly.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "cbt" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold">Computer-Based Test (CBT) Center</h2>
              <p className="text-slate-400 text-sm">Practice under simulated examination conditions with randomized question banks.</p>
            </div>

            {!isUnlocked && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between">
                <span>🔒 CBT practice exams are locked. Complete semester payment to unlock.</span>
                <button onClick={() => setActiveTab("pricing")} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                  Unlock Now (₦2,000)
                </button>
              </div>
            )}

            {!examStarted ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Select University</label>
                    <select value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                      <option value="UniUyo">University of Uyo (UniUyo)</option>
                      <option value="AKSU">Akwa Ibom State University (AKSU)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Select Course</label>
                    <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                      <option value="GST 111">GST 111 - Communication in English</option>
                      <option value="GST 112">GST 112 - Logic, Philosophy and Human Existence</option>
                      {selectedUni === "AKSU" && <option value="GST 212">AKSU GST 212 - Nigerian Peoples and Culture</option>}
                    </select>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm space-y-1">
                  <div className="font-bold">Exam Rules:</div>
                  <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                    <li>Duration: 15 Minutes</li>
                    <li>Questions: Randomly generated from verified database</li>
                    <li>Instant score feedback upon completion</li>
                  </ul>
                </div>
                <button onClick={startCbtExam} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all">
                  {isUnlocked ? "Start Examination" : "Unlock Course to Start Exam"}
                </button>
              </div>
            ) : examSubmitted ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-3xl font-black">
                  {Math.round((score / getActiveQuestions().length) * 100)}%
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Exam Completed!</h3>
                  <p className="text-slate-400 text-sm mt-1">You scored {score} out of {getActiveQuestions().length} questions correctly.</p>
                </div>
                <button onClick={() => setExamStarted(false)} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">
                  Try Another Exam
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div className="text-sm font-bold text-slate-400">Question {currentQuestion + 1} of {getActiveQuestions().length}</div>
                  <div className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-mono font-bold">
                    Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold leading-relaxed">{getActiveQuestions()[currentQuestion].question}</h4>
                  <div className="space-y-3">
                    {getActiveQuestions()[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(option)}
                        className={w-full text-left p-4 rounded-xl border transition-all text-sm }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion((prev) => prev - 1)}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-sm font-semibold"
                  >
                    Previous
                  </button>
                  {currentQuestion < getActiveQuestions().length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestion((prev) => prev + 1)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={submitExam}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white"
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai-study" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold">AI Study Room</h2>
              <p className="text-slate-400 text-sm">Ask your personal AI tutor any course question for instant explanations.</p>
            </div>
            <div className="h-[500px] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={lex }>
                    <div className={max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed }>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-sm animate-pulse">
                      AI is thinking...
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about your courses..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100"
                />
                <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white transition-all">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold">Unlock Full Access via Paystack</h2>
              <p className="text-slate-400 text-sm">Secure your semester materials and unlimited CBT practice instantly.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xl font-bold">Semester Pass</h3>
                  <p className="text-slate-400 text-sm mt-1">Full access to all course question banks and AI tutoring.</p>
                </div>
                <div className="text-4xl font-black text-indigo-400">NGN 2,000 (7 Days)</div>
                <form onSubmit={handlePaystackPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Student Email Address</label>
                    <input
                      type="email"
                      required
                      value={paymentEmail}
                      onChange={(e) => setPaymentEmail(e.target.value)}
                      placeholder="student@uniuyo.edu.ng"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all shadow-lg shadow-indigo-600/30">
                    Pay with Paystack & Unlock AI
                  </button>
                </form>
              </div>
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">What You Get</h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center space-x-2"><span>✓</span><span>Complete UniUyo & AKSU Question Banks</span></li>
                    <li className="flex items-center space-x-2"><span>✓</span><span>Unlimited Timed CBT Practice Exams</span></li>
                    <li className="flex items-center space-x-2"><span>✓</span><span>24/7 Priority AI Tutor Access</span></li>
                    <li className="flex items-center space-x-2"><span>✓</span><span>Offline PDF Summary Downloads</span></li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
                  Verified & Secured by Paystack Nigeria
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold">Course Materials & Handouts</h2>
              <p className="text-slate-400 text-sm">Download verified semester notes and past questions.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {["GST 111 Course Handout & Summary", "GST 112 Logic & Philosophy Guide", "AKSU GST 212 Nigerian Peoples & Culture", "Engineering Mathematics Formula Sheet"].map((res, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{res}</h4>
                    <p className="text-xs text-slate-500 mt-1">PDF Format • Verified Note</p>
                  </div>
                  <button onClick={() => alert("Downloading resource...")} className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 font-semibold text-xs hover:bg-indigo-600/30">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold">About Campus Learning Hub</h2>
              <p className="text-slate-400 text-sm">Empowering Nigerian undergraduates through modern technology.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-slate-300 text-sm leading-relaxed">
              <p>Campus Learning Hub was built by student engineers to solve the common struggles of examination preparation in Nigerian tertiary institutions like the University of Uyo (UniUyo) and Akwa Ibom State University (AKSU).</p>
              <p>Our mission is to combine rigorous past question practice with artificial intelligence tutoring, making first-class academic performance accessible to every student.</p>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold">Contact & Support</h2>
              <p className="text-slate-400 text-sm">Need help with your account or payment? Reach out to our team.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Your Name</label>
                  <input type="text" placeholder="Saviour Bassey" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Your Message</label>
                  <textarea rows={4} placeholder="Describe your issue or feedback..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"></textarea>
                </div>
                <button onClick={() => alert("Message sent successfully! We will get back to you shortly.")} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all">
                  Send Support Message
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div>© 2026 Campus Learning Hub. Built for UniUyo & AKSU Undergraduates.</div>
          <div className="flex space-x-6">
            <button onClick={() => setActiveTab("about")} className="hover:text-white">About</button>
            <button onClick={() => setActiveTab("pricing")} className="hover:text-white">Pricing</button>
            <button onClick={() => setActiveTab("contact")} className="hover:text-white">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}