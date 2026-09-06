/* 🌱 KISANSETU Mock Data & Database Store */

window.KISAN_DATA = {
  currentUser: {
    id: "USR-9482",
    name: "Rajesh Kumar",
    role: "farmer", // farmer, extension, expert, official
    phone: "+91 98765 43210",
    language: "hi",
    location: "Rampur, Block B, District Karnal",
    avatar: "👨🌾"
  },

  languages: [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳" },
    { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", flag: "🇮🇳" }
  ],

  crops: [
    { id: "rice", name: "Rice (धान)", varieties: ["Pusa Basmati 1121", "PR-126", "Swarna Sub-1", "MTU 1010"], icon: "🌾" },
    { id: "wheat", name: "Wheat (गेहूं)", varieties: ["HD-2967", "DBW-187", "PBW-725", "GW-322"], icon: "🌾" },
    { id: "tomato", name: "Tomato (टमाटर)", varieties: ["Arka Rakshak", "Pusa Ruby", "Abhinav", "Himsona"], icon: "🍅" },
    { id: "potato", name: "Potato (आलू)", varieties: ["Kufri Jyoti", "Kufri Pukhraj", "Kufri Bahar", "Kufri Chipsona"], icon: "🥔" },
    { id: "cotton", name: "Cotton (कपास)", varieties: ["Bt-Cotton RCH 659", "Bani", "MCU 5", "Suraj"], icon: "🌱" },
    { id: "maize", name: "Maize (मक्का)", varieties: ["Hybrid DKC 9108", "Bio 9681", "Pusa Composite 3"], icon: "🌽" }
  ],

  growthStages: [
    { id: "seedling", name: "Seedling / Early Vegetative" },
    { id: "vegetative", name: "Active Vegetative" },
    { id: "flowering", name: "Flowering & Panicle Initiation" },
    { id: "fruiting", name: "Fruiting / Grain Filling" },
    { id: "harvest", name: "Maturity / Harvest Stage" }
  ],

  diseases: {
    "early_blight": {
      name: "Early Blight (अगेती झुलसा)",
      scientificName: "Alternaria solani",
      crop: "tomato",
      confidence: 91,
      riskLevel: "HIGH",
      symptoms: [
        "Brown concentric circular lesions ('target spots') on leaves",
        "Yellowing halo around affected leaf spots",
        "Lower leaf premature defoliation and stem collar rot"
      ],
      recommendation: "Inspect additional plants and confirm symptoms before treatment.",
      ipm: {
        prevention: [
          "Practice 2-3 year crop rotation with non-solanaceous crops",
          "Use certified disease-free seeds and resistant varieties like Arka Rakshak",
          "Maintain field sanitation by burning/removing infected crop debris"
        ],
        monitoring: [
          "Scout fields weekly starting 15 days after transplanting",
          "Monitor relative humidity and leaf wetness duration",
          "Set up yellow sticky traps for vector surveillance"
        ],
        biological: [
          "Apply Trichoderma viride / harzianum @ 5g/L as foliar spray",
          "Spray Pseudomonas fluorescens @ 10g/L during early vegetative stage",
          "Use neem oil (10,000 ppm) @ 3ml/L for early suppression"
        ],
        chemical: [
          "Apply Mancozeb 75% WP @ 2g/L of water if infection threshold exceeds 5%",
          "Alternate with Azoxystrobin 23% SC @ 1ml/L to manage resistance",
          "Maintain a Pre-Harvest Interval (PHI) of 7 days and use complete PPE gear"
        ]
      }
    },

    "brown_spot": {
      name: "Rice Brown Spot (भूरा धब्बा)",
      scientificName: "Helminthosporium oryzae",
      crop: "rice",
      confidence: 88,
      riskLevel: "HIGH",
      symptoms: [
        "Oval or cylindrical sesame-seed-like dark brown spots on leaves",
        "Yellow halo surrounding mature brown spots",
        "Grain discolouration and seedling blight"
      ],
      recommendation: "Ensure balanced potassium nutrition and avoid water stress.",
      ipm: {
        prevention: [
          "Apply recommended doses of Potash (K) to boost crop immunity",
          "Seed treatment with Carbendazim @ 2g/kg seed before sowing",
          "Ensure adequate irrigation during panicle initiation"
        ],
        monitoring: [
          "Scout 20 random hills per acre twice a week during tillering",
          "Observe weather for prolonged cloudy days and high humidity (>80%)"
        ],
        biological: [
          "Foliar spray of Pseudomonas fluorescens @ 5g/L at tiller stage",
          "Incorporate bio-fertilizers and composted farmyard manure"
        ],
        chemical: [
          "Spray Tricyclazole 75% WP @ 0.6g/L or Propiconazole 25% EC @ 1ml/L",
          "Use PPE and adhere strictly to authorized application dosage"
        ]
      }
    },

    "powdery_mildew": {
      name: "Powdery Mildew (चूर्णिल आसिता)",
      scientificName: "Erysiphe graminis",
      crop: "wheat",
      confidence: 94,
      riskLevel: "MODERATE",
      symptoms: [
        "White powdery fungal patches on upper leaf surfaces and stems",
        "Patches turn greyish-brown as leaves age and yellow",
        "Stunted tiller growth and reduced grain weight"
      ],
      recommendation: "Ensure adequate row spacing for ventilation; monitor closely.",
      ipm: {
        prevention: [
          "Avoid dense sowing; maintain proper row-to-row spacing",
          "Use resistant wheat cultivars suitable for your agro-climate"
        ],
        monitoring: [
          "Check lower leaf canopies weekly for initial white fluffs",
          "Monitor dry winds followed by high humidity conditions"
        ],
        biological: [
          "Spray Bacillus subtilis bio-fungicide @ 5ml/L",
          "Foliar application of fermented cow butter-milk (lassi) @ 5%"
        ],
        chemical: [
          "Wettable Sulphur 80% WP @ 3g/L or Tebuconazole 250 EC @ 1ml/L",
          "Adhere to 14-day Pre-Harvest Interval (PHI)"
        ]
      }
    },

    "aphid_infestation": {
      name: "Aphid Infestation (माहू / चेपा)",
      scientificName: "Aphis gossypii",
      crop: "cotton",
      confidence: 96,
      riskLevel: "CRITICAL",
      symptoms: [
        "Curling and puckering of young shoots and tender leaves",
        "Sticky honeydew secretion on leaf surface attracting sooty mold",
        "Stunted crop growth and vector transmission of viral pathogens"
      ],
      recommendation: "Install yellow sticky traps immediately and deploy beneficial predators.",
      ipm: {
        prevention: [
          "Sow intercrops like maize or cowpea as natural barrier crops",
          "Avoid excessive application of quick-release nitrogenous fertilizers"
        ],
        monitoring: [
          "Install 10 yellow sticky traps per acre at crop canopy height",
          "Economic Threshold Level (ETL): 15-20 aphids per leaf"
        ],
        biological: [
          "Release Ladybird Beetles (Coccinella septempunctata) @ 500/acre",
          "Spray Chrysoperla carnea larvae @ 2,000/acre",
          "Foliar spray of Azadirachtin 10,000 ppm @ 2ml/L"
        ],
        chemical: [
          "If ETL crossed: Spray Imidacloprid 17.8% SL @ 0.5ml/L or Flonicamid 50% WG @ 0.3g/L",
          "Wear protective mask, gloves and boots during application"
        ]
      }
    }
  },

  farmerFields: [
    {
      id: "FLD-101",
      name: "East River Plot (खेत ए)",
      crop: "Rice",
      variety: "Pusa Basmati 1121",
      stage: "Flowering & Panicle",
      area: "2.5 Acres",
      location: "Rampur Village, North Sector",
      riskScore: 72,
      riskLevel: "HIGH",
      healthStatus: "Active Risk (Brown Spot)",
      lastScan: "2 hours ago",
      image: "rice"
    },
    {
      id: "FLD-102",
      name: "Green Valley Farm (खेत बी)",
      crop: "Tomato",
      variety: "Arka Rakshak",
      stage: "Fruiting",
      area: "1.8 Acres",
      location: "Rampur Village, South Sector",
      riskScore: 89,
      riskLevel: "CRITICAL",
      healthStatus: "Critical (Early Blight)",
      lastScan: "Yesterday",
      image: "tomato"
    },
    {
      id: "FLD-103",
      name: "Highland Wheat Field (खेत सी)",
      crop: "Wheat",
      variety: "HD-2967",
      stage: "Vegetative",
      area: "3.2 Acres",
      location: "Shivpur Road",
      riskScore: 28,
      riskLevel: "LOW",
      healthStatus: "Healthy",
      lastScan: "3 days ago",
      image: "wheat"
    },
    {
      id: "FLD-104",
      name: "South Cotton Acre (खेत डी)",
      crop: "Cotton",
      variety: "Bt-Cotton RCH 659",
      stage: "Active Vegetative",
      area: "4.0 Acres",
      location: "Lakshmi Nagar Block",
      riskScore: 65,
      riskLevel: "MODERATE",
      healthStatus: "Pest Alert (Aphids)",
      lastScan: "4 hours ago",
      image: "cotton"
    }
  ],

  iotData: {
    sensors: [
      { id: "SNS-1", name: "Field A Weather Node", temp: "29.4 °C", humidity: "84%", soilMoisture: "38%", trapCount: 18, wetness: "7.2 hrs", status: "Online" },
      { id: "SNS-2", name: "Tomato Plot IoT Gateway", temp: "31.1 °C", humidity: "89%", soilMoisture: "44%", trapCount: 24, wetness: "9.5 hrs", status: "Online" },
      { id: "SNS-3", name: "Wheat Field Node", temp: "24.8 °C", humidity: "62%", soilMoisture: "28%", trapCount: 5, wetness: "2.1 hrs", status: "Online" }
    ],
    pestTrend: [
      { day: "Day 1", count: 4 },
      { day: "Day 2", count: 6 },
      { day: "Day 3", count: 8 },
      { day: "Day 4", count: 12 },
      { day: "Day 5", count: 18 },
      { day: "Day 6", count: 24 }
    ]
  },

  weatherForecast: [
    { day: "Today", temp: "29°C", humidity: "84%", rain: "18 mm", risk: "🔴 Critical", condition: "Heavy Humidity & Rain" },
    { day: "Mon", temp: "30°C", humidity: "82%", rain: "12 mm", risk: "🔴 Critical", condition: "Thunderstorms" },
    { day: "Tue", temp: "31°C", humidity: "78%", rain: "5 mm", risk: "🟠 High", condition: "Partly Cloudy" },
    { day: "Wed", temp: "32°C", humidity: "71%", rain: "0 mm", risk: "🟡 Moderate", condition: "Sunny Spells" },
    { day: "Thu", temp: "29°C", humidity: "88%", rain: "25 mm", risk: "🔴 Critical", condition: "Heavy Downpour" },
    { day: "Fri", temp: "28°C", humidity: "80%", rain: "8 mm", risk: "🟠 High", condition: "Overcast" },
    { day: "Sat", temp: "30°C", humidity: "65%", rain: "0 mm", risk: "🟢 Low", condition: "Clear Sky" }
  ],

  gisHotspots: [
    { id: "MAP-1", village: "Rampur", lat: 29.6857, lng: 76.9905, crop: "Rice & Tomato", reports: 23, mainIssue: "Rice Brown Spot & Early Blight", riskScore: 86, trend: "↑ Increasing", workerAssigned: "Dr. A. Sharma (Extension Worker)" },
    { id: "MAP-2", village: "Shivpur", lat: 29.7120, lng: 77.0150, crop: "Tomato", reports: 14, mainIssue: "Tomato Early Blight", riskScore: 72, trend: "↑ Increasing", workerAssigned: "Suresh Patel (AEW)" },
    { id: "MAP-3", village: "Lakshmi Nagar", lat: 29.6510, lng: 76.9540, crop: "Wheat", reports: 8, mainIssue: "Yellow Rust Warning", riskScore: 51, trend: "→ Stable", workerAssigned: "Ramesh Verma (AEW)" },
    { id: "MAP-4", village: "Chandpur", lat: 29.7400, lng: 76.9200, crop: "Cotton", reports: 31, mainIssue: "Aphid Outbreak", riskScore: 92, trend: "↑ Rapid Rise", workerAssigned: "Unassigned" },
    { id: "MAP-5", village: "Gopalpur", lat: 29.6200, lng: 77.0400, crop: "Potato", reports: 4, mainIssue: "Late Blight Signal", riskScore: 35, trend: "↓ Decreasing", workerAssigned: "Pooja Singh (AEW)" }
  ],

  expertCases: [
    { id: "EXP-881", farmer: "Rajesh Kumar", field: "Field A", crop: "Rice", aiDiagnosis: "Rice Brown Spot", confidence: 64, risk: "HIGH", status: "PENDING_EXPERT", image: "rice", timestamp: "10 mins ago", issue: "Low AI confidence check required" },
    { id: "EXP-882", farmer: "Sunil Verma", field: "North Plot", crop: "Tomato", aiDiagnosis: "Early Blight", confidence: 91, risk: "CRITICAL", status: "LAB_REFERRED", image: "tomato", timestamp: "1 hour ago", issue: "Sample dispatched to Karnal Agri Lab" },
    { id: "EXP-883", farmer: "Gurpreet Singh", field: "Field C", crop: "Wheat", aiDiagnosis: "Powdery Mildew", confidence: 95, risk: "MODERATE", status: "CONFIRMED", image: "wheat", timestamp: "3 hours ago", issue: "Validated by Dr. Swaminathan" }
  ],

  extensionPriorityCases: [
    { farm: "Farm A (Rajesh Kumar)", crop: "Rice", risk: 89, riskClass: "bg-red-900/80 text-red-300 border-red-500", location: "Rampur", action: "Urgent Field Visit", phone: "+91 98765 43210" },
    { farm: "Farm B (Sunil Verma)", crop: "Tomato", risk: 72, riskClass: "bg-amber-900/80 text-amber-300 border-amber-500", location: "Shivpur", action: "Review AI Report", phone: "+91 98765 11223" },
    { farm: "Farm C (Gurpreet Singh)", crop: "Wheat", risk: 51, riskClass: "bg-yellow-900/80 text-yellow-300 border-yellow-500", location: "Lakshmi Nagar", action: "Routine Monitor", phone: "+91 98765 99887" },
    { farm: "Farm D (Harpreet Kaur)", crop: "Cotton", risk: 94, riskClass: "bg-red-900/80 text-red-300 border-red-500", location: "Chandpur", action: "Pest Trap Audit", phone: "+91 98765 33445" }
  ],

  multilingualAdvisories: {
    hi: {
      title: "🔴 उच्च जोखिम चेतावनी (High Risk Alert)",
      text: "🔴 आपकी फसल में कीट और फंगस का खतरा अधिक है। पिछले कुछ दिनों में मौसम और कीट गतिविधि इस समस्या के लिए अत्यधिक अनुकूल रही है। कृपया तुरंत खेत का निरीक्षण करें और अनुशंसित IPM उपाय अपनाएं। यदि लक्षण बढ़ते हैं, तो तुरंत कृषि विशेषज्ञ से संपर्क करें।"
    },
    en: {
      title: "🔴 High Disease & Pest Risk Alert",
      text: "🔴 High risk detected in your crop canopy. Weather conditions (high humidity >84%, rainfall) and pest trap counters favor rapid fungal and aphid multiplication. Please inspect your field within 24–48 hours and adopt recommended IPM practices. Contact your extension officer if symptoms spread."
    },
    bn: {
      title: "🔴 উচ্চ ঝুঁকি সতর্কবার্তা",
      text: "🔴 আপনার ফসলে রোগ ও পোকামাকড়ের আক্রমণ হওয়ার আশঙ্কা বেশি। আবহাওয়া এবং পোকার ফাঁদের তথ্য অনুযায়ী অবিলম্বে ক্ষেত পরিদর্শন করুন এবং আইপিএম ব্যবস্থা গ্রহণ করুন।"
    },
    mr: {
      title: "🔴 तीव्र धोका इशारा",
      text: "🔴 तुमच्या पिकावर रोग आणि किडीचा धोका जास्त आहे. गेल्या काही दिवसांतील हवामान यासाठी अनुकूल आहे. कृपया तात्काळ शेताची पाहणी करा आणि एकात्मिक कीड व्यवस्थापन (IPM) उपाययोजना करा."
    },
    te: {
      title: "🔴 అధిక ప్రమాద హెచ్చరిక",
      text: "🔴 మీ పంటలో పురుగులు మరియు తెగుళ్ళ ముప్పు ఎక్కువగా ఉంది. దయచేసి తక్షణమే పొలాన్ని పరిశీలించి, తగిన సమగ్ర సస్యరక్షణ (IPM) చర్యలు తీసుకోండి."
    },
    ta: {
      title: "🔴 அதிக ஆபத்து எச்சரிக்கை",
      text: "🔴 உங்கள் பயிரில் நோய் மற்றும் பூச்சித் தாக்குதல் ஆபத்து அதிகமாக உள்ளது. உடனடியாக வயலை ஆய்வு செய்து பரிந்துரைக்கப்பட்ட IPM முறைகளைப் பின்பற்றுங்கள்."
    },
    gu: {
      title: "🔴 ઉચ્ચ જોખમ ચેતવણી",
      text: "🔴 તમારા પાકમાં રોગ અને જીવાતનું જોખમ વધુ છે. કૃપા કરીને તાત્કાલિક ખેતરનું નિરીક્ષણ કરો અને આઇપીએમ ઉપાયો અપનાવો."
    },
    kn: {
      title: "🔴 ಹೆಚ್ಚಿನ ಅಪಾಯದ ಎಚ್ಚರಿಕೆ",
      text: "🔴 ನಿಮ್ಮ ಬೆಳೆಗಳಲ್ಲಿ ರೋಗ ಮತ್ತು ಕೀಟಗಳ ಬಾಧೆಯು ಹೆಚ್ಚಾಗಿದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣವೇ ಹೊಲವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಂಯೋಜಿತ ಕೀಟ ನಿರ್ವಹಣೆ (IPM) ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ."
    },
    pa: {
      title: "🔴 ਉੱਚ ਖਤਰੇ ਦੀ ਚੇਤਾਵਨੀ",
      text: "🔴 ਤੁਹਾਡੀ ਫਸਲ ਵਿੱਚ ਕੀੜਿਆਂ ਅਤੇ ਬਿਮਾਰੀਆਂ ਦਾ ਖਤਰਾ ਵੱਧ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਖੇਤ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਸਿਫਾਰਸ਼ ਕੀਤੇ IPM ਉਪਾਅ ਅਪਣਾਓ।"
    }
  },

  plantRecognition: [
    {
      id: "plant_tomato",
      commonName: "Tomato (टमाटर)",
      botanicalName: "Solanum lycopersicum",
      family: "Solanaceae (Nightshade Family)",
      type: "Solanaceous Fruit Crop",
      confidence: 96,
      characteristics: [
        "Compound pinnate leaves with 5-9 serrated leaflets",
        "Glandular trichomes (hairs) exuding distinct aromatic scent",
        "Yellow 5-lobed star-shaped flowers and fleshy berries"
      ],
      idealSoil: "Well-drained sandy loam, pH 6.0 - 6.8",
      optimalTemp: "21°C - 27°C",
      economicImportance: "Major commercial vegetable crop rich in Lycopene antioxidant and Vitamin C.",
      status: "CULTIVATED CROP",
      badgeClass: "bg-emerald-900 border-emerald-500 text-emerald-300",
      svgKey: "tomato"
    },
    {
      id: "plant_rice",
      commonName: "Paddy / Rice (धान)",
      botanicalName: "Oryza sativa",
      family: "Poaceae (Grass Family)",
      type: "Cereal Grain Crop",
      confidence: 98,
      characteristics: [
        "Long slender linear leaves with parallel venation",
        "Prominent membranous ligule and hairy auricles at leaf base",
        "Terminal panicle inflorescence bearing spikelets"
      ],
      idealSoil: "Clayey loam capable of holding standing water, pH 5.5 - 6.5",
      optimalTemp: "25°C - 35°C",
      economicImportance: "Staple food grain feeding over 50% of the world population.",
      status: "PRIMARY FOOD CROP",
      badgeClass: "bg-emerald-900 border-emerald-500 text-emerald-300",
      svgKey: "rice"
    },
    {
      id: "plant_parthenium",
      commonName: "Carrot Grass / Gaddi (गाजर घास)",
      botanicalName: "Parthenium hysterophorus",
      family: "Asteraceae (Sunflower Family)",
      type: "Noxious Invasive Weed",
      confidence: 94,
      characteristics: [
        "Deeply lobed feather-like leaves resembling carrot foliage",
        "Small white star-shaped flower heads producing thousands of seeds",
        "Contains Parthenin toxin causing allergic contact dermatitis"
      ],
      idealSoil: "Adaptable to all degraded soils and disturbed land",
      optimalTemp: "15°C - 40°C",
      economicImportance: "⚠️ INVASIVE WEED: Reduces crop yields by 40% and suppresses native pasture flora.",
      status: "HAZARDOUS WEED",
      badgeClass: "bg-red-950 border-red-500 text-red-300 font-bold pulse-risk-red",
      svgKey: "parthenium"
    },
    {
      id: "plant_neem",
      commonName: "Neem Tree (नीम)",
      botanicalName: "Azadirachta indica",
      family: "Meliaceae (Mahogany Family)",
      type: "Medicinal & Bio-Pesticide Tree",
      confidence: 97,
      characteristics: [
        "Imparipinnate compound leaves with 20-31 serrated leaflets",
        "White fragrant pentamerous flowers in axillary panicles",
        "Smooth green drupes containing Azadirachtin compound"
      ],
      idealSoil: "Deep well-drained soil, highly drought tolerant",
      optimalTemp: "21°C - 38°C",
      economicImportance: "Source of organic Neem Oil for IPM bio-pesticide and natural soil nematicide.",
      status: "MEDICINAL & BIO-CONTROL",
      badgeClass: "bg-teal-900 border-teal-500 text-teal-300",
      svgKey: "neem"
    }
  ],

  references: [
    { title: "FAO - Early Warning Systems for Plant Health", url: "https://www.fao.org/one-health/highlights/early-warning-systems-for-plant-health/en", desc: "Global surveillance frameworks for proactive plant biosecurity and threat detection." },
    { title: "FAO - AI-enabled Surveillance and Early Warning", url: "https://www.fao.org/plant-production-protection/news-and-events/events/event-detail/from-field-signal-to-field-ready-decision--ai-enabled-surveillance-and-early-warning-for-transboundary-plant-pests-and-diseases/en", desc: "Connecting field computer vision signals to rapid extension response mechanisms." },
    { title: "FAO - Integrated Pest Management (IPM) Guidelines", url: "https://www.fao.org/plant-production-protection/about/", desc: "Safeguard principles prioritizing biological, mechanical and preventive controls." },
    { title: "ICAR - Weather Based Crop Advisory System", url: "https://www.icar.gov.in/en/weather-based-crop-advisory", desc: "Agro-meteorological advisories linking rainfall, humidity and thermal thresholds to pest emergence." },
    { title: "ICAR - AI-enabled Extension System (IARI New Delhi)", url: "https://icar.gov.in/en/icar-iari-new-delhi-hosts-expert-lecture-ai-enabled-extension-system", desc: "Empowering agricultural extension officers with computer vision decision support." },
    { title: "ICAR - Bharat-VISTAAR Digital Agriculture", url: "https://www.icar.gov.in/index.php/en/icar-institutes-across-country-host-live-webcast-bharat-vistaar-launch-reinforcing-digital", desc: "National digital framework for unified farmer advisories and soil health monitoring." },
    { title: "DPPQ&S - Directorate of Plant Protection, Quarantine & Storage", url: "https://ppqs.gov.in/", desc: "Official Indian regulatory standards for registered crop protection chemicals and quarantine guidelines." }
  ],

  dbSchema: {
    tables: [
      {
        name: "Users",
        fields: ["id (UUID)", "name (VARCHAR)", "role (ENUM: farmer, extension, expert, official)", "phone (VARCHAR)", "language (VARCHAR)", "location (GEOMETRY/Point)"]
      },
      {
        name: "Farms",
        fields: ["id (UUID)", "farmer_id (FK -> Users.id)", "crop (VARCHAR)", "variety (VARCHAR)", "area_acres (FLOAT)", "location (PostGIS Geometry)", "growth_stage (VARCHAR)"]
      },
      {
        name: "CropScans",
        fields: ["id (UUID)", "farm_id (FK -> Farms.id)", "image_url (TEXT)", "predicted_disease (VARCHAR)", "confidence (FLOAT)", "risk_score (INT)", "created_at (TIMESTAMP)"]
      },
      {
        name: "SensorData",
        fields: ["id (UUID)", "farm_id (FK -> Farms.id)", "temperature (FLOAT)", "humidity (FLOAT)", "soil_moisture (FLOAT)", "trap_count (INT)", "timestamp (TIMESTAMP)"]
      },
      {
        name: "ExpertValidation",
        fields: ["id (UUID)", "scan_id (FK -> CropScans.id)", "expert_id (FK -> Users.id)", "diagnosis (VARCHAR)", "status (ENUM: pending, confirmed, rejected, lab_referred)", "comments (TEXT)"]
      },
      {
        name: "Alerts",
        fields: ["id (UUID)", "user_id (FK -> Users.id)", "risk_score (INT)", "message (TEXT)", "location (GEOMETRY)", "created_at (TIMESTAMP)"]
      },
      {
        name: "FollowUp",
        fields: ["id (UUID)", "scan_id (FK -> CropScans.id)", "followup_date (DATE)", "image_url (TEXT)", "status (ENUM: improving, no_change, worsening)", "comments (TEXT)"]
      }
    ]
  }
};
