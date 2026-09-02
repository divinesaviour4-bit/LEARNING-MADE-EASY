"use client";

import { useState, useEffect } from "react";
import { AKSU_GST212_QUESTIONS as GST212_QUESTIONS, AKSU_GST212_QUESTIONS as GST111_QUESTIONS, AKSU_GST212_QUESTIONS as GST112_QUESTIONS } from "../data/aksu_gst212";

export default function CampusLearningHub() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedUni, setSelectedUni] = useState("UniUyo");
  const [selectedCourse, setSelectedCourse] = useState("GST 111");
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessTokenInput, setAccessTokenInput] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Study Assistant powered by OpenAI. Ask me anything about your university courses!" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState({ name: "Plan A", price: 500, currency: "NGN" });

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
    return GST212_QUESTIONS;
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
    if (!paymentEmail || !paymentName) {
      alert("Please fill in your name and email address for payment verification.");
      return;
    }
    
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_placeholder",
      email: paymentEmail,
      amount: selectedPlan.price * 100,
      currency: "NGN",
      callback: async function (response: any) {
        try {
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference, email: paymentEmail }),
          });
          const data = await res.json();
          if (data.success) {
            setGeneratedToken(data.accessToken);
            setIsUnlocked(true);
            alert("Payment verified successfully! Your Access Token is: " + data.accessToken);
            setActiveTab("cbt");
          } else {
            alert("Payment verification failed on server: " + (data.error || "Unknown error"));
          }
        } catch (err) {
          alert("Network error verifying payment.");
        }
      },
      onClose: function () {
        alert("Transaction was not completed, window closed.");
      },
    });
    handler.openIframe();
  };

  const handleTokenVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessTokenInput.trim().length > 4) {
      setIsUnlocked(true);
      alert("Access token accepted! CBT Center unlocked.");
      setActiveTab("cbt");
    } else {
      alert("Please enter a valid access token code.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <script src="https://js.paystack.co/v1/inline.js" async></script>

      {/* Header */}
      <header className="bg-[#2563eb] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-black text-lg tracking-wider cursor-pointer" onClick={() => setActiveTab("home")}>
            CAMPUS LEARNING HUB
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-md bg-[#22c55e] text-white text-xs font-bold hover:bg-green-600 transition">
              Join WhatsApp
            </a>
            <button onClick={() => setActiveTab("ai-study")} className="px-3 py-1.5 rounded-md bg-[#fbbf24] text-slate-900 text-xs font-bold hover:bg-amber-400 transition">
              AI Study Room
            </button>
            <button onClick={() => setActiveTab("cbt")} className="px-3 py-1.5 rounded-md border border-white text-white text-xs font-bold hover:bg-blue-700 transition">
              CBT Center
            </button>
            <button onClick={() => setActiveTab("pricing")} className="px-3 py-1.5 rounded-md border border-white text-white text-xs font-bold hover:bg-blue-700 transition">
              About & Testimonials
            </button>
            <button onClick={() => setActiveTab("contact")} className="px-3 py-1.5 rounded-md border border-white text-white text-xs font-bold hover:bg-blue-700 transition">
              Give Feedback
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-[#2563eb] text-white py-12 px-4 text-center space-y-4 shadow-inner">
        <div className="inline-block px-4 py-1 rounded-full bg-[#fbbf24] text-slate-950 font-bold text-xs uppercase tracking-wider">
          WELCOME TO CAMPUS LEARNING HUB
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Achieve A's in Your General Courses
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100">
          Master your university general studies with intelligent AI tutoring and realistic 40-question timed CBT exam simulations tailored for UniUyo and AKSU undergraduates.
        </p>
      </div>

      {/* Main Content Card Container */}
      <main className="flex-grow max-w-4xl mx-auto px-4 w-full -mt-6 pb-20">
        {activeTab === "home" && (
          <div className="bg-white rounded-2xl shadow-xl border border-amber-400 p-8 space-y-6">
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
                    const val = parseInt(e.target.value);
                    setSelectedPlan(val === 1000 ? { name: "Plan B", price: 1000, currency: "NGN" } : { name: "Plan A", price: 500, currency: "NGN" });
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-slate-900"
                >
                  <option value="500">Plan A - NGN 500 (7 Days)</option>
                  <option value="1000">Plan B - NGN 1,000 (Semester Pass)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg bg-[#2563eb] hover:bg-blue-700 font-bold text-white transition shadow-md">
                Pay with Paystack & Unlock AI
              </button>
            </form>
          </div>
        )}

        {activeTab === "cbt" && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6 mt-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Computer-Based Test Center</h2>
              <p className="text-slate-600 text-sm">Simulate your university CBT exams.</p>
            </div>

            {!isUnlocked && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
                <span>🔒 CBT is locked. Enter token or buy access.</span>
                <button onClick={() => setActiveTab("pricing")} className="px-4 py-2 rounded bg-amber-500 text-white font-bold text-xs">Unlock</button>
              </div>
            )}

            {!examStarted ? (
              <div className="space-y-4">
                <button onClick={startCbtExam} className="w-full py-4 rounded-xl bg-[#2563eb] text-white font-bold hover:bg-blue-700 transition">
                  {isUnlocked ? "Start Exam Now" : "Unlock to Start CBT"}
                </button>
              </div>
            ) : examSubmitted ? (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Exam Finished! Score: {score}/{getActiveQuestions().length}</h3>
                <button onClick={() => setExamStarted(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Try Again</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between font-bold text-sm text-slate-600">
                  <span>Question {currentQuestion + 1} of {getActiveQuestions().length}</span>
                  <span>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</span>
                </div>
                <h4 className="font-semibold text-lg">{getActiveQuestions()[currentQuestion].question}</h4>
                <div className="space-y-2">
                  {getActiveQuestions()[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      className={w-full text-left p-3 rounded-lg border text-sm }
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(p => p - 1)} className="px-4 py-2 bg-slate-200 rounded text-sm font-bold">Prev</button>
                  {currentQuestion < getActiveQuestions().length - 1 ? (
                    <button onClick={() => setCurrentQuestion(p => p + 1)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold">Next</button>
                  ) : (
                    <button onClick={submitExam} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-bold">Submit</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai-study" && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 mt-8">
            <h2 className="text-xl font-bold text-center">AI Study Room</h2>
            <div className="h-[400px] overflow-y-auto p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={lex }>
                  <div className={max-w-[80%] p-3 rounded-xl text-sm }>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask any course question..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
              />
              <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm">Send</button>
            </form>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6 mt-8 text-center">
            <h2 className="text-2xl font-bold">About & Testimonials</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">Campus Learning Hub is designed to help UniUyo and AKSU students pass their university exams with top grades through automated CBT testing and AI assistance.</p>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6 mt-8 text-center">
            <h2 className="text-2xl font-bold">Give Feedback & Support</h2>
            <p className="text-slate-600 text-sm">Contact admin directly via email or WhatsApp for any assistance.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-600 space-y-1">
        <div>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">Join WhatsApp Group</a> | Support Email: <a href="mailto:bsaviourokon@gmail.com" className="text-blue-600 font-bold hover:underline">bsaviourokon@gmail.com</a>
        </div>
        <div>© 2026 Campus Learning Hub. All rights reserved.</div>
      </footer>
    </div>
  );
}