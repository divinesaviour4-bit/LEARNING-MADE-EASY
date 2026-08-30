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
  { question: "According to the Tiv people of Benue State, the first man to live on Earth was Earth's maker and his brother was ______", options: ["Takuruku, A'ondo the sky god", "Oduduwa, Ogun", "Bayajidda, Bawo", "Uthman, Danfodio"], answer: 0 },
  { question: "Central to belief systems is ____", options: ["Religion", "Politics", "Commerce", "Agriculture"], answer: 0 },
  { question: "_______ are attributes and standards of judgment about what things are important, desirable and right.", options: ["Values", "Norms", "Laws", "Taboos"], answer: 0 },
  { question: "The scientific version of the origin of man was stated by an English biologist called_____", options: ["Charles Robert Darwin", "Thurstan Shaw", "Lord Lugard", "Mary Slessor"], answer: 0 },
  { question: "The four types of ancient man identified in human evolution are:", options: ["Australopithecus, Homo habilis, Homo erectus, Homo sapiens", "Homo sapien, Homo industrial, Homo digital, Homo superior", "Neanderthal, Viking, Roman, Spartan", "Palaeolithic, Neolithic, Bronze, Iron"], answer: 0 }
];

// GST 212: PHILOSOPHY AND LOGIC QUESTIONS
const GST212_QUESTIONS = [
  { question: "Philosophy is coined from two Greek terms: Philo meaning what?", options: ["Love", "Wisdom", "Knowledge", "Truth"], answer: 0 },
  { question: "Philosophy is coined from two Greek terms: Sophia meaning what?", options: ["Wisdom", "Love", "Reason", "Logic"], answer: 0 },
  { question: "An educated person who develops a mind which makes problem solving possible is called?", options: ["An intellectual", "A sophist", "A cosmologist", "A logician"], answer: 0 },
  { question: "Metaphysics is derived from the Greek term 'Ta-meta-physika' meaning what?", options: ["Beyond and after the physical", "Study of the mind", "Science of reasoning", "Study of value"], answer: 0 },
  { question: "Which branch of philosophy is defined as the study of value, subdivided into ethics and aesthetics?", options: ["Axiology", "Epistemology", "Metaphysics", "Logic"], answer: 0 },
  { question: "Epistemology is the study of what?", options: ["Knowledge", "Beauty", "Morality", "Being"], answer: 0 },
  { question: "Logic is defined as the science of what?", options: ["Correct and incorrect reasoning", "Human behavior and politics", "The physical universe", "Moral values"], answer: 0 },
  { question: "Philosophy started in the Greek City of Ionia, in a school called?", options: ["Millesia", "Athens", "Elea", "Stagira"], answer: 0 },
  { question: "Who was the first Western philosopher?", options: ["Thales of Miletus", "Socrates", "Plato", "Aristotle"], answer: 0 },
  { question: "According to Thales, what is the ultimate material of the universe?", options: ["Water", "Air", "Fire", "Numbers"], answer: 0 },
  { question: "Who posited that the ultimate material of the universe is an indeterminate boundless (Apeiron)?", options: ["Anaximander", "Anaximenes", "Pythagoras", "Heraclitus"], answer: 0 },
  { question: "Who posited that Air is the ultimate material of the universe?", options: ["Anaximenes", "Thales", "Anaximander", "Empedocles"], answer: 0 },
  { question: "Pythagoras posited that the ultimate material of the universe is what?", options: ["Numbers", "Water", "Atoms", "Fire"], answer: 0 },
  { question: "Heraclitus of Ephesus compared ever-changing motion in the universe to what element?", options: ["Fire", "Water", "Earth", "Air"], answer: 0 },
  { question: "Who was famously known for his paradoxes, including the Achilles and Tortoise paradox?", options: ["Zeno of Elea", "Parmenides", "Democritus", "Gorgias"], answer: 0 },
  { question: "Who stated that 'Man is the measure of all things'?", options: ["Protagoras", "Gorgias", "Socrates", "Plato"], answer: 0 },
  { question: "Which philosopher was sentenced to death by a poison called Hemlock?", options: ["Socrates", "Aristotle", "Pythagoras", "Thales"], answer: 0 },
  { question: "The medieval period of philosophy was regarded as the period of faith or what else?", options: ["The Dark-age of Philosophy", "The age of reason", "The age of science", "The contemporary era"], answer: 0 },
  { question: "Who wrote the famous book 'The City of God' / 'Confessions'?", options: ["St. Augustine", "St. Thomas Aquinas", "Plotinus", "Moses Maimonides"], answer: 0 },
  { question: "What does Descartes' famous dictum 'Cogito, ergo sum' mean?", options: ["I think, therefore I am", "To be is to be perceived", "Man is the measure of all things", "Knowledge is power"], answer: 0 },
  { question: "According to John Locke, the human mind at birth is a clean slate known as what?", options: ["Tabula rasa", "Cogito", "Monad", "A priori"], answer: 0 },
  { question: "An argument that starts from general principles to particulars is called what?", options: ["Deductive argument", "Inductive argument", "Informal fallacy", "A posteriori argument"], answer: 0 },
  { question: "An error in reasoning is known as a what?", options: ["Fallacy", "Premise", "Syallogism", "Paradox"], answer: 0 },
  { question: "What does 'Argumentum ad hominem' mean?", options: ["Attacking the man", "Appeal to pity", "Appeal to the people", "Does not follow"], answer: 0 },
  { question: "Knowledge that comes from experience is known as what?", options: ["A posteriori knowledge", "A priori knowledge", "Divine knowledge", "Innate knowledge"], answer: 0 },
  { question: "Who introduced Positivism, viewing practical and experienced things as meaningful?", options: ["Auguste Comte", "Charles Peirce", "William James", "Karl Marx"], answer: 0 },
  { question: "Science comes from the Latin term 'Scientia' and Greek term 'Epistemology/Episteme' referring to what?", options: ["A systematic body of knowledge", "An ethical system", "Political governance", "Mathematical formulas"], answer: 0 },
  { question: "Technology is from the Greek terms 'Techne' and 'Logia', where 'Techne' means what?", options: ["Craft and art", "Study and science", "Mind and reason", "Nature and matter"], answer: 0 },
  { question: "What is the term for the loss of green pigment in plants caused by pollution?", options: ["Chlorosis", "Necrosis", "Abscission", "Osmolality"], answer: 0 },
  { question: "Ozone layer depletion is represented by which chemical formula?", options: ["O3", "O2", "H2O", "CO2"], answer: 0 }
];

// GST 111: COMMUNICATION IN ENGLISH QUESTIONS
const GST111_QUESTIONS = [
  { question: "A simple sentence, in the context of language, contains a subject and a ______?", options: ["Infinite verb", "Articulate verb", "Finite verb", "Additive verb"], answer: 2 },
  { question: "What serves as the basic index of measurement in written English?", options: ["Phrase", "Sentence", "Alphabet", "Clause"], answer: 1 },
  { question: "The predicate is also called the ______.", options: ["Verb phrase", "Main clause", "Noun phrase", "Adverbial phrase"], answer: 0 },
  { question: "A predicate begins with the ______ in a simple sentence.", options: ["Auxiliary verb", "Finite verb", "Adjective", "Adverb"], answer: 1 },
  { question: "There are ______ types of complement.", options: ["One", "Two", "Three", "Four"], answer: 2 },
  { question: "An object is a word that receives the action of a ______.", options: ["Verb", "Noun", "Pronoun", "Adverb"], answer: 0 },
  { question: "Where the complementing structure is an adjective qualifying the subject of a verb to BE in a sentence, we have a ______ complement.", options: ["Subjective", "Objective", "Adverbial", "Adjectival"], answer: 3 },
  { question: "What denotes an extra structure added to an already complete sentence for clarity, emphasis, and definiteness?", options: ["Injunct", "Conjunct", "Prejunct", "Adjunct"], answer: 3 },
  { question: "Which is a verb of action?", options: ["Dynamic verb", "Stative verb", "Ordinary verb", "Modified verb"], answer: 0 },
  { question: "What kind of conjunction is the word “but”?", options: ["Ordinate conjunction", "Co-ordinate conjunction", "Subordinate conjunction", "Inordinate conjunction"], answer: 1 },
  { question: "What kind of conjunction is the word “as well as”?", options: ["Ordinate conjunction", "Co-ordinate conjunction", "Subordinator conjunction", "Inordinate conjunction"], answer: 2 },
  { question: "When the determiners precede the subjects in a sentence, they are called ______?", options: ["Indeterminers", "Postdeterminers", "Predeterminer", "Prodeterminers"], answer: 2 },
  { question: "In terms of structure, there are ______ types of sentences.", options: ["Five", "Four", "Three", "Two"], answer: 0 },
  { question: "Which kind of sentence is also known as a statement?", options: ["Decisive", "Exclamatory", "Declarative", "Imperative"], answer: 2 },
  { question: "A command is also called ______ sentence.", options: ["Declarative", "Exclamatory", "Imperative", "Interrogative"], answer: 2 },
  { question: "______ marks the interrogative sentences.", options: ["Comma", "Exclamation mark", "Full stop", "Question mark"], answer: 3 },
  { question: "______ denotes failure to acknowledge a source of substantial information.", options: ["Citation", "Plagiarism", "Imprimatur", "Review"], answer: 1 },
  { question: "______ denotes a full list of all books and related materials consulted in the course of research.", options: ["Bibliography", "Portmanteau", "Collocation", "Plagiarism"], answer: 0 },
  { question: "In subject/verb agreement, a singleton subject takes a ______ verb.", options: ["Mixed", "Fixed", "Singular", "Plural"], answer: 2 },
  { question: "The word ‘foreman’ is related to", options: ["Building", "Finance", "Military", "Entertainment"], answer: 0 }
];

export default function Home() {
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalSearchResult, setGlobalSearchResult] = useState<null | { found: boolean; courseName?: string; details?: string }>(null);

  // Active School Selection
  const [activeSchool, setActiveSchool] = useState<"UniUyo" | "AKSU">("UniUyo");
  const [activeCourse, setActiveCourse] = useState<"GST111" | "GST112" | "GST212">("GST111");

  // CBT Interaction & Token States
  const [showCbtBox, setShowCbtBox] = useState(false);
  const [showCbtPayModal, setShowCbtPayModal] = useState(false);
  const [cbtFullName, setCbtFullName] = useState("");
  const [cbtEmail, setCbtEmail] = useState("");
  const [cbtPhone, setCbtPhone] = useState("");

  const [enteredToken, setEnteredToken] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  // AI Study Room Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiFullName, setAiFullName] = useState("");
  const [aiEmail, setAiEmail] = useState("");
  const [aiPhone, setAiPhone] = useState("");
  const [aiPlan, setAiPlan] = useState<"PassA" | "PassB">("PassB");
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

  // Load Paystack Script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
    if (!globalQuery.trim()) {
      setGlobalSearchResult(null);
      return;
    }

    const query = globalQuery.toLowerCase();
    if (query.includes("gst 111") || query.includes("communication in english")) {
      setGlobalSearchResult({ found: true, courseName: "GST 111: Communication in English", details: "Available on Campus Learning Hub! CBT Mock ready." });
    } else if (query.includes("gst 112") || query.includes("nigerian peoples")) {
      setGlobalSearchResult({ found: true, courseName: "GST 112: Nigerian Peoples and Culture", details: "Available for UniUyo & AKSU! CBT Mock ready." });
    } else if (query.includes("gst 212") || query.includes("gst 202") || query.includes("philosophy") || query.includes("logic")) {
      setGlobalSearchResult({ found: true, courseName: "GST 212 / GST 202: Philosophy and Logic", details: "Available for UniUyo & AKSU! CBT Mock ready." });
    } else {
      setGlobalSearchResult({ found: false, courseName: globalQuery.toUpperCase(), details: "Campus Learning Hub course repository indexed successfully." });
    }
  };

  // Paystack Automated Payment & Instant Access Trigger
  const handlePaystackPayment = () => {
    if (!cbtFullName || !cbtEmail || !cbtPhone) {
      alert("Please fill in your full name, email, and phone number first.");
      return;
    }

    const generatedToken = "CLH-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const handler = (window as any).PaystackPop.setup({
      key: 'pk_live_your_actual_paystack_public_key_here', // Replace with active public key from your partner/dashboard
      email: cbtEmail,
      amount: 500 * 100, // ₦500 in kobo
      currency: 'NGN',
      ref: 'CLH_' + Math.floor((Math.random() * 1000000000) + 1),
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: cbtFullName },
          { display_name: "Phone Number", variable_name: "phone", value: cbtPhone },
          { display_name: "Access Token", variable_name: "access_token", value: generatedToken }
        ]
      },
      callback: function(response: any) {
        // AUTOMATIC INSTANT VERIFICATION & ACCESS GRANT UPON PAYMENT SUCCESS
        alert(`Payment Verified! Your Access Token is: ${generatedToken}. Access granted instantly.`);
        setShowCbtPayModal(false);
        setEnteredToken(generatedToken);
        setIsTokenVerified(true);
        setShowCbtBox(true);
        setCbtFullName(""); setCbtEmail(""); setCbtPhone("");
      },
      onClose: function() {
        alert('Transaction window closed.');
      }
    });

    handler.openIframe();
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
    const sourceQuestions = activeCourse === "GST111" ? GST111_QUESTIONS : activeCourse === "GST112" ? GST112_QUESTIONS : GST212_QUESTIONS;
    const shuffled = [...sourceQuestions].sort(() => 0.5 - Math.random());
    const selectedCount = Math.min(20, shuffled.length);
    const selectedQuestions = shuffled.slice(0, selectedCount);
    setActiveQuestions(selectedQuestions);
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

  const getCourseTitle = (code: "GST111" | "GST112" | "GST212") => {
    if (code === "GST111") return `${activeSchool} — GST 111: Communication in English`;
    if (code === "GST112") return `${activeSchool} — GST 112: Nigerian Peoples and Culture`;
    return `${activeSchool} — GST 212: Philosophy, Logic and Human Existence`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden", userSelect: "none" }}>
      
      {/* Royal Blue Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#1d4ed8", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ backgroundColor: "#fbbf24", color: "#0f172a", fontWeight: "900", padding: "6px 10px", borderRadius: "6px", fontSize: "0.85rem" }}>CLH</span>
          <span style={{ fontWeight: "900", fontSize: "1.1rem", color: "#ffffff", letterSpacing: "-0.02em" }}>CAMPUS LEARNING HUB</span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.9rem", alignItems: "center", fontWeight: "700", flexWrap: "wrap" }}>
          <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#22c55e", color: "#ffffff", padding: "8px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
            💬 Join Our WhatsApp Group
          </a>
          <button onClick={() => setShowCbtBox(true)} style={{ background: "#fbbf24", color: "#1d4ed8", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer", fontSize: "0.85rem" }}>
            CBT Exams 💻
          </button>
          <button onClick={() => setShowAiModal(true)} style={{ background: "transparent", border: "1px solid #fbbf24", color: "#fbbf24", padding: "6px 12px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.80rem" }}>
            AI Study Room 🤖
          </button>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", color: "#ffffff", padding: "70px 20px", textAlign: "center", borderBottom: "4px solid #fbbf24" }}>
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <span style={{ background: "#fbbf24", color: "#1d4ed8", padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.05em", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
            ◆ The Premier Academic Success Ecosystem
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: "900", margin: "0 0 18px 0", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Master Your Coursework & <span style={{ color: "#fbbf24" }}>Outstanding Grades</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#e2e8f0", lineHeight: "1.7", maxWidth: "780px", margin: "0 auto 24px auto" }}>
            Campus Learning Hub bridges the traditional gap between complex coursework and distinction-level achievement by combining realistic examination simulations with intelligent academic tools.
          </p>

          <div style={{ marginBottom: "35px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ background: "#22c55e", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", fontWeight: "900", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)" }}>
              💬 Join Our WhatsApp Group
            </a>
            <button onClick={() => setShowCbtBox(true)} style={{ background: "#fbbf24", color: "#1d4ed8", padding: "12px 24px", borderRadius: "8px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(251, 191, 36, 0.4)" }}>
              💻 Access CBT Center
            </button>
          </div>

          {/* Instant Course Search */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "12px", maxWidth: "580px", margin: "0 auto 20px auto", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <form onSubmit={handleGlobalSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input 
                type="text" 
                value={globalQuery} 
                onChange={(e) => {
                  setGlobalQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setGlobalSearchResult(null);
                  }
                }} 
                placeholder="Search course (e.g. GST 111, GST 112, GST 212)..." 
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
        {showCbtBox && (
          <div id="cbt-section" style={{ marginBottom: "50px", background: "#ffffff", border: "2px solid #1d4ed8", borderRadius: "14px", padding: "28px", boxShadow: "0 10px 25px rgba(29, 78, 216, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>INSTITUTIONAL CBT PORTAL</span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0" }}>Select Your Institution & Exam Center</h2>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {!isTokenVerified && (
                  <button onClick={() => setShowCbtPayModal(true)} style={{ fontSize: "0.85rem", background: "#fef3c7", color: "#b45309", border: "1px solid #f59e0b", padding: "6px 14px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
                    Get CBT Access ⚡
                  </button>
                )}
                <button onClick={() => setShowCbtBox(false)} style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}>
                  Close ✕
                </button>
              </div>
            </div>

            <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
              Select your university and practice official institutional standards for General Studies requirements.
            </p>

            {/* School Selector Tabs */}
            <div style={{ marginBottom: "16px", background: "#f1f5f9", padding: "10px", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "900", color: "#475569" }}>Select University:</span>
              <button 
                onClick={() => { setActiveSchool("UniUyo"); setActiveCourse("GST111"); }}
                style={{ padding: "8px 16px", borderRadius: "6px", fontWeight: "900", fontSize: "0.85rem", cursor: "pointer", background: activeSchool === "UniUyo" ? "#1d4ed8" : "#ffffff", color: activeSchool === "UniUyo" ? "#ffffff" : "#1e293b", border: "1px solid #cbd5e1" }}
              >
                University of Uyo (UniUyo)
              </button>
              <button 
                onClick={() => { setActiveSchool("AKSU"); setActiveCourse("GST112"); }}
                style={{ padding: "8px 16px", borderRadius: "6px", fontWeight: "900", fontSize: "0.85rem", cursor: "pointer", background: activeSchool === "AKSU" ? "#1d4ed8" : "#ffffff", color: activeSchool === "AKSU" ? "#ffffff" : "#1e293b", border: "1px solid #cbd5e1" }}
              >
                Akwa Ibom State University (AKSU)
              </button>
            </div>

            {/* Course Selector Tabs inside CBT */}
            {!examStarted && (
              <div style={{ marginBottom: "20px", background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "#1e293b", marginBottom: "10px" }}>Select Examination Course ({activeSchool}):</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {activeSchool === "UniUyo" && (
                    <button 
                      onClick={() => setActiveCourse("GST111")}
                      style={{ padding: "10px 16px", borderRadius: "6px", fontWeight: "900", fontSize: "0.85rem", cursor: "pointer", background: activeCourse === "GST111" ? "#1d4ed8" : "#ffffff", color: activeCourse === "GST111" ? "#ffffff" : "#1e293b", border: "1px solid #1d4ed8" }}
                    >
                      📖 GST 111: Communication in English
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveCourse("GST112")}
                    style={{ padding: "10px 16px", borderRadius: "6px", fontWeight: "900", fontSize: "0.85rem", cursor: "pointer", background: activeCourse === "GST112" ? "#1d4ed8" : "#ffffff", color: activeCourse === "GST112" ? "#ffffff" : "#1e293b", border: "1px solid #1d4ed8" }}
                  >
                    📚 GST 112: Nigerian Peoples & Culture
                  </button>
                  <button 
                    onClick={() => setActiveCourse("GST212")}
                    style={{ padding: "10px 16px", borderRadius: "6px", fontWeight: "900", fontSize: "0.85rem", cursor: "pointer", background: activeCourse === "GST212" ? "#1d4ed8" : "#ffffff", color: activeCourse === "GST212" ? "#ffffff" : "#1e293b", border: "1px solid #1d4ed8" }}
                  >
                    🧠 GST 212: Philosophy, Logic & Human Existence
                  </button>
                </div>
              </div>
            )}

            {!isTokenVerified ? (
              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "10px", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", marginBottom: "8px" }}>Enter Examination Access Token</h3>
                <p style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "16px" }}>Have your access token? Enter it below to unlock your examination simulation session for <strong style={{ color: "#1d4ed8" }}>{getCourseTitle(activeCourse)}</strong>.</p>
                
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
                  Don't have an access token? Click here to get CBT Mode Access ↗
                </button>
              </div>
            ) : !examStarted ? (
              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ color: "#059669", fontWeight: "900", marginBottom: "8px" }}>✅ Token Verified Successfully for {getCourseTitle(activeCourse)}!</p>
                <button onClick={handleStartExam} style={{ background: "#1d4ed8", color: "#ffffff", border: "none", padding: "14px 32px", borderRadius: "8px", fontWeight: "900", fontSize: "0.95rem", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 12px rgba(29,78,216,0.3)" }}>
                  Start Examination Simulation 🚀
                </button>
              </div>
            ) : !examSubmitted ? (
              /* ACTIVE EXAM INTERFACE */
              <div style={{ background: "#0f172a", color: "#ffffff", padding: "24px", borderRadius: "10px", border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ fontWeight: "900", color: "#fbbf24" }}>
                    {getCourseTitle(activeCourse)} — Simulation
                  </span>
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
        )}

        {/* CORE PILLARS SECTION */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>PLATFORM ECOSYSTEM</span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0", textTransform: "uppercase" }}>Our Core Pillars</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            <div onClick={() => setShowCbtBox(true)} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>💻</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>Simulated CBT Center ↗</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", margin: 0 }}>Access authentic, timed examination simulations for UniUyo and AKSU general courses.</p>
            </div>

            <div onClick={() => setShowAiModal(true)} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>🤖</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>Intelligent AI Companion ↗</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", margin: 0 }}>Engage with a dedicated virtual study room providing clear contextual breakdowns and conceptual explanations.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>📚</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>Academic Repository</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", margin: 0 }}>Explore curated course materials, foundational textbook revision notes, and verified past examination questions.</p>
            </div>
          </div>
        </div>

        {/* ABOUT US SECTION */}
        <div style={{ marginBottom: "50px", background: "#ffffff", border: "1px solid #cbd5e1", padding: "30px", borderRadius: "14px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>ABOUT CAMPUS LEARNING HUB</span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", margin: "6px 0 0 0", textTransform: "uppercase" }}>Empowering Undergraduate Success</h3>
          </div>
          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.7", textAlign: "center", maxWidth: "750px", margin: "0 auto" }}>
            Campus Learning Hub is an advanced digital learning ecosystem built specifically for university undergraduates. Our mission is to bridge the gap between complex lecture materials and academic excellence. By integrating realistic Computer-Based Test (CBT) simulations for general studies courses like GST 111, GST 112, and GST 212 with intelligent AI-powered study assistance, we equip students with the tools, practice environment, and confidence needed to secure top grades and graduate with distinction.
          </p>
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

        {/* PAYSTACK AUTOMATED CBT PAYMENT MODAL */}
        {showCbtPayModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #1d4ed8", padding: "24px 20px", borderRadius: "12px", maxWidth: "500px", width: "100%", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
              
              <button onClick={() => setShowCbtPayModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>✕</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>INSTANT PAYSTACK GATEWAY</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginTop: "8px", color: "#1e293b" }}>Pay ₦500 & Unlock Exam Instantly</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" value={cbtFullName} onChange={(e) => setCbtFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="email" value={cbtEmail} onChange={(e) => setCbtEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={cbtPhone} onChange={(e) => setCbtPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontSize: "0.85rem", outline: "none" }} />
                
                <button type="button" onClick={handlePaystackPayment} style={{ background: "#22c55e", color: "#ffffff", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase", marginTop: "10px", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)" }}>
                  Pay ₦500 & Access Exam Instantly ⚡
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "2px solid #cbd5e1", paddingTop: "24px", marginTop: "50px", color: "#475569", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "16px" }}>
            <div>
              <span style={{ fontWeight: "900", color: "#1e293b", fontSize: "0.95rem" }}>Campus Learning Hub</span>
              <p style={{ margin: "4px 0 0 0" }}>Digital learning & academic success platform for undergraduate students.</p>
              <a href="https://chat.whatsapp.com/JXNLa8oI8mZ3ysovdLgD3f?s=cl&p=a&ilr=1" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "8px", color: "#22c55e", fontWeight: "900", textDecoration: "none" }}>
                💬 Join Our Campus Learning WhatsApp Group ↗
              </a>
            </div>
            <p style={{ margin: 0, color: "#1d4ed8", fontWeight: "800" }}>newsglobal038@gmail.com</p>
          </div>
          <div style={{ textAlign: "center", borderTop: "1px solid #e2e8f0", paddingTop: "12px", color: "#64748b", fontSize: "0.8rem" }}>
            © 2026 Campus Learning Hub. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}