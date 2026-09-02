"use client";

import { useState } from "react";

export default function CampusLearningHub() {
  const [selectedUni, setSelectedUni] = useState("");
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  
  const sampleQuestions = [
    {
      question: "Which of the following is a core general studies requirement in Nigerian universities?",
      options: ["Communication in English", "Quantum Physics", "Heavy Machinery Operation", "High Voltage Design"],
      answer: "Communication in English"
    },
    {
      question: "What does CBT stand for in modern educational examinations?",
      options: ["Computer-Based Test", "Central Board of Technology", "Campus Basic Training", "Core Bachelor Task"],
      answer: "Computer-Based Test"
    }
  ];

  const handleUniSelect = (uni: string) => {
    setSelectedUni(uni);
    setExamStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers({});
  };

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: option });
  };

  const submitExam = () => {
    let sc = 0;
    sampleQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) sc++;
    });
    setScore(sc);
    setExamStarted(false);
    alert("Exam submitted! Your score: " + sc + "/" + sampleQuestions.length);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <header className="bg-[#1d4ed8] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-black text-base sm:text-lg tracking-wider cursor-pointer" onClick={() => setSelectedUni("")}>
            CAMPUS LEARNING HUB
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-md bg-[#22c55e] text-white">Join WhatsApp</span>
            <span className="px-3 py-1.5 rounded-md bg-[#fbbf24] text-slate-950">AI Study Room</span>
            <span className="px-3 py-1.5 rounded-md border border-white text-white">CBT Center</span>
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
        {!selectedUni ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 text-center space-y-6">
            <h2 className="text-3xl font-black text-slate-900">Select Your University CBT Center</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Choose your institution to enter the dedicated examination environment and access course question banks.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <button
                onClick={() => handleUniSelect("University of Uyo (UniUyo)")}
                className="p-8 rounded-2xl bg-blue-50 border-2 border-blue-600 hover:bg-blue-100 transition shadow-md font-bold text-lg text-blue-900"
              >
                University of Uyo (UniUyo)
              </button>
              <button
                onClick={() => handleUniSelect("Akwa Ibom State University (AKSU)")}
                className="p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-600 hover:bg-emerald-100 transition shadow-md font-bold text-lg text-emerald-900"
              >
                Akwa Ibom State University (AKSU)
              </button>
            </div>
          </div>
        ) : !examStarted ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 text-center space-y-6">
            <button onClick={() => setSelectedUni("")} className="text-xs text-blue-600 font-bold hover:underline mb-2 block">
              ← Back to University Selection
            </button>
            <h2 className="text-2xl font-black text-slate-950">{selectedUni} Examination Portal</h2>
            <p className="text-slate-600 text-sm">Ready to begin your timed mock CBT simulation? Click start below.</p>
            <button
              onClick={() => setExamStarted(true)}
              className="px-8 py-4 rounded-xl bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-lg transition shadow-lg"
            >
              Start CBT Simulation Now
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-400 p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="font-bold text-sm text-slate-600">{selectedUni} - Question {currentQuestion + 1} of {sampleQuestions.length}</span>
              <button onClick={() => setExamStarted(false)} className="text-xs text-red-600 font-bold">Exit Exam</button>
            </div>
            
            <h4 className="font-semibold text-lg text-slate-900">{sampleQuestions[currentQuestion].question}</h4>
            
            <div className="space-y-3">
              {sampleQuestions[currentQuestion].options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    className={isSelected ? "w-full text-left p-4 rounded-xl border text-sm font-medium transition bg-blue-50 border-blue-600 text-blue-900 font-bold" : "w-full text-left p-4 rounded-xl border text-sm font-medium transition border-slate-200 hover:bg-slate-50 text-slate-800"}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(p => p - 1)}
                className="px-6 py-2.5 bg-slate-200 rounded-xl text-sm font-bold disabled:opacity-50 text-slate-800"
              >
                Previous
              </button>
              {currentQuestion < sampleQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(p => p + 1)}
                  className="px-6 py-2.5 bg-[#1d4ed8] text-white rounded-xl text-sm font-bold"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-slate-600">
        <div>© 2026 Campus Learning Hub. CBT Examination Environment.</div>
      </footer>
    </div>
  );
}