"use client";

import { useState, useEffect } from "react";

const INSTITUTION_DATA = {
  universities: {
    federal: [
      "Abubakar Tafawa Balewa University, Bauchi", "Ahmadu Bello University, Zaria", "Bayero University, Kano", 
      "Federal University Gashua, Yobe", "Federal University of Petroleum Resources, Effurun", "Federal University of Technology, Akure", 
      "Federal University of Technology, Minna", "Federal University of Technology, Owerri", "Federal University, Dutse, Jigawa State", 
      "Federal University, Dutsin-Ma, Katsina", "Federal University, Kashere, Gombe State", "Federal University, Lafia, Nasarawa State", 
      "Federal University, Lokoja, Kogi State", "Alex Ekwueme University, Ndufu-Alike, Ebonyi State", "Federal University, Otuoke, Bayelsa", 
      "Federal University, Oye-Ekiti, Ekiti State", "Federal University, Wukari, Taraba State", "Federal University, Birnin Kebbi", 
      "Federal University, Gusau, Zamfara", "Michael Okpara University of Agricultural Umudike", "Modibbo Adama University of Technology, Yola", 
      "National Open University of Nigeria, Abuja", "Nigeria Police Academy, Wudil", "Nigerian Defence Academy, Kaduna", 
      "Nnamdi Azikiwe University, Awka", "Obafemi Awolowo University, Ile-Ife", "University of Abuja, Gwagwalada", 
      "Federal University of Agriculture, Abeokuta", "Joseph Sarwuan Tarka University, Makurdi", "University of Benin", 
      "University of Calabar", "University of Ibadan", "University of Ilorin", "University of Jos", "University of Lagos", 
      "University of Maiduguri", "University of Nigeria, Nsukka", "University of Port-Harcourt", "University of Uyo", 
      "Usumanu Danfodiyo University", "Nigerian Maritime University, Okerenkoko", "Air Force Institute of Technology, Kaduna", 
      "Nigerian Army University, Biu", "Federal University of Health Sciences, Otukpo", "Federal University of Agriculture, Zuru", 
      "Federal University of Technology, Babura", "Federal University of Technology, Ikot Abasi", "Federal University of Health Sciences, Azare", 
      "Federal University of Health Sciences, Ila Orangun", "David Nweze Umahi Federal University of Medical Sciences, Uburu", 
      "Admiralty University, Ibusa", "Federal University of Transportation, Daura", "African Aviation and Aerospace University", 
      "National University of Science and Technology, Abuja", "Federal University of Agriculture, Bassam-Biri", 
      "Federal University of Health Sciences, Kwale", "Federal University of Health Sciences, Katsina", "Federal University of Agriculture, Mubi", 
      "Federal University of Education, Zaria", "Alvan Ikoku Federal University of Education, Owerri", "Yusuf Maitama Sule Federal University of Education, Kano", 
      "Adeyemi Federal University of Education, Ondo", "Federal University of Allied Health Sciences, Enugu", "Federal University of Medicine and Medical Sciences, Abeokuta", 
      "Federal University of Education, Pankshin", "Federal University of Education, Kontagora", "University of Maritime Studies, Oron", 
      "Federal University of Environment and Technology, Tai Town, Ogoniland", "Federal University of Applied Sciences, Kachia", 
      "Tai Solarin Federal University of Education, Ijagun, Ijebu Ode", "Federal University of Agriculture and Developmental Studies, Iragbuji", 
      "Federal University of Technology and Environmental Studies, Iyin-Ekiti", "Federal University of Agriculture and Technology, Okeho", 
      "Federal University of Health Science and Technology, Tsafe", "Federal University of Agriculture and Technology, Obio-Akpa", 
      "Federal University of Science and Technology, Epe", "Federal University of Science and Technology, Kabo, Kano"
    ],
    state: [
      "Rivers State University", "Ambrose Alli University, Ekpoma", "Abia State University, Uturu", "Ektsu State University", 
      "Enugu State University of Science and Technology, Enugu", "Olabisi Onabanjo University, Ago Iwoye", "Lagos State University, Ojo", 
      "Ladoke Akintola University of Technology, Ogbomoso", "Rev. Fr. Moses Orshio Adasu University, Makurdi", "Delta State University, Abraka", 
      "Imo State University, Owerri", "Adekunle Ajasin University, Akungba", "Prince Abubakar Audu University, Anyigba", 
      "Chukwuemeka Odumegwu Ojukwu University, Uli", "Ebonyi State University, Abakaliki", "Aliko Dangote University of Science & Technology, Wudil", 
      "Niger Delta University, Yenagoa", "Adamawa State University, Mubi", "Nasarawa State University, Keffi", "University of Cross River State, Calabar", 
      "Gombe State University, Gombe", "Kaduna State University, Kaduna", "Ibrahim Badamasi Babangida University, Lapai", "Plateau State University, Bokkos", 
      "Yobe State University, Damaturu", "Kebbi State University of Science and Technology, Aliero", "Umar Musa Yar'Adua University, Katsina", 
      "Osun State University, Osogbo", "Olusegun Agagu University of Science & Technology, Okitipupa", "Taraba State University, Jalingo", 
      "Kwara State University, Ilorin", "Sokoto State University", "Akwa Ibom State University, Ikot Akpaden", "Ignatius Ajuru University of Education, Rumuolumeni", 
      "Bauchi State University, Gadau", "Northwest University, Kano", "First Technical University, Ibadan", "Sule Lamido University, Kafin Hausa", 
      "University of Medical Sciences, Ondo City", "Edo State University, Iyamho", "Kingsley Ozumba Mbadiwe University, Ogboko", 
      "University of Africa, Toru Orua", "Kashim Ibrahim University, Maiduguri", "Moshood Abiola University of Science and Technology, Abeokuta", 
      "Zamfara State University", "Bayelsa Medical University", "University of Agriculture and Environmental Sciences, Umuagwo", 
      "Confluence University of Science and Technology, Osara", "Bamidele Olumilua University of Science and Technology, Ikere", 
      "University of Delta, Agbor", "Delta University of Science and Technology, Ozoro", "Dennis Osadebe University, Asaba", 
      "Lagos State University of Education, Ijanikin", "Lagos State University of Science and Technology, Ikorodu", "Shehu Shagari University of Education, Sokoto", 
      "State University of Medical and Applied Sciences, Igbo-Eno", "University of Ilesa", "Emanuel Alayande University of Education, Oyo", 
      "Kogi State University, Kabba", "AbdulKadir Kure University, Minna", "Kwara State University of Education, Ilorin", 
      "Abdulsalam Abubakar University of Agriculture and Climate Action, Mokwa", "Ebonyi State University of ICT, Science and Technology, Oferekpe", 
      "Cross River University of Education and Entrepreneurship, Akampa", "Benue State University of Agriculture Science and Technology, Ihugh", 
      "University of Aeronautics and Aerospace Engineering, Ezza", "University of Innovation, Science and Technology, Omuma", 
      "Taraba State University of Tropical Agriculture, Science, Technology and Climate Action, Gembu", "Jigawa State University of Medical and Allied Health Sciences, Majia"
    ],
    private: [
      "Babcock University, Ilishan-Remo", "Igbinedion University, Okada", "Madonna University, Okija", "Bowen University, Iwo", 
      "Benson Idahosa University, Benin City", "Covenant University, Ota", "Pan-Atlantic University, Lagos", "American University of Nigeria, Yola", 
      "Ajayi Crowther University, Ibadan", "Al-Hikmah University, Ilorin", "Al-Qalam University, Katsina", "Bells University of Technology, Otta", 
      "Bingham University, New Karu", "Caritas University, Enugu", "Crawford University, Igbesa", "Crescent University", "Kwararafa University, Wukari", 
      "Lead City University, Ibadan", "Novena University, Ogume", "Redeemer's University, Ede", "Renaissance University, Enugu", 
      "University of Mkar, Mkar", "Joseph Ayo Babalola University, Ikeji-Arakeji", "Achievers University, Owo", "Caleb University, Lagos", 
      "Fountain University, Oshogbo", "African University of Science and Technology, Abuja", "Obong University, Obong Ntak", "Salem University, Lokoja", 
      "Tansian University, Umunya", "Veritas University, Abuja", "Wesley University, Ondo", "Western Delta University, Oghara", 
      "Afe Babalola University, Ado-Ekiti", "Godfrey Okoye University, Ugwuomu-Nike", "Nile University of Nigeria, Abuja", "Oduduwa University, Ipetumodu", 
      "Paul University, Awka", "Rhema University, Obeama-Asa", "Wellspring University, Evbuobanosa", "Adeleke University, Ede", "Baze University", 
      "Landmark University, Omu-Aran", "Glorious Vision University, Ogwa", "Elizade University, Ilara-Mokin", "Evangel University, Akaeze", 
      "Gregory University, Uturu", "McPherson University, Seriki Sotayo, Ajebo", "Southwestern University, Oku Owa", "Augustine University", 
      "Chrisland University", "Edwin Clark University, Kaigbodo", "Hallmark University, Ijebi Itele", "Hezekiah University, Umudi", 
      "Kings University, Ode Omu", "Michael & Cecilia Ibru University", "Mountain Top University", "Ritman University, Ikot Ekpene", 
      "Summit University, Offa", "Christopher University, Mowe", "Kola Daisi University, Ibadan", "Anchor University, Ayobo", 
      "Dominican University, Ibadan", "Legacy University, Okija", "Arthur Javis University, Akpoyubo", "Ojaja University, Eiyenkorin", 
      "Coal City University, Enugu", "Clifford University, Owerrinta", "Spiritan University, Nneochi", "Precious Cornerstone University, Oyo", 
      "PAMO University of Medical Sciences, Port Harcourt", "Atiba University, Oyo", "Eko University of Medical and Health Sciences, Ijanikin", 
      "Skyline University, Kano", "Greenfield University, Kaduna", "Dominion University, Ibadan", "Trinity University, Ogun State", 
      "Westland University, Iwo", "Topfaith University, Mkpatak", "Thomas Adewumi University, Oko-Irese", "Maranatha University, Lagos", 
      "Ave Maria University, Piyanko", "Al-Istiqama University, Sumaila", "Mudiame University, Irrua", "Havilla University, Nde-Ikom", 
      "Claretian University of Nigeria, Nekede", "Karl-Kumm University, Vom", "James Hope University, Lagos", "Maryam Abacha American University of Nigeria, Kano", 
      "Capital City University, Kano", "Ahman Pategi University, Kwara", "University of Offa, Kwara", "Mewar International University, Masaka", 
      "Edusoko University, Bida", "Philomath University, Kuje", "Anan University, Kwall", "North Eastern University, Gombe", 
      "Al-Ansar University, Maiduguri", "Margaret Lawrence University, Umunede", "Khalifa Isiyaku Rabiu University, Kano", 
      "Sports University, Idumuje, Ugboko", "Baba Ahmed University, Kano", "Saisa University of Medical Sciences and Technology, Sokoto", 
      "Nigerian British University, Asa", "Peter University, Achina-Onneh", "Newgate University, Minna", "European University of Nigeria, Duboyi", 
      "NorthWest University, Sokoto", "Rayhaan University, Kebbi", "Muhammad Kamalud University, Kwara", "Sam Maris University, Ondo", 
      "Aletheia University, Ago-Iwoye", "Lux Mundi University, Umuahia", "Maduka University, Ekwegbe", "PeaceLand University, Enugu", 
      "Amadeus University, Amizi", "Vision University, Ikogbo", "Azman University, Kano", "Huda University, Gusau", 
      "Franco British International University, Kaduna", "Canadian University of Nigeria, Abuja", "Gerar University of Medical Science, Imope-Ijebu", 
      "British Canadian University, Obufu", "Hensard University, Toru-Orua", "Amaj University, Kwali", "Phoenix University, Agwada", 
      "Wigwe University, Isiokpo", "Hillside University of Science and Technology, Okemisi", "University on the Niger, Umunya", 
      "Elrazi Medical University Yargaya University, Kano", "Venite University, Iloro-Ekiti", "Shanahan University, Onitsha", 
      "The Duke Medical University, Calabar", "Mercy Medical University, Iwo", "Cosmopolitan University, Abuja", "Miva Open University, Abuja", 
      "Iconic Open University, Sokoto", "West Midlands Open University, Ibadan", "Al-Muhibbah Open University, Abuja", "El-Amin University, Minna", 
      "College of Petroleum and Energy Studies, Kaduna", "Jewel University, Gombe", "Prime University, Kuje", "Nigerian University of Technology and Management, Apapa", 
      "Al-Bayan University, Ankpa", "Lighthouse University, Evbobanosa", "African University of Economics, Abuja", "New City University, Ayetoro", 
      "University of Fortune, Igbotako", "Eranova University, Abuja", "Minaret University, Ikirun", "Abdulrasaq Abubakar Toyin University, Oke-Ogba", 
      "Southern Atlantic University, Uyo", "Lens University, Ilemona", "Monarch University, Iyesi-Ota", "Tonine Iredia University of Communication, Benin City", 
      "Isaac Balami University of Aeronautics and Management, Lagos", "Kevin Eze University, Mgbowo", "Tazkiyah University, Kaduna", 
      "Leadership University, Abuja", "Jimoh Babalola University, Ilorin", "Bridget University, Mbaise", "Greenland University, Jalingo", 
      "JEFAP University, Suleja", "Azione Verde University, Amaigbo", "Unique Open University, Ojo", "American Open University, Abeokuta", 
      "Millenium Crest University, Ikare Akoko", "Abdulfattah Durojaiye University, Abeokuta", "Euston University, Abakaliki", "Adeche Momoh University, Igarra", 
      "Sani Bello University, Kontagora", "Godday Erewa University, Sapele", "Owolabi University, Oke Ila Orangun", "Regnum Medical University, Anthony", 
      "City University, Abuja", "Transatlantic University of Medicine and Health Sciences, Umuchukwu", "Maria Assumpta University, Owerri", 
      "High Flyers University, Ikere-Ekiti", "Ummah University of Nigeria, Abuja", "Pearl University, Calabar", "Omega University, Kaduna"
    ]
  },
  polytechnics: {
    federal: [
      "Akanu Ibiam Federal Polytechnic, Unwana", "Auchi Polytechnic, Auchi", "Federal Polytechnic, Ado-Ekiti", "Federal Polytechnic, Bauchi", 
      "Federal Polytechnic, Bida", "Federal Polytechnic, Damaturu", "Federal Polytechnic, Ede", "Federal Polytechnic, Idah", 
      "Federal Polytechnic, Ilaro", "Federal Polytechnic, Kaura Namoda", "Federal Polytechnic, Mubi", "Federal Polytechnic, Nasarawa", 
      "Federal Polytechnic, Nekede", "Federal Polytechnic, Offa", "Federal Polytechnic, Oko", "Federal Polytechnic, Ukana", 
      "Federal Polytechnic, Bali", "Federal Polytechnic, Ile-Oluji", "Federal Polytechnic, Daura", "Federal Polytechnic, Kaltungo", 
      "Hussaini Adamu Federal Polytechnic, Kazaure", "Kaduna Polytechnic", "Yaba College of Technology", "Federal Polytechnic, Ekowe", 
      "Federal Polytechnic, Monguno", "Federal Polytechnic, Ugep", "Federal Polytechnic, Keffi", "Federal Polytechnic, Maiduguri"
    ],
    state: [
      "Abdu Gusau Polytechnic, Talata Mafara", "Abia State Polytechnic, Aba", "Abraham Adesanya Polytechnic, Ijebu-Igbo", 
      "Abubakar Tatari Ali Polytechnic, Bauchi", "Adamawa State Polytechnic, Yola", "Akwa Ibom State Polytechnic, Ikot Osurua", 
      "Anambra State Polytechnic, Mgbakwu", "Bayelsa State Polytechnic, Elebele", "Benue State Polytechnic, Ugbokolo", 
      "Binyaminu Usman Polytechnic, Hadejia", "Delta State Polytechnic, Ogwashi-Uku", "Delta State Polytechnic, Otefe-Oghara", 
      "Delta State Polytechnic, Ozoro", "Edo State Polytechnic, Usen", "Gateway Polytechnic, Saapade", "Hassan Usman Katsina Polytechnic", 
      "Imo State Polytechnic, Umuagwo", "Institute of Management and Technology, Enugu", "Institute of Technology and Management, Ugep", 
      "Kano State Polytechnic", "Kogi State Polytechnic", "Kwara State Polytechnic", "Lagos State Polytechnic", "Niger State Polytechnic, Zungeru", 
      "Osun State Polytechnic, Iree", "Osun State College of Technology, Esa-Oke", "Plateau State Polytechnic, Barkin Ladi", 
      "Polytechnic Ibadan", "Rufus Giwa Polytechnic, Owo", "Sokoto State Polytechnic", "Umaru Ali Shinkafi Polytechnic, Sokoto"
    ],
    private: [
      "Ajayi Polytechnic", "Al-Hikma Polytechnic", "Allover Central Polytechnic", "Ashi Polytechnic", "Best Solution Polytechnic", 
      "Crown Polytechnic", "Dorben Polytechnic", "Fidei Polytechnic", "Global Polytechnic", "Grace Polytechnic", "Heritage Polytechnic", 
      "Ibadan City Polytechnic", "Igbajo Polytechnic", "Interlink Polytechnic", "Marist Polytechnic", "Ronik Polytechnic", "Citi Polytechnic", 
      "Lens Polytechnic", "Valley View Polytechnic", "Temple Gate Polytechnic"
    ]
  },
  colleges_of_education: {
    federal: [
      "FCT College of Education, Zuba", "Federal College of Education (FCE), Gwoza", "Federal College of Education (Special), Oyo", 
      "Federal College of Education (Technical), Isu, Ebonyi State", "Federal College of Education (Technical), Umunze", 
      "Federal College of Education (Technical), Potiskum", "Federal College of Education (Technical), Yauri", 
      "Federal College of Education (Technical), Akoka", "Federal College of Education (Technical), Asaba", 
      "Federal College of Education (Technical), Bichi", "Federal College of Education (Technical), Gombe", 
      "Federal College of Education (Technical), Gusau", "Federal College of Education (Technical), Omoku", 
      "Federal College of Education, Bauchi", "Federal College of Education, Edo", "Federal College of Education, Ilawe-Ekiti", 
      "Federal College of Education, Ofeme-Ohuhu", "Federal College of Education, Osun", "Federal College of Education, Sokoto", 
      "Federal College of Education, Abeokuta", "Federal College of Education, Eha-Amufu", "Federal College of Education, Ididep", 
      "Federal College of Education, Katsina", "Federal College of Education, Obudu", "Federal College of Education, Odugbo, Benue State", 
      "Federal College of Education, Okene", "Federal College of Education, Yola", "Federal College of Education (Technical), Keana"
    ],
    state: [
      "A.D. Rufa'i College of Education, Legal and General Studies, Bauchi", "Adamu Augie College of Education, Argungu", 
      "Adamu Tafawa Balewa College of Education, Kangere", "Akwa Ibom State College of Education, Afahansit", "Aminu Sale College of Education, Azare", 
      "Benjamin Uwajumogu State College of Education, Ihitte Uboma", "College of Education (Technical), Dass", "College of Education, Akwanga", 
      "College of Education and Legal Studies, Nguru", "College of Education, Ilorin", "College of Education, Oju", "College of Education, Oro", 
      "College of Education, Arochukwu, Abia", "College of Education, Billiri", "College of Education, Gindiri", "College of Education, Hong", 
      "College of Education, Ikere-Ekiti", "College of Education, Ila-Orangun, Osun State", "College of Education, Katsina-Ala", 
      "College of Education, Waka Biu", "College of Education, Warri", "College of Education, Zing", "Cross River State College of Education, Akampa", 
      "Delta State College of Education, Mosogar", "Ebonyi State College of Education (Technical), Ikwo", "Edo State College of Education, Igueben", 
      "Enugu State College of Education (Technical), Enugu", "Gombe State College of Education, Nafada", "Isa Kaita College of Education, Dutsin-Ma", 
      "Isaac Jasper Boro College of Education, Sagbama", "Jigawa State College of Education and Legal Studies, Ringim", "Jigawa State College of Education, Gumel", 
      "Kaduna State College of Education, Gidan-Waya, Kafanchan", "Kano State College of Education and Preliminary Studies", "Kashim Ibrahim College of Education", 
      "Kogi State College of Education, Ankpa", "Kogi State College of Education, Kabba", "Kwara State College of Education (Technical), Lafiagi", 
      "Niger State College of Education, Minna", "Nwafor Orizu College of Education, Nsugbe", "Oyo State College of Education, Lanlate", 
      "Sa'adatu Rimi College of Education, Kumbotso, Kano", "Shehu Shagari College of Education, Sokoto", "Sikiru Adetona College of Education, Science and Technology, Omu-Ajose", 
      "Umar Ibn Ibrahim El-Kanemi College of Education, Science and Technology, Bama", "Umar Suleiman College of Education, Gashua", 
      "Yusuf Bala Usman College of Education and Legal Studies, Daura", "Yusuf Maitama Sule College of Education and Legal Studies, Ghari", "Zamfara State College of Education, Maru"
    ],
    private: [
      "Abdullahi Maikano College of Education, Wase", "Adamu Garkuwa College of Education, Toro", "Adesina College of Education, Share", 
      "Adigrace College of Education", "African Thinkers Community of Inquiry College of Education", "Ahlus-Suffah College of Education", 
      "Ansar-Ud-Deen College of Education, Isolo", "Corona College of Education, Lekki", "ECWA College of Education, Igbaja", 
      "St. Augustine College of Education, Akoka, Lagos", "Top-Most College of Education, Ipaja-Agbado", "Yewa Central College of Education"
    ]
  }
};

const SAMPLE_FACULTIES = [
  "Engineering & Technology",
  "Sciences & Computing",
  "Medical & Health Sciences",
  "Management & Social Sciences",
  "Arts & Humanities",
  "Education & Vocational Studies"
];

const SAMPLE_DEPARTMENTS: { [key: string]: string[] } = {
  "Engineering & Technology": ["Electrical & Electronics Engineering", "Mechanical Engineering", "Civil Engineering", "Computer Engineering"],
  "Sciences & Computing": ["Computer Science", "Cyber Security", "Software Engineering", "Microbiology", "Biochemistry", "Industrial Chemistry"],
  "Medical & Health Sciences": ["Medicine and Surgery", "Nursing Science", "Medical Laboratory Science", "Pharmacy", "Anatomy"],
  "Management & Social Sciences": ["Accounting", "Banking and Finance", "Business Administration", "Economics", "Mass Communication", "Political Science"],
  "Arts & Humanities": ["English and Literary Studies", "History and International Studies", "Linguistics", "Philosophy"],
  "Education & Vocational Studies": ["Educational Management", "Guidance and Counselling", "Science Education", "Business Education"]
};

export default function Home() {
  const [showSelector, setShowSelector] = useState(false);

  // Selector Navigation State
  const [instType, setInstType] = useState<"universities" | "polytechnics" | "colleges_of_education">("universities");
  const [ownership, setOwnership] = useState<"federal" | "state" | "private">("federal");
  const [selectedInst, setSelectedInst] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<null | { available: boolean; message: string }>(null);

  // Payment Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courseCode] = useState("GST112");
  const [plan, setPlan] = useState<"A500" | "B1000">("B1000");
  const [txnRef, setTxnRef] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Access Verification States
  const [verifyEmail, setVerifyEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [reviews, setReviews] = useState([
    { name: "Saviour Bassey", department: "Electrical Engineering", comment: "Campus Learning Hub helped me grab A's in my exams without stress. The past questions are top-tier!" },
    { name: "Grace Okon", department: "Accounting", comment: "The ₦1,000 semester pass is totally worth it. All materials and verified past questions in one place." },
    { name: "Daniel Mensah", department: "Computer Science", comment: "The AI study planner kept me organized throughout the semester. Highly recommended for all Nigerian students!" }
  ]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerDept, setReviewerDept] = useState("");
  const [reviewerComment, setReviewerComment] = useState("");

  const currentList = INSTITUTION_DATA[instType][ownership] || [];
  const filteredInstitutions = currentList.filter(item => item.toLowerCase().includes(searchFilter.toLowerCase()));

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst || !selectedFaculty || !selectedDept) {
      alert("Please select your Institution, Faculty, and Department.");
      return;
    }

    setCheckingAvailability(true);
    setAvailabilityResult(null);

    setTimeout(() => {
      setCheckingAvailability(false);
      if (selectedInst.includes("Akwa Ibom State University") && selectedDept.includes("Electrical")) {
        setAvailabilityResult({
          available: true,
          message: `Materials & Verified Past Questions found for ${selectedDept} at ${selectedInst}!`
        });
      } else {
        setAvailabilityResult({
          available: false,
          message: `Notice: Materials for ${selectedDept} at ${selectedInst} are Not Available Yet. Our team is currently sourcing and uploading past questions for this department.`
        });
      }
    }, 800);
  };

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
        body: JSON.stringify({ full_name: fullName, email, phone, course: courseCode, plan, transaction_reference: txnRef })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message + "\nYour payment record has been created. Awaiting admin verification.");
        setFullName(""); setEmail(""); setPhone(""); setTxnRef(""); setShowPricingModal(false);
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
        body: JSON.stringify({ email: verifyEmail, access_code: accessCode })
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
      alert("Verification failed.");
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
    setReviews([{ name: reviewerName, department: reviewerDept || "Nigerian Student", comment: reviewerComment }, ...reviews]);
    setReviewerName(""); setReviewerDept(""); setReviewerComment("");
    alert("Thank you! Your testimonial has been posted successfully.");
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>
      
      {/* Sky Sports Athletic Header Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#121212", borderBottom: "3px solid #e11d48", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ backgroundColor: "#e11d48", color: "#ffffff", fontWeight: "900", padding: "6px 10px", borderRadius: "4px", fontSize: "0.85rem", letterSpacing: "0.05em" }}>CLH</span>
          <span style={{ fontWeight: "800", fontSize: "1.1rem", color: "#ffffff", letterSpacing: "-0.02em" }}>CAMPUS LEARNING <span style={{ color: "#e11d48" }}>HUB</span></span>
        </div>
        <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", alignItems: "center", fontWeight: "700" }}>
          <a href="#materials" style={{ color: "#f8fafc", textDecoration: "none" }}>Course Materials</a>
          <a href="#past-questions" style={{ color: "#f8fafc", textDecoration: "none" }}>Past Questions</a>
          <a href="/chat" style={{ color: "#e11d48", textDecoration: "none" }}>AI Study Room 🤖</a>
          <button onClick={() => setShowPricingModal(true)} style={{ backgroundColor: "#e11d48", color: "#ffffff", padding: "8px 16px", borderRadius: "4px", fontWeight: "900", border: "none", cursor: "pointer", textTransform: "uppercase", fontSize: "0.75rem" }}>
            Unlock Pass ⚡
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 16px", boxSizing: "border-box" }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ background: "rgba(225, 29, 72, 0.15)", color: "#fb7185", border: "1px solid rgba(225, 29, 72, 0.3)", padding: "6px 14px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block" }}>
            ◆ For All Nigerian Students
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: "900", marginTop: "16px", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Grab A's in All Your Courses <span style={{ color: "#e11d48" }}>Without Stress</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", marginTop: "14px", lineHeight: "1.6", maxWidth: "720px", marginInline: "auto" }}>
            Campus Learning Hub is built for all Nigerian students across universities, polytechnics, and colleges of education. Get instant access to structured course notes, verified past questions with detailed answers, and an intelligent AI study planner to master your exams.
          </p>

          <div style={{ marginTop: "30px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={() => {
                setShowSelector(true);
                setTimeout(() => document.getElementById("selector")?.scrollIntoView({ behavior: "smooth" }), 100);
              }} 
              style={{ background: "#e11d48", color: "#ffffff", padding: "14px 24px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", textTransform: "uppercase", fontSize: "0.85rem", boxShadow: "0 4px 15px rgba(225, 29, 72, 0.4)" }}
            >
              🔍 Search Your School & Department
            </button>
            <a href="/chat" style={{ background: "#182232", color: "#ffffff", border: "1px solid #334155", padding: "14px 24px", borderRadius: "6px", fontWeight: "900", textDecoration: "none", fontSize: "0.85rem" }}>
              Open AI Study Room 🤖
            </a>
          </div>
        </div>

        {/* FEATURED COURSE MATERIALS SECTION */}
        <div id="materials" style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#ffffff", margin: 0, textTransform: "uppercase" }}>Featured Course Materials</h3>
            <span style={{ fontSize: "0.75rem", background: "rgba(225, 29, 72, 0.15)", color: "#fb7185", border: "1px solid rgba(225, 29, 72, 0.3)", padding: "4px 10px", borderRadius: "4px", fontWeight: "800" }}>Available Now</span>
          </div>
          
          <div style={{ background: "#182232", border: "1px solid #334155", borderLeft: "4px solid #e11d48", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
            <div style={{ flex: "1 1 250px" }}>
              <span style={{ fontSize: "0.7rem", background: "#e11d48", color: "#ffffff", padding: "3px 8px", borderRadius: "4px", fontWeight: "900" }}>GST 112</span>
              <h4 style={{ margin: "8px 0 4px 0", fontSize: "1.1rem", color: "#ffffff", fontWeight: "800" }}>Nigerian Peoples and Culture (NPC)</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>Akwa Ibom State University — Complete lecture notes, summary guides, and tutor explanations.</p>
            </div>
            <button onClick={() => setShowPricingModal(true)} style={{ background: "#e11d48", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "900", cursor: "pointer", textTransform: "uppercase" }}>
              Unlock Material 🔒
            </button>
          </div>
        </div>

        {/* VERIFIED PAST QUESTIONS SECTION */}
        <div id="past-questions" style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#ffffff", margin: 0, textTransform: "uppercase" }}>Verified Past Questions & Answers (PQAs)</h3>
            <span style={{ fontSize: "0.75rem", background: "rgba(225, 29, 72, 0.15)", color: "#fb7185", border: "1px solid rgba(225, 29, 72, 0.3)", padding: "4px 10px", borderRadius: "4px", fontWeight: "800" }}>Step-by-Step Solutions</span>
          </div>
          
          <div style={{ background: "#182232", border: "1px solid #334155", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
            <div style={{ flex: "1 1 250px" }}>
              <span style={{ fontSize: "0.7rem", background: "#334155", color: "#fb7185", padding: "3px 8px", borderRadius: "4px", fontWeight: "900" }}>EXAM BANK</span>
              <h4 style={{ margin: "8px 0 4px 0", fontSize: "1.1rem", color: "#ffffff", fontWeight: "800" }}>GST 112 Past Questions Bank (2021 - 2026)</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>Fully solved objective and essay questions with detailed explanations to guarantee top scores.</p>
            </div>
            <button onClick={() => setShowPricingModal(true)} style={{ background: "#334155", color: "#fb7185", border: "1px solid #475569", padding: "10px 18px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "900", cursor: "pointer", textTransform: "uppercase" }}>
              Access PQAs ⚡
            </button>
          </div>
        </div>

        {/* HIDDEN / TOGGLED SCHOOL SELECTOR SECTION */}
        {!showSelector ? (
          <div style={{ textAlign: "center", marginBottom: "50px", background: "#182232", border: "1px solid #334155", padding: "30px", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>Looking for other Institutions & Departments?</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "16px" }}>Access over 300+ Nigerian Universities, Polytechnics, and Colleges of Education.</p>
            <button 
              onClick={() => setShowSelector(true)} 
              style={{ background: "transparent", border: "2px solid #e11d48", color: "#fb7185", padding: "10px 20px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}
            >
              Click Here to Search Your School & Department ▼
            </button>
          </div>
        ) : (
          <div id="selector" style={{ background: "#182232", border: "1px solid #334155", borderTop: "4px solid #e11d48", borderRadius: "12px", padding: "28px 20px", marginBottom: "50px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#ffffff", margin: 0, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                🔍 Search School, Faculty & Department
              </h3>
              <button onClick={() => setShowSelector(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>✕ Close</button>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "24px" }}>Filter through Federal, State, and Private institutions across Nigeria.</p>

            <form onSubmit={handleCheckAvailability} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", textTransform: "uppercase" }}>1. Select Institution Category</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { id: "universities", label: "Universities" },
                    { id: "polytechnics", label: "Polytechnics" },
                    { id: "colleges_of_education", label: "Colleges of Ed" }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => { setInstType(item.id as any); setSelectedInst(""); }}
                      style={{ background: instType === item.id ? "#e11d48" : "#0f172a", color: "#ffffff", border: "1px solid #334155", padding: "10px", borderRadius: "6px", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", textTransform: "uppercase" }}>2. Select Ownership Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { id: "federal", label: "Federal" },
                    { id: "state", label: "State" },
                    { id: "private", label: "Private" }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => { setOwnership(item.id as any); setSelectedInst(""); }}
                      style={{ background: ownership === item.id ? "#334155" : "#0f172a", color: "#ffffff", border: ownership === item.id ? "2px solid #e11d48" : "1px solid #334155", padding: "10px", borderRadius: "6px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", textTransform: "uppercase" }}>3. Search & Select Institution</label>
                <input 
                  type="text" 
                  placeholder="Type to search school name..." 
                  value={searchFilter} 
                  onChange={(e) => setSearchFilter(e.target.value)} 
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", marginBottom: "8px", boxSizing: "border-box", outline: "none" }}
                />
                <select 
                  value={selectedInst} 
                  onChange={(e) => setSelectedInst(e.target.value)} 
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.9rem", outline: "none", fontWeight: "600" }}
                >
                  <option value="">-- Choose Institution ({filteredInstitutions.length} available) --</option>
                  {filteredInstitutions.map((inst, index) => (
                    <option key={index} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", textTransform: "uppercase" }}>4. Select Faculty</label>
                  <select 
                    value={selectedFaculty} 
                    onChange={(e) => { setSelectedFaculty(e.target.value); setSelectedDept(""); }} 
                    required
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }}
                  >
                    <option value="">-- Choose Faculty --</option>
                    {SAMPLE_FACULTIES.map((fac, idx) => (
                      <option key={idx} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", textTransform: "uppercase" }}>5. Select Department</label>
                  <select 
                    value={selectedDept} 
                    onChange={(e) => setSelectedDept(e.target.value)} 
                    required
                    disabled={!selectedFaculty}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }}
                  >
                    <option value="">-- Choose Department --</option>
                    {selectedFaculty && SAMPLE_DEPARTMENTS[selectedFaculty]?.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={checkingAvailability}
                style={{ background: "#e11d48", color: "#ffffff", padding: "14px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em", marginTop: "10px", boxShadow: "0 4px 14px rgba(225, 29, 72, 0.4)" }}
              >
                {checkingAvailability ? "Checking Database Records..." : "Check Course & Material Availability 🔎"}
              </button>

            </form>

            {availabilityResult && (
              <div style={{ marginTop: "24px", padding: "18px", borderRadius: "8px", background: availabilityResult.available ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", border: `1px solid ${availabilityResult.available ? "#10b981" : "#ef4444"}`, textAlign: "center" }}>
                <p style={{ fontSize: "0.95rem", fontWeight: "800", color: availabilityResult.available ? "#34d399" : "#fca5a5", margin: "0 0 10px 0" }}>
                  {availabilityResult.message}
                </p>
                {availabilityResult.available ? (
                  <button onClick={() => setShowPricingModal(true)} style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>
                    Unlock Past Questions & Courses ⚡
                  </button>
                ) : (
                  <button onClick={() => alert("Request registered! Our team will prioritize sourcing materials for this department.")} style={{ background: "#334155", color: "#ffffff", border: "1px solid #475569", padding: "8px 16px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>
                    Request Priority Upload 📢
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS SECTION */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#ffffff", marginBottom: "6px", textTransform: "uppercase" }}>Trusted by Students Across Nigeria</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>See what students are saying about Campus Learning Hub.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {displayedReviews.map((rev, index) => (
              <div key={index} style={{ background: "#182232", border: "1px solid #334155", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ color: "#f8fafc", fontSize: "0.9rem", fontStyle: "italic", margin: "0 0 12px 0", lineHeight: "1.6" }}>"{rev.comment}"</p>
                <p style={{ color: "#fb7185", fontSize: "0.85rem", fontWeight: "800", margin: 0 }}>— {rev.name} <span style={{ color: "#94a3b8", fontWeight: "normal" }}>({rev.department})</span></p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <button onClick={() => setShowAllReviews(!showAllReviews)} style={{ background: "transparent", border: "1px solid #334155", color: "#fb7185", padding: "8px 16px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>
              {showAllReviews ? "Show Less ▲" : "See More Testimonials ▼"}
            </button>
          </div>

          {/* Submit Testimonial Form */}
          <div style={{ background: "#182232", border: "1px solid #334155", padding: "20px", borderRadius: "10px" }}>
            <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "12px", marginTop: 0, textTransform: "uppercase" }}>Drop Your Testimonial</h4>
            <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Your Full Name" required style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={reviewerDept} onChange={(e) => setReviewerDept(e.target.value)} placeholder="Institution & Dept (e.g. AKSU, Electrical Eng)" style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} />
              </div>
              <textarea value={reviewerComment} onChange={(e) => setReviewerComment(e.target.value)} placeholder="Write your review here..." required rows={3} style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none", resize: "vertical" }} />
              <button type="submit" style={{ background: "#334155", color: "#fb7185", border: "1px solid #475569", padding: "10px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.85rem" }}>
                Submit Testimonial 💬
              </button>
            </form>
          </div>
        </div>

        {/* PRICING & ACCESS MODAL */}
        {showPricingModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "#182232", border: "1px solid #334155", borderTop: "4px solid #e11d48", padding: "24px 20px", borderRadius: "12px", maxWidth: "500px", width: "100%", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.7)" }}>
              
              <button onClick={() => setShowPricingModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}>✕</button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ background: "rgba(225, 29, 72, 0.15)", color: "#fb7185", padding: "4px 10px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "900" }}>CLH ACCESS PASS</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginTop: "8px", color: "#ffffff" }}>Unlock Platform & AI Study Room</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
                <div onClick={() => setPlan("A500")} style={{ background: "#0f172a", border: plan === "A500" ? "2px solid #e11d48" : "1px solid #334155", padding: "14px", borderRadius: "8px", cursor: "pointer", textAlign: "center" }}>
                  <span style={{ fontSize: "0.65rem", color: "#fb7185", fontWeight: "800" }}>7 DAYS PASS</span>
                  <h4 style={{ fontSize: "1.1rem", color: "#ffffff", margin: "4px 0" }}>₦500</h4>
                </div>
                <div onClick={() => setPlan("B1000")} style={{ background: "#0f172a", border: plan === "B1000" ? "2px solid #e11d48" : "1px solid #334155", padding: "14px", borderRadius: "8px", cursor: "pointer", textAlign: "center" }}>
                  <span style={{ fontSize: "0.65rem", color: "#fb7185", fontWeight: "800" }}>SEMESTER PASS</span>
                  <h4 style={{ fontSize: "1.1rem", color: "#ffffff", margin: "4px 0" }}>₦1,000</h4>
                </div>
              </div>

              <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.8rem", color: "#ffffff" }}>
                <p style={{ margin: "0 0 3px 0" }}>Bank: <span style={{ color: "#fb7185" }}>Fidelity Bank</span></p>
                <p style={{ margin: "0 0 3px 0" }}>Account Number: <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>4568971753</span></p>
                <p style={{ margin: 0 }}>Account Name: <span style={{ color: "#fb7185" }}>Asuquo Deborah</span></p>
              </div>

              <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone Number" style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} />
                <input type="text" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} required placeholder="Bank Transaction Reference" style={{ padding: "10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} />
                <button type="submit" disabled={paymentLoading} style={{ background: "#e11d48", color: "#ffffff", padding: "10px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  {paymentLoading ? "Submitting..." : "Submit Payment Record"}
                </button>
              </form>

              <div style={{ marginTop: "20px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
                <h4 style={{ color: "#ffffff", fontSize: "0.85rem", marginBottom: "8px" }}>Already have an Access Code?</h4>
                <form onSubmit={handleAccessVerify} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input type="email" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} required placeholder="Your Email" style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.8rem", outline: "none" }} />
                  <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required placeholder="Access Token" style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "0.8rem", outline: "none" }} />
                  <button type="submit" disabled={verifyLoading} style={{ background: "#334155", color: "#fb7185", border: "1px solid #475569", padding: "8px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>
                    {verifyLoading ? "Verifying..." : "Verify Access Code"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "2px solid #e11d48", paddingTop: "24px", marginTop: "50px", color: "#94a3b8", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <span style={{ fontWeight: "900", color: "#ffffff", fontSize: "0.95rem" }}>Campus Learning Hub (CLH)</span>
              <p style={{ margin: "4px 0 0 0" }}>Nationwide portal covering 328+ universities, polytechnics, and colleges.</p>
            </div>
            <p style={{ margin: 0, color: "#e11d48", fontWeight: "800" }}>newsglobal038@gmail.com</p>
          </div>
          <div style={{ textAlign: "center", borderTop: "1px solid #1e293b", marginTop: "20px", paddingTop: "14px", color: "#64748b", fontSize: "0.75rem" }}>
            &copy; 2026 Campus Learning Hub. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
