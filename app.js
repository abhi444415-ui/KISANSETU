/* 🌱 KISANSETU Application Logic & SPA Routing System */

document.addEventListener('DOMContentLoaded', () => {
  // Initial state setup
  window.appState = {
    currentView: 'landing',
    userRole: 'farmer',
    language: 'hi',
    isOffline: false,
    offlineQueue: [],
    currentScanResult: null,
    demoStep: 1,
    scannerStep: 0
  };

  initApp();
});

function initApp() {
  bindEvents();
  renderNavigation();
  renderCurrentView();
  updateOfflineBanner();
}

// ----------------------------------------------------
// Navigation & Routing
// ----------------------------------------------------
function navigateTo(viewId, params = {}) {
  window.appState.currentView = viewId;
  if (params.scanResult) {
    window.appState.currentScanResult = params.scanResult;
  }
  
  // Highlight active nav links
  document.querySelectorAll('.nav-link').forEach(el => {
    if (el.dataset.view === viewId) {
      el.classList.add('bg-emerald-800/60', 'text-emerald-400', 'border-emerald-500');
      el.classList.remove('text-emerald-200/80', 'border-transparent');
    } else {
      el.classList.remove('bg-emerald-800/60', 'text-emerald-400', 'border-emerald-500');
      el.classList.add('text-emerald-200/80', 'border-transparent');
    }
  });

  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setRole(role) {
  window.appState.userRole = role;
  const userRoleBadge = document.getElementById('user-role-badge');
  if (userRoleBadge) {
    const roleLabels = {
      farmer: "👨🌾 Farmer Mode",
      extension: "👨🌾 Extension Worker",
      expert: "👨🔬 Agri Expert",
      official: "🏛 Agri Official / Admin"
    };
    userRoleBadge.innerHTML = roleLabels[role] || role;
  }

  // Auto-navigate to appropriate default dashboard when changing role if on dashboard view
  if (role === 'farmer') navigateTo('farmer-dashboard');
  else if (role === 'extension') navigateTo('extension-dashboard');
  else if (role === 'expert') navigateTo('expert-validation');
  else if (role === 'official') navigateTo('official-dashboard');

  showToast(`Switched to ${role.toUpperCase()} profile`);
}

function setLanguage(langCode) {
  window.appState.language = langCode;
  const langObj = window.KISAN_DATA.languages.find(l => l.code === langCode);
  showToast(`Language set to ${langObj ? langObj.name : langCode}`);
  renderCurrentView();
}

function toggleOfflineMode() {
  window.appState.isOffline = !window.appState.isOffline;
  updateOfflineBanner();
  showToast(window.appState.isOffline ? "📴 Offline Mode Enabled (Reports will be queued locally)" : "🌐 Back Online (Syncing pending reports...)");
}

function updateOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;

  if (window.appState.isOffline) {
    banner.classList.remove('hidden');
    banner.innerHTML = `
      <div class="bg-amber-900/90 border-b border-amber-500/50 text-amber-200 px-4 py-2 text-sm flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-2">
          <span class="animate-pulse">📴</span>
          <span class="font-semibold">OFFLINE MODE:</span>
          <span>Poor connection detected. Scans and reports will save locally in offline queue.</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="bg-amber-950 px-2 py-0.5 rounded border border-amber-600 text-xs font-mono">Queued: ${window.appState.offlineQueue.length} items</span>
          <button onclick="syncOfflineQueue()" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition">🔄 Sync Now</button>
          <button onclick="toggleOfflineMode()" class="text-amber-400 hover:text-white text-xs underline">Go Online</button>
        </div>
      </div>
    `;
  } else {
    banner.classList.add('hidden');
  }
}

function syncOfflineQueue() {
  if (window.appState.offlineQueue.length === 0) {
    showToast("No pending items to sync.");
    return;
  }
  const count = window.appState.offlineQueue.length;
  showToast(`🔄 Syncing ${count} pending field reports to PostgreSQL database...`);
  setTimeout(() => {
    window.appState.offlineQueue = [];
    updateOfflineBanner();
    showToast(`✅ Successfully synchronized ${count} reports! Server state updated.`);
  }, 1800);
}

// ----------------------------------------------------
// Toast Notification Engine
// ----------------------------------------------------
function showToast(message, type = "success") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === "error" ? "bg-red-900/90 border-red-500 text-red-100" : "bg-emerald-900/90 border-emerald-500 text-emerald-100";
  toast.className = `p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-2 flex items-center gap-3 ${bgClass}`;
  toast.innerHTML = `
    <span class="text-lg">${type === "error" ? "⚠️" : "🌱"}</span>
    <div class="text-sm font-medium">${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----------------------------------------------------
// Event Binding
// ----------------------------------------------------
function bindEvents() {
  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ----------------------------------------------------
// Core View Switcher & Renderer
// ----------------------------------------------------
function renderNavigation() {
  const navContainer = document.getElementById('main-nav-links');
  if (!navContainer) return;

  const navItems = [
    { id: 'landing', label: '🏠 Home', role: 'all' },
    { id: 'farmer-dashboard', label: '👨🌾 Farmer Hub', role: 'all' },
    { id: 'scanner', label: '📷 Crop Scanner', role: 'all' },
    { id: 'plant-rec', label: '🌿 Plant Recognition', role: 'all' },
    { id: 'risk-forecast', label: '📊 Risk Forecast', role: 'all' },
    { id: 'weather', label: '🌦 Weather', role: 'all' },
    { id: 'pest-sensor', label: '🪤 IoT & Traps', role: 'all' },
    { id: 'gis-map', label: '🗺 GIS Hotspots', role: 'all' },
    { id: 'ipm-advisory', label: '🌱 IPM Advisory', role: 'all' },
    { id: 'expert-validation', label: '👨🔬 Expert Review', role: 'expert' },
    { id: 'lab-referral', label: '🧪 Lab Referral', role: 'expert' },
    { id: 'follow-up', label: '🔄 Follow-up', role: 'farmer' },
    { id: 'extension-dashboard', label: '👨🌾 Extension', role: 'extension' },
    { id: 'official-dashboard', label: '🏛 Official Hub', role: 'official' },
    { id: 'alerts', label: '🔔 Alerts', role: 'all' },
    { id: 'reports', label: '📈 Reports', role: 'all' },
    { id: 'settings', label: '⚙️ Settings', role: 'all' },
    { id: 'admin-arch', label: '💻 Architecture & DB', role: 'all' }
  ];

  navContainer.innerHTML = navItems.map(item => `
    <button onclick="navigateTo('${item.id}')" data-view="${item.id}"
      class="nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 border border-transparent hover:border-emerald-500/40 hover:bg-emerald-900/30 text-emerald-200/90 whitespace-nowrap">
      ${item.label}
    </button>
  `).join('');
}

function renderCurrentView() {
  const container = document.getElementById('app-view-container');
  if (!container) return;

  const view = window.appState.currentView;
  
  switch(view) {
    case 'landing':
      container.innerHTML = renderLandingPage();
      break;
    case 'farmer-dashboard':
      container.innerHTML = renderFarmerDashboard();
      break;
    case 'scanner':
      container.innerHTML = renderCropScannerPage();
      initScannerListeners();
      break;
    case 'plant-rec':
      container.innerHTML = renderPlantRecognitionPage();
      initPlantRecListeners();
      break;
    case 'detection-result':
      container.innerHTML = renderDetectionResultPage();
      break;
    case 'risk-forecast':
      container.innerHTML = renderRiskForecastPage();
      initRiskCalculators();
      break;
    case 'weather':
      container.innerHTML = renderWeatherDashboard();
      break;
    case 'pest-sensor':
      container.innerHTML = renderPestSensorDashboard();
      initPestChart();
      break;
    case 'gis-map':
      container.innerHTML = renderGisMapPage();
      initLeafletMap();
      break;
    case 'ipm-advisory':
      container.innerHTML = renderIpmAdvisoryPage();
      break;
    case 'expert-validation':
      container.innerHTML = renderExpertValidationPage();
      break;
    case 'lab-referral':
      container.innerHTML = renderLabReferralPage();
      break;
    case 'follow-up':
      container.innerHTML = renderFollowUpPage();
      initComparisonSlider();
      break;
    case 'extension-dashboard':
      container.innerHTML = renderExtensionDashboard();
      break;
    case 'official-dashboard':
      container.innerHTML = renderOfficialDashboard();
      initOfficialCharts();
      break;
    case 'alerts':
      container.innerHTML = renderAlertsPage();
      break;
    case 'reports':
      container.innerHTML = renderReportsPage();
      break;
    case 'settings':
      container.innerHTML = renderSettingsPage();
      break;
    case 'admin-arch':
      container.innerHTML = renderAdminArchPage();
      break;
    default:
      container.innerHTML = renderLandingPage();
  }

  // Update step indicator highlight
  updateDemoStepBar();
}

// ----------------------------------------------------
// Guided Demo Tour Bar (Item 34)
// ----------------------------------------------------
function updateDemoStepBar() {
  const demoBar = document.getElementById('demo-guide-bar');
  if (!demoBar) return;

  const steps = [
    { num: 1, title: "1. Landing Page", view: "landing" },
    { num: 2, title: "2. Scan My Crop", view: "scanner" },
    { num: 3, title: "3. AI Scan Run", view: "scanner" },
    { num: 4, title: "4. AI Diagnosis Result", view: "detection-result" },
    { num: 5, title: "5. Risk Forecast Engine", view: "risk-forecast" },
    { num: 6, title: "6. Weather Intelligence", view: "weather" },
    { num: 7, title: "7. IoT & Pest Traps", view: "pest-sensor" },
    { num: 8, title: "8. GIS Hotspot Map", view: "gis-map" },
    { num: 9, title: "9. IPM Recommendations", view: "ipm-advisory" },
    { num: 10, title: "10. Multilingual Advisory", view: "ipm-advisory" },
    { num: 11, title: "11. Farmer Alert Preview", view: "alerts" },
    { num: 12, title: "12. Expert Review Queue", view: "expert-validation" },
    { num: 13, title: "13. Lab Referral System", view: "lab-referral" },
    { num: 14, title: "14. Follow-up Tracking", view: "follow-up" },
    { num: 15, title: "15. Extension Dashboard", view: "extension-dashboard" },
    { num: 16, title: "16. Official Analytics", view: "official-dashboard" },
    { num: 17, title: "17. ML Feedback Loop", view: "admin-arch" }
  ];

  demoBar.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 text-xs font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
      <div class="flex items-center gap-2 text-emerald-400 font-bold">
        <span>🚀 DEMO SCENARIO TOUR:</span>
      </div>
      <div class="flex items-center gap-1.5 overflow-x-auto py-1">
        ${steps.map(s => `
          <button onclick="runDemoStep(${s.num}, '${s.view}')" 
            class="px-2.5 py-1 rounded-md transition ${window.appState.demoStep === s.num ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800/60'}">
            ${s.title}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function runDemoStep(stepNum, viewId) {
  window.appState.demoStep = stepNum;
  if (viewId === 'scanner' && stepNum === 3) {
    navigateTo('scanner');
    setTimeout(() => startAiScanAnimation(), 400);
  } else {
    navigateTo(viewId);
  }
}

// ----------------------------------------------------
// Speech Synthesis (Multilingual Audio Advisory)
// ----------------------------------------------------
function speakAdvisory(langCode) {
  if (!('speechSynthesis' in window)) {
    showToast("Speech synthesis is not supported on this browser.", "error");
    return;
  }

  const adv = window.KISAN_DATA.multilingualAdvisories[langCode] || window.KISAN_DATA.multilingualAdvisories['en'];
  window.speechSynthesis.cancel(); // Stop any active speech

  const utterance = new SpeechSynthesisUtterance(adv.text);
  const langMap = {
    hi: 'hi-IN', en: 'en-US', bn: 'bn-IN', mr: 'mr-IN',
    te: 'te-IN', ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN', pa: 'pa-IN'
  };

  utterance.lang = langMap[langCode] || 'hi-IN';
  utterance.rate = 0.95;

  showToast(`🔊 Playing voice advisory in ${langCode.toUpperCase()}...`);
  window.speechSynthesis.speak(utterance);
}

// ----------------------------------------------------
// PAGE 1: LANDING PAGE
// ----------------------------------------------------
function renderLandingPage() {
  return `
    <div class="space-y-16 py-4">
      <!-- HERO SECTION -->
      <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-8 lg:p-14 shadow-2xl">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div class="grid lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <!-- Text CTA -->
          <div class="lg:col-span-7 space-y-6 text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <span>🌱 Smart Crop Health Early Warning & Decision Support</span>
            </div>
            
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Detect Early.<br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">Protect Crops.</span><br/>
              Grow Smarter.
            </h1>

            <p class="text-lg text-emerald-100/90 font-light max-w-2xl leading-relaxed">
              AI-powered crop health monitoring, early warning and integrated pest management for farmers and agriculture officials. Protect yields before diseases spread.
            </p>

            <div class="flex flex-wrap items-center gap-4 pt-2">
              <button onclick="navigateTo('scanner')" class="px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-3">
                <span>📷</span> Scan My Crop
              </button>
              <button onclick="navigateTo('risk-forecast')" class="px-7 py-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-bold text-lg transition flex items-center gap-3">
                <span>📊</span> View Crop Risk
              </button>
            </div>

            <!-- Key Badges -->
            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/40 text-emerald-200/90 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-emerald-400 text-lg">🤖</span> Computer Vision AI
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-400 text-lg">🌦</span> Weather + IoT Risk
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-400 text-lg">👨🔬</span> Expert Validated
              </div>
            </div>
          </div>

          <!-- Visual Illustration Graphic -->
          <div class="lg:col-span-5 relative">
            <div class="glass-card p-6 border-emerald-500/30 rounded-2xl relative space-y-4 shadow-2xl">
              
              <div class="relative rounded-xl overflow-hidden h-64 bg-slate-950 flex items-center justify-center border border-emerald-500/30 scanner-overlay">
                <!-- Leaf graphic SVG -->
                <svg class="w-full h-full p-4" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M120 160C120 160 50 130 40 70C30 10 120 20 120 20C120 20 210 10 200 70C190 130 120 160 120 160Z" fill="#047857" opacity="0.3"/>
                  <path d="M120 160C120 160 65 125 60 75C55 25 120 30 120 30C120 30 185 25 180 75C175 125 120 160 120 160Z" fill="#10B981" opacity="0.7"/>
                  <path d="M120 30V160" stroke="#064E3B" stroke-width="4"/>
                  <!-- Lesion spots -->
                  <circle cx="95" cy="75" r="14" fill="#B45309" opacity="0.8"/>
                  <circle cx="95" cy="75" r="8" fill="#78350F"/>
                  <circle cx="145" cy="105" r="18" fill="#B45309" opacity="0.8"/>
                  <circle cx="145" cy="105" r="10" fill="#78350F"/>
                </svg>

                <div class="scanner-beam"></div>

                <!-- Floating AI Tag -->
                <div class="absolute top-3 left-3 bg-slate-900/90 border border-emerald-500/50 rounded-lg px-3 py-1 text-xs text-emerald-300 font-mono flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  AI SCANNING: Tomato Early Blight (91%)
                </div>

                <div class="absolute bottom-3 right-3 bg-red-950/90 border border-red-500/50 rounded-lg px-3 py-1 text-xs text-red-300 font-bold">
                  🔴 HIGH RISK: 89/100
                </div>
              </div>

              <!-- Floating Live Stats -->
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center gap-3">
                  <span class="text-2xl">🌦</span>
                  <div>
                    <div class="text-emerald-400 font-semibold">Weather Risk</div>
                    <div class="text-slate-300">Humidity 84% • Rain 18mm</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center gap-3">
                  <span class="text-2xl">🪤</span>
                  <div>
                    <div class="text-emerald-400 font-semibold">Pest Traps</div>
                    <div class="text-slate-300">18 Pests/Day (↑ 45%)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 5: PROBLEM SECTION -->
      <section class="space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <h2 class="text-3xl font-extrabold text-white">Why Early Detection Matters</h2>
          <p class="text-emerald-200/80">Traditional reactive farming causes severe crop damage before treatment begins.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card p-6 space-y-3 border-red-500/20 hover:border-red-500/40 transition">
            <div class="text-3xl">⚠️</div>
            <h3 class="text-lg font-bold text-white">Late Detection</h3>
            <p class="text-sm text-slate-300">Farmers often recognize diseases only after visible crop damage has spread across entire fields.</p>
          </div>

          <div class="glass-card p-6 space-y-3 border-amber-500/20 hover:border-amber-500/40 transition">
            <div class="text-3xl">👨🌾</div>
            <h3 class="text-lg font-bold text-white">Limited Expert Access</h3>
            <p class="text-sm text-slate-300">Extension workers and laboratories cannot physically reach every affected farm in real time.</p>
          </div>

          <div class="glass-card p-6 space-y-3 border-yellow-500/20 hover:border-yellow-500/40 transition">
            <div class="text-3xl">🌦</div>
            <h3 class="text-lg font-bold text-white">Fragmented Information</h3>
            <p class="text-sm text-slate-300">Weather, crop stage, soil, variety and pest history are rarely combined into actionable advisories.</p>
          </div>

          <div class="glass-card p-6 space-y-3 border-red-500/20 hover:border-red-500/40 transition">
            <div class="text-3xl">🧪</div>
            <h3 class="text-lg font-bold text-white">Incorrect Treatment</h3>
            <p class="text-sm text-slate-300">Wrong diagnosis leads to delayed treatment, unnecessary chemical cost, environmental harm and crop loss.</p>
          </div>
        </div>

        <!-- INFOGRAPHIC COMPARISON -->
        <div class="glass-card p-8 space-y-8 rounded-2xl border-emerald-500/30">
          <h3 class="text-xl font-bold text-emerald-300 text-center">Transforming Crop Health Management</h3>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Traditional -->
            <div class="p-6 rounded-xl bg-red-950/40 border border-red-500/30 space-y-4">
              <h4 class="text-red-400 font-bold uppercase text-xs tracking-wider">Traditional Reactive Paradigm</h4>
              <div class="flex flex-wrap items-center justify-between text-xs font-semibold gap-2 text-red-200">
                <span class="p-2 rounded bg-red-900/60">Disease Begins</span> ➔ 
                <span class="p-2 rounded bg-red-900/60">Symptoms Appear</span> ➔ 
                <span class="p-2 rounded bg-red-900/60">Damage Spreads</span> ➔ 
                <span class="p-2 rounded bg-red-900/60">Farmer Notices</span> ➔ 
                <span class="p-2 rounded bg-red-950 text-red-400 font-bold">Treatment Delayed</span>
              </div>
            </div>

            <!-- Proposed KISANSETU -->
            <div class="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-4">
              <h4 class="text-emerald-400 font-bold uppercase text-xs tracking-wider">🌱 KISANSETU Proactive Paradigm</h4>
              <div class="flex flex-wrap items-center justify-between text-xs font-semibold gap-2 text-emerald-200">
                <span class="p-2 rounded bg-emerald-900/60">Early Signal</span> ➔ 
                <span class="p-2 rounded bg-emerald-900/60">AI Detection</span> ➔ 
                <span class="p-2 rounded bg-emerald-900/60">Risk Forecast</span> ➔ 
                <span class="p-2 rounded bg-emerald-900/60">Expert Validation</span> ➔ 
                <span class="p-2 rounded bg-emerald-800 text-emerald-300 font-bold">IPM Action</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 6: SOLUTION SECTION -->
      <section class="space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <h2 class="text-3xl font-extrabold text-white">One Intelligent Crop Health Platform</h2>
          <p class="text-emerald-200/80">Combining computer vision, agro-meteorology, IoT sensing, and expert validation.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-card p-6 space-y-3 glass-card-hover cursor-pointer" onclick="navigateTo('scanner')">
            <div class="text-4xl">📷</div>
            <h3 class="text-lg font-bold text-white">AI Image Detection</h3>
            <p class="text-sm text-slate-300">Analyze leaf photos in seconds to spot early fungal lesions, bacterial blights, and pest infestations.</p>
          </div>

          <div class="glass-card p-6 space-y-3 glass-card-hover cursor-pointer" onclick="navigateTo('pest-sensor')">
            <div class="text-4xl">🪤</div>
            <h3 class="text-lg font-bold text-white">Pest Trap & Sensor Monitoring</h3>
            <p class="text-sm text-slate-300">Monitor IoT light traps, pheromone counters, soil moisture, and leaf wetness in real time.</p>
          </div>

          <div class="glass-card p-6 space-y-3 glass-card-hover cursor-pointer" onclick="navigateTo('weather')">
            <div class="text-4xl">🌦</div>
            <h3 class="text-lg font-bold text-white">Weather Risk Forecasting</h3>
            <p class="text-sm text-slate-300">Predict fungal spore germination using 7-day temperature, humidity, and rainfall forecasts.</p>
          </div>

          <div class="glass-card p-6 space-y-3 glass-card-hover cursor-pointer" onclick="navigateTo('gis-map')">
            <div class="text-4xl">🗺</div>
            <h3 class="text-lg font-bold text-white">Geospatial Hotspots</h3>
            <p class="text-sm text-slate-300">Identify village and block-level disease clusters on an interactive GIS map for targeted extension.</p>
          </div>

          <div class="glass-card p-6 space-y-3 glass-card-hover cursor-pointer" onclick="navigateTo('expert-validation')">
            <div class="text-4xl">👨🔬</div>
            <h3 class="text-lg font-bold text-white">Expert Validation</h3>
            <p class="text-sm text-slate-300">Agricultural experts review low-confidence AI scans and refer complex cases to pathology laboratories.</p>
          </div>

          <div class="glass-card p-6 space-y-3 glass-card-hover cursor-pointer" onclick="navigateTo('ipm-advisory')">
            <div class="text-4xl">🌱</div>
            <h3 class="text-lg font-bold text-white">IPM Advisory</h3>
            <p class="text-sm text-slate-300">Get safer, eco-friendly Integrated Pest Management advisories in your local language.</p>
          </div>
        </div>
      </section>

      <!-- SECTION 32: HOME PAGE WORKFLOW VISUAL -->
      <section class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-8">
        <div class="text-center space-y-2">
          <h2 class="text-3xl font-extrabold text-white">End-to-End System Workflow</h2>
          <p class="text-emerald-200/80">From crop leaf scan to machine learning feedback loop.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3 text-center text-xs font-semibold">
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">📷</div>
            <div class="text-emerald-300">1. CAPTURE</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">🤖</div>
            <div class="text-emerald-300">2. AI DETECT</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">🌦</div>
            <div class="text-emerald-300">3. WEATHER</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">🧠</div>
            <div class="text-emerald-300">4. RISK FORECAST</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">🗺</div>
            <div class="text-emerald-300">5. GIS MAP</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">👨🔬</div>
            <div class="text-emerald-300">6. EXPERT</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">🌱</div>
            <div class="text-emerald-300">7. IPM ACTION</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">📱</div>
            <div class="text-emerald-300">8. ALERT</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">🔄</div>
            <div class="text-emerald-300">9. FOLLOW-UP</div>
          </div>
          <div class="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <div class="text-2xl">📚</div>
            <div class="text-emerald-300">10. ML LEARN</div>
          </div>
        </div>
      </section>

      <!-- SECTION 33: REFERENCES SECTION -->
      <section class="space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <h2 class="text-2xl font-bold text-white">Authoritative Institutional References</h2>
          <p class="text-sm text-emerald-200/70">Aligned with global and national plant biosecurity frameworks.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          ${window.KISAN_DATA.references.map(ref => `
            <a href="${ref.url}" target="_blank" class="glass-card p-5 rounded-xl border-emerald-500/20 hover:border-emerald-500/50 transition block space-y-2">
              <div class="text-xs font-bold text-emerald-400 uppercase tracking-wide">Institutional Source</div>
              <h4 class="font-bold text-white text-sm hover:underline">${ref.title}</h4>
              <p class="text-xs text-slate-300 leading-relaxed">${ref.desc}</p>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- SECTION 35: FINAL UI MESSAGE CTA -->
      <section class="text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 border border-emerald-500/40 space-y-6">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">From Reactive Farming to Proactive Crop Health</h2>
        <div class="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-emerald-200">
          <span>Detect Early</span> • <span>Forecast Locally</span> • <span>Validate Intelligently</span> • <span>Act Safely</span> • <span>Monitor Continuously</span>
        </div>
        <div>
          <button onclick="navigateTo('scanner')" class="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-black text-lg shadow-xl transition transform hover:scale-105">
            🚀 Start Crop Health Scan
          </button>
        </div>
      </section>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 2: FARMER DASHBOARD
// ----------------------------------------------------
function renderFarmerDashboard() {
  const fields = window.KISAN_DATA.farmerFields;
  return `
    <div class="space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>👨🌾</span> Farmer Field Dashboard
          </h1>
          <p class="text-emerald-200/80 text-sm">Welcome back, ${window.KISAN_DATA.currentUser.name} • ${window.KISAN_DATA.currentUser.location}</p>
        </div>
        <button onclick="navigateTo('scanner')" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow flex items-center gap-2 transition">
          <span>📷</span> Scan New Crop
        </button>
      </div>

      <!-- Top Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 flex items-center gap-4">
          <div class="p-3 bg-emerald-900/60 rounded-xl text-3xl">🌱</div>
          <div>
            <div class="text-xs font-semibold text-emerald-300">Healthy Fields</div>
            <div class="text-3xl font-black text-white">8</div>
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-amber-500/30 flex items-center gap-4">
          <div class="p-3 bg-amber-900/60 rounded-xl text-3xl">⚠️</div>
          <div>
            <div class="text-xs font-semibold text-amber-300">Active Risks</div>
            <div class="text-3xl font-black text-amber-400">3</div>
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-red-500/30 flex items-center gap-4">
          <div class="p-3 bg-red-900/60 rounded-xl text-3xl">🔴</div>
          <div>
            <div class="text-xs font-semibold text-red-300">High Risk Fields</div>
            <div class="text-3xl font-black text-red-400">1</div>
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 flex items-center gap-4">
          <div class="p-3 bg-emerald-900/60 rounded-xl text-3xl">📷</div>
          <div>
            <div class="text-xs font-semibold text-emerald-300">Recent Scans</div>
            <div class="text-3xl font-black text-white">12</div>
          </div>
        </div>
      </div>

      <!-- My Fields -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white">My Fields & Crop Health</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          ${fields.map(f => {
            const isHigh = f.riskScore >= 70;
            const badgeClass = isHigh ? "bg-red-950 border-red-500 text-red-300" : (f.riskScore >= 50 ? "bg-amber-950 border-amber-500 text-amber-300" : "bg-emerald-950 border-emerald-500 text-emerald-300");
            return `
              <div class="glass-card p-6 space-y-4 border-emerald-500/30 glass-card-hover">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-white">${f.name}</h3>
                    <div class="text-xs text-emerald-200/80">${f.crop} • ${f.variety} • ${f.area}</div>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}">
                    Risk: ${f.riskScore}/100 (${f.riskLevel})
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-emerald-500/20">
                  <div><span class="text-slate-400">Growth Stage:</span> <span class="font-medium text-white">${f.stage}</span></div>
                  <div><span class="text-slate-400">Location:</span> <span class="font-medium text-white">${f.location}</span></div>
                  <div><span class="text-slate-400">Status:</span> <span class="font-medium text-amber-300">${f.healthStatus}</span></div>
                  <div><span class="text-slate-400">Last Scanned:</span> <span class="font-medium text-white">${f.lastScan}</span></div>
                </div>

                <div class="flex items-center justify-between pt-2">
                  <button onclick="navigateTo('scanner')" class="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-bold rounded-lg transition">
                    📷 Rescan Field
                  </button>
                  <button onclick="navigateTo('risk-forecast')" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition">
                    View Details ➔
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 3: CROP HEALTH SCANNER
// ----------------------------------------------------
function renderCropScannerPage() {
  return `
    <div class="max-w-4xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>📷</span> Scan Your Crop
        </h1>
        <p class="text-emerald-200/80 text-sm">Upload or capture crop leaf symptoms for instant AI multi-factor analysis.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        
        <!-- Form Inputs -->
        <div class="grid md:grid-cols-3 gap-4 text-left">
          <div>
            <label class="block text-xs font-bold text-emerald-300 uppercase tracking-wide mb-1">Crop Type</label>
            <select id="scan-crop-select" class="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400">
              ${window.KISAN_DATA.crops.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-emerald-300 uppercase tracking-wide mb-1">Variety</label>
            <select id="scan-variety-select" class="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400">
              <option value="Pusa Basmati 1121">Pusa Basmati 1121</option>
              <option value="Arka Rakshak">Arka Rakshak (Tomato)</option>
              <option value="HD-2967">HD-2967 (Wheat)</option>
              <option value="Bt-Cotton RCH 659">Bt-Cotton RCH 659</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-emerald-300 uppercase tracking-wide mb-1">Growth Stage</label>
            <select id="scan-stage-select" class="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400">
              ${window.KISAN_DATA.growthStages.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Location GPS -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs">
          <div class="flex items-center gap-2 text-slate-300">
            <span>📍 GPS Location:</span>
            <span id="gps-coords-display" class="font-mono text-emerald-400">Lat: 29.6857 N, Lng: 76.9905 E (Rampur, Block B)</span>
          </div>
          <button onclick="autofillGps()" class="px-3 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 rounded font-medium">Refetch GPS</button>
        </div>

        <!-- Sample Leaf Image Selector for Fast Testing -->
        <div class="space-y-2 text-left">
          <label class="block text-xs font-bold text-emerald-300 uppercase tracking-wide">Select Demo Sample Leaf Image or Upload Custom:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onclick="selectSampleLeaf('tomato')" id="sample-btn-tomato" class="sample-leaf-btn p-3 rounded-xl border border-emerald-500/40 bg-slate-950 text-left hover:bg-emerald-950/50 transition">
              <div class="text-2xl">🍅</div>
              <div class="text-xs font-bold text-white">Tomato Leaf</div>
              <div class="text-[10px] text-emerald-400">Early Blight Lesion</div>
            </button>
            <button onclick="selectSampleLeaf('rice')" id="sample-btn-rice" class="sample-leaf-btn p-3 rounded-xl border border-emerald-500/20 bg-slate-950 text-left hover:bg-emerald-950/50 transition">
              <div class="text-2xl">🌾</div>
              <div class="text-xs font-bold text-white">Rice Leaf</div>
              <div class="text-[10px] text-emerald-400">Brown Spot Lesion</div>
            </button>
            <button onclick="selectSampleLeaf('wheat')" id="sample-btn-wheat" class="sample-leaf-btn p-3 rounded-xl border border-emerald-500/20 bg-slate-950 text-left hover:bg-emerald-950/50 transition">
              <div class="text-2xl">🌾</div>
              <div class="text-xs font-bold text-white">Wheat Foliage</div>
              <div class="text-[10px] text-emerald-400">Powdery Mildew</div>
            </button>
            <button onclick="selectSampleLeaf('cotton')" id="sample-btn-cotton" class="sample-leaf-btn p-3 rounded-xl border border-emerald-500/20 bg-slate-950 text-left hover:bg-emerald-950/50 transition">
              <div class="text-2xl">🌱</div>
              <div class="text-xs font-bold text-white">Cotton Shoot</div>
              <div class="text-[10px] text-emerald-400">Aphid Cluster</div>
            </button>
          </div>
        </div>

        <!-- Upload Drag & Drop Area -->
        <div id="drop-zone" class="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-8 text-center bg-slate-950/40 cursor-pointer transition space-y-4">
          <input type="file" id="file-input" class="hidden" accept="image/*" onchange="handleFileSelect(event)">
          <div class="text-5xl text-emerald-400">📷</div>
          <div>
            <div class="text-lg font-bold text-white">Upload Crop Image or Take Photo</div>
            <div class="text-xs text-emerald-200/70">Supports JPG, PNG, WEBP from camera or gallery</div>
          </div>
          <button onclick="document.getElementById('file-input').click()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow">
            Browse Files / Open Camera
          </button>
        </div>

        <!-- Selected Image Preview & Scan Action -->
        <div id="preview-area" class="space-y-4">
          <div class="relative rounded-xl overflow-hidden max-h-64 bg-slate-950 border border-emerald-500/30 flex items-center justify-center p-4">
            <div id="leaf-visual-graphic" class="w-full h-48 flex items-center justify-center">
              <!-- Rendered SVG Leaf Sample -->
            </div>
          </div>

          <!-- AI Scanning Animation Container -->
          <div id="scanner-progress-container" class="hidden space-y-3 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50">
            <div class="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span id="scan-step-status">Analyzing crop symptoms...</span>
              <span id="scan-percent">25%</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-emerald-500/30">
              <div id="scan-progress-bar" class="bg-gradient-to-r from-emerald-500 to-lime-400 h-full w-1/4 transition-all duration-500"></div>
            </div>
          </div>

          <button onclick="startAiScanAnimation()" id="run-scan-btn" class="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-extrabold text-lg shadow-xl transition transform hover:scale-[1.01]">
            🔍 ANALYZE CROP HEALTH WITH AI
          </button>
        </div>

      </div>
    </div>
  `;
}

function initScannerListeners() {
  selectSampleLeaf('tomato');
}

function selectSampleLeaf(diseaseKey) {
  window.selectedLeafKey = diseaseKey;
  
  // Highlight active button
  document.querySelectorAll('.sample-leaf-btn').forEach(btn => {
    btn.classList.remove('border-emerald-500', 'bg-emerald-950/80');
    btn.classList.add('border-emerald-500/20', 'bg-slate-950');
  });

  const activeBtn = document.getElementById(`sample-btn-${diseaseKey}`);
  if (activeBtn) {
    activeBtn.classList.remove('border-emerald-500/20', 'bg-slate-950');
    activeBtn.classList.add('border-emerald-500', 'bg-emerald-950/80');
  }

  // Update crop select dropdown
  const cropSelect = document.getElementById('scan-crop-select');
  if (cropSelect) {
    const keyMap = { tomato: 'tomato', rice: 'rice', wheat: 'wheat', cotton: 'cotton' };
    cropSelect.value = keyMap[diseaseKey] || 'tomato';
  }

  // Render SVG visual representation
  const visualContainer = document.getElementById('leaf-visual-graphic');
  if (visualContainer) {
    visualContainer.innerHTML = getSampleLeafSvg(diseaseKey);
  }
}

function getSampleLeafSvg(key) {
  if (key === 'tomato') {
    return `
      <svg class="w-full h-full" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 160C150 160 80 140 70 75C60 10 150 20 150 20C150 20 240 10 230 75C220 140 150 160 150 160Z" fill="#15803D" opacity="0.8"/>
        <path d="M150 20V160" stroke="#052E16" stroke-width="4"/>
        <circle cx="120" cy="70" r="16" fill="#B45309" stroke="#FEF08A" stroke-width="2"/>
        <circle cx="120" cy="70" r="8" fill="#451A03"/>
        <circle cx="180" cy="110" r="22" fill="#B45309" stroke="#FEF08A" stroke-width="2"/>
        <circle cx="180" cy="110" r="12" fill="#451A03"/>
      </svg>
    `;
  } else if (key === 'rice') {
    return `
      <svg class="w-full h-full" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 140 Q150 40 260 140 Q150 100 40 140Z" fill="#166534" opacity="0.8"/>
        <ellipse cx="110" cy="115" rx="18" ry="8" fill="#78350F" stroke="#FDE047" stroke-width="2"/>
        <ellipse cx="180" cy="110" rx="22" ry="10" fill="#78350F" stroke="#FDE047" stroke-width="2"/>
      </svg>
    `;
  } else if (key === 'wheat') {
    return `
      <svg class="w-full h-full" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 150 C100 30, 200 30, 250 150" stroke="#15803D" stroke-width="30" stroke-linecap="round"/>
        <circle cx="120" cy="85" r="18" fill="#F3F4F6" opacity="0.9"/>
        <circle cx="160" cy="75" r="22" fill="#F3F4F6" opacity="0.9"/>
        <circle cx="200" cy="95" r="15" fill="#F3F4F6" opacity="0.9"/>
      </svg>
    `;
  } else {
    return `
      <svg class="w-full h-full" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 30 Q70 70 90 140 Q150 160 210 140 Q230 70 150 30Z" fill="#166534"/>
        <circle cx="130" cy="80" r="4" fill="#0284C7"/>
        <circle cx="138" cy="84" r="4" fill="#0284C7"/>
        <circle cx="145" cy="78" r="4" fill="#0284C7"/>
        <circle cx="160" cy="110" r="5" fill="#0284C7"/>
        <circle cx="168" cy="115" r="4" fill="#0284C7"/>
      </svg>
    `;
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    showToast(`Loaded image: ${file.name}`);
  }
}

function autofillGps() {
  showToast("📍 Refetched GPS: Lat 29.6857 N, Lng 76.9905 E (High Precision)");
}

function startAiScanAnimation() {
  const container = document.getElementById('scanner-progress-container');
  const btn = document.getElementById('run-scan-btn');
  const statusEl = document.getElementById('scan-step-status');
  const percentEl = document.getElementById('scan-percent');
  const progressBar = document.getElementById('scan-progress-bar');

  if (!container || !btn) return;

  container.classList.remove('hidden');
  btn.disabled = true;
  btn.classList.add('opacity-50');

  const steps = [
    { text: "Analyzing crop symptoms...", pct: 25 },
    { text: "Checking disease patterns against database...", pct: 50 },
    { text: "Comparing weather and field conditions...", pct: 75 },
    { text: "Generating crop-health risk & IPM advisory...", pct: 100 }
  ];

  let current = 0;

  const interval = setInterval(() => {
    if (current < steps.length) {
      statusEl.textContent = steps[current].text;
      percentEl.textContent = `${steps[current].pct}%`;
      progressBar.style.width = `${steps[current].pct}%`;
      current++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        // Map key to disease result
        const leafKey = window.selectedLeafKey || 'tomato';
        const keyMap = { tomato: 'early_blight', rice: 'brown_spot', wheat: 'powdery_mildew', cotton: 'aphid_infestation' };
        const diseaseObj = window.KISAN_DATA.diseases[keyMap[leafKey]] || window.KISAN_DATA.diseases['early_blight'];

        navigateTo('detection-result', { scanResult: diseaseObj });
      }, 500);
    }
  }, 600);
}

// ----------------------------------------------------
// PAGE 4: AI DETECTION RESULT
// ----------------------------------------------------
function renderDetectionResultPage() {
  const result = window.appState.currentScanResult || window.KISAN_DATA.diseases['early_blight'];
  const isHigh = result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL';

  return `
    <div class="max-w-4xl mx-auto space-y-8 py-4">
      <div class="flex items-center justify-between">
        <button onclick="navigateTo('scanner')" class="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-2">
          ⬅ Back to Scanner
        </button>
        <div class="text-xs text-emerald-200/70">Scan ID: #SCN-99824 • Timestamp: Just Now</div>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-8">
        
        <!-- Header Banner -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl ${isHigh ? 'bg-red-950/80 border border-red-500/60' : 'bg-emerald-950/80 border border-emerald-500/60'} shadow-xl">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-300">AI Analysis Result</div>
            <h1 class="text-3xl font-extrabold text-white mt-1">${result.name}</h1>
            <div class="text-xs italic text-slate-300 mt-0.5">Scientific Name: ${result.scientificName}</div>
          </div>
          <div class="text-right space-y-1">
            <div class="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold border ${isHigh ? 'bg-red-900 text-red-200 border-red-400' : 'bg-emerald-900 text-emerald-200 border-emerald-400'}">
              Risk Level: 🔴 ${result.riskLevel}
            </div>
            <div class="text-xs text-slate-300 font-mono">Confidence: <span class="font-bold text-white">${result.confidence}%</span></div>
          </div>
        </div>

        <!-- Confidence Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-emerald-300">AI Diagnostic Confidence: ${result.confidence}%</span>
            <span class="text-slate-400">High Confidence Baseline (>85%)</span>
          </div>
          <div class="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-emerald-500/30">
            <div class="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-700" style="width: ${result.confidence}%"></div>
          </div>
        </div>

        <!-- Symptoms & AI Recommendation -->
        <div class="grid md:grid-cols-2 gap-6 text-left">
          <div class="p-6 rounded-2xl bg-slate-950/60 border border-emerald-500/30 space-y-3">
            <h3 class="text-base font-bold text-emerald-300 flex items-center gap-2">
              <span>🔍</span> Observed Leaf Symptoms
            </h3>
            <ul class="space-y-2 text-xs text-slate-200">
              ${result.symptoms.map(s => `<li class="flex items-start gap-2"><span class="text-emerald-400 font-bold">•</span> <span>${s}</span></li>`).join('')}
            </ul>
          </div>

          <div class="p-6 rounded-2xl bg-slate-950/60 border border-emerald-500/30 space-y-3">
            <h3 class="text-base font-bold text-emerald-300 flex items-center gap-2">
              <span>💡</span> AI Primary Recommendation
            </h3>
            <p class="text-sm text-emerald-100 font-medium leading-relaxed">${result.recommendation}</p>
            <div class="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-200">
              <strong>SAFETY MANDATE:</strong> This AI system provides decision support and does not blindly prescribe chemical treatments. Confirm symptoms before application.
            </div>
          </div>
        </div>

        <!-- Low Confidence Fallback Demo Switch -->
        <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 flex items-center justify-between text-xs">
          <span class="text-slate-300">Simulate Low Confidence Fallback Scenario (<70%):</span>
          <button onclick="toggleLowConfidenceDemo()" class="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-amber-200 rounded font-bold transition">
            ⚠️ Test Low Confidence Mode
          </button>
        </div>

        <div id="low-confidence-box" class="hidden p-6 rounded-2xl bg-amber-950/80 border border-amber-500/80 space-y-3 text-left">
          <h4 class="text-amber-300 font-bold flex items-center gap-2">
            <span>⚠️</span> Low AI Confidence Diagnostic Alert
          </h4>
          <p class="text-xs text-amber-100">
            AI confidence is insufficient for a reliable diagnostic result. Please capture clearer leaf images under direct sunlight or request expert field validation.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <button onclick="navigateTo('scanner')" class="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-lg">Upload More Images</button>
            <button onclick="navigateTo('expert-validation')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg">Contact Expert</button>
            <button onclick="navigateTo('lab-referral')" class="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-lg">Refer to Laboratory</button>
          </div>
        </div>

        <!-- Primary Actions -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button onclick="navigateTo('risk-forecast')" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition">
            📊 View Multi-Factor Risk Forecast
          </button>
          <button onclick="navigateTo('ipm-advisory')" class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-extrabold text-sm shadow transition">
            🌱 Get IPM Recommendations
          </button>
        </div>

      </div>
    </div>
  `;
}

function toggleLowConfidenceDemo() {
  const box = document.getElementById('low-confidence-box');
  if (box) box.classList.toggle('hidden');
}

// ----------------------------------------------------
// PAGE 5: MULTI-FACTOR RISK ENGINE
// ----------------------------------------------------
function renderRiskForecastPage() {
  return `
    <div class="max-w-5xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>🧠</span> Multi-Factor Crop Health Risk Engine
        </h1>
        <p class="text-emerald-200/80 text-sm">Combining image evidence, weather models, pest traps, crop stage, and soil parameters.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-8">
        
        <!-- Score Card -->
        <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-red-950 via-slate-950 to-red-900 border border-red-500/60 space-y-3 shadow-2xl pulse-risk-red">
          <div class="text-xs font-bold text-red-300 uppercase tracking-widest">Composite Crop Health Risk Index</div>
          <div class="text-6xl font-black text-red-400">🔴 82 / 100</div>
          <div class="inline-block px-4 py-1 rounded-full bg-red-900/90 text-red-200 font-extrabold text-sm border border-red-400">
            CRITICAL RISK LEVEL
          </div>
          <p class="text-xs text-red-200/80 max-w-xl mx-auto pt-2">
            Configurable weighted analysis calibrated using agro-meteorological field data. High probability of fungal spore expansion.
          </p>
        </div>

        <!-- Weighted Contributing Factor Sliders / Meters -->
        <div class="space-y-4 text-left">
          <h3 class="text-lg font-bold text-white border-b border-emerald-500/30 pb-2">Risk Factor Contribution Breakdown</h3>

          <div class="space-y-4 text-xs font-semibold">
            
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-emerald-300">📷 Image Evidence Weight (35%)</span>
                <span class="text-red-400 font-bold">Contribution: 31.5 pts (Early Blight Spotted)</span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-3 border border-emerald-500/30 overflow-hidden">
                <div class="bg-red-500 h-full rounded-full" style="width: 90%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-emerald-300">🌦 Weather Risk Weight (20%)</span>
                <span class="text-red-400 font-bold">Contribution: 18.0 pts (Humidity 84%, Rain 18mm)</span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-3 border border-emerald-500/30 overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 90%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-emerald-300">🪤 Pest Trap Activity Weight (20%)</span>
                <span class="text-red-400 font-bold">Contribution: 16.0 pts (18 Pests/Day)</span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-3 border border-emerald-500/30 overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 80%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-emerald-300">📜 Historical Disease History Weight (10%)</span>
                <span class="text-emerald-400 font-bold">Contribution: 7.5 pts (Previous Outbreak Region)</span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-3 border border-emerald-500/30 overflow-hidden">
                <div class="bg-yellow-500 h-full rounded-full" style="width: 75%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-emerald-300">🌾 Crop Growth Stage Susceptibility (10%)</span>
                <span class="text-emerald-400 font-bold">Contribution: 6.0 pts (Flowering Stage)</span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-3 border border-emerald-500/30 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 60%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-emerald-300">💧 Soil & Field Conditions Weight (5%)</span>
                <span class="text-emerald-400 font-bold">Contribution: 3.0 pts (Soil Moisture 44%)</span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-3 border border-emerald-500/30 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 60%"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- Why is risk high bullet summary -->
        <div class="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-left space-y-3">
          <h4 class="text-base font-bold text-amber-400">Why is the risk score high?</h4>
          <ul class="grid md:grid-cols-2 gap-2 text-xs text-slate-200">
            <li class="flex items-center gap-2"><span>🔴</span> High relative humidity (>84%) speeds up spore germination.</li>
            <li class="flex items-center gap-2"><span>🔴</span> Recent 18mm rainfall creates prolonged leaf wetness.</li>
            <li class="flex items-center gap-2"><span>🔴</span> Ambient temperature 29°C is in optimal fungal development range.</li>
            <li class="flex items-center gap-2"><span>🔴</span> Crop is currently in highly susceptible flowering stage.</li>
            <li class="flex items-center gap-2"><span>🔴</span> Pest trap counts increased by 45% over 5 days.</li>
            <li class="flex items-center gap-2"><span>🔴</span> 23 nearby reports logged in Rampur village block.</li>
          </ul>
        </div>

      </div>
    </div>
  `;
}

function initRiskCalculators() {}

// ----------------------------------------------------
// PAGE 6: WEATHER DASHBOARD
// ----------------------------------------------------
function renderWeatherDashboard() {
  return `
    <div class="space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🌦</span> Weather Risk Intelligence
          </h1>
          <p class="text-emerald-200/80 text-sm">Agro-meteorological monitoring for disease-favourable micro-climates.</p>
        </div>
        <div class="px-4 py-2 rounded-xl bg-red-950 border border-red-500 text-red-300 font-bold text-xs">
          Disease Weather Risk: 🔴 CRITICAL
        </div>
      </div>

      <!-- Current Live Weather Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">Temperature</div>
          <div class="text-3xl font-black text-white">29°C</div>
          <div class="text-[11px] text-slate-400">Optimal fungal range (24-30°C)</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">Humidity</div>
          <div class="text-3xl font-black text-amber-400">84%</div>
          <div class="text-[11px] text-red-400">⚠️ Favourable for Blight</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">Rainfall</div>
          <div class="text-3xl font-black text-blue-400">18 mm</div>
          <div class="text-[11px] text-slate-400">Last 24 Hours</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">Wind Speed</div>
          <div class="text-3xl font-black text-white">11 km/h</div>
          <div class="text-[11px] text-slate-400">Spore dispersal speed</div>
        </div>
      </div>

      <!-- 7-Day Disease Risk Forecast -->
      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        <h3 class="text-xl font-bold text-white">7-Day Agro-Weather & Disease Risk Forecast</h3>

        <div class="grid sm:grid-cols-7 gap-3 text-center text-xs">
          ${window.KISAN_DATA.weatherForecast.map(w => `
            <div class="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
              <div class="font-bold text-emerald-300">${w.day}</div>
              <div class="text-2xl">${w.condition.includes('Rain') ? '🌧' : (w.condition.includes('Sun') ? '☀️' : '⛅')}</div>
              <div class="font-bold text-white">${w.temp}</div>
              <div class="text-slate-300">💧 ${w.humidity}</div>
              <div class="text-blue-400">☔ ${w.rain}</div>
              <div class="pt-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${w.risk.includes('Critical') ? 'bg-red-950 text-red-300 border border-red-500' : (w.risk.includes('High') ? 'bg-amber-950 text-amber-300 border border-amber-500' : 'bg-emerald-950 text-emerald-300')}">
                  ${w.risk}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="p-5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200">
          <strong>AGRO-METEOROLOGICAL ADVISORY:</strong> High relative humidity (>80%) combined with recent rainfall creates prolonged leaf wetness periods (>7 hours), creating high risk for fungal pathogens (Alternaria, Helminthosporium). Inspect fields promptly.
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 7: PEST TRAP & IoT DASHBOARD
// ----------------------------------------------------
function renderPestSensorDashboard() {
  return `
    <div class="space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🪤</span> Pest Trap & IoT Sensor Hub
          </h1>
          <p class="text-emerald-200/80 text-sm">Real-time light trap counts, leaf wetness sensors, and soil telemetry.</p>
        </div>
        <div class="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
          Sensor Status: 🟢 ALL ONLINE (ESP32 Gateway)
        </div>
      </div>

      <!-- Real-Time Sensor Cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">🌡 Temperature</div>
          <div class="text-2xl font-bold text-white">29.4 °C</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">💧 Soil Moisture</div>
          <div class="text-2xl font-bold text-white">38 %</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">💦 Humidity</div>
          <div class="text-2xl font-bold text-amber-400">84 %</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-red-500/30 space-y-1 bg-red-950/20">
          <div class="text-xs font-semibold text-red-300">🪤 Trap Count</div>
          <div class="text-2xl font-bold text-red-400">18 / Day</div>
          <div class="text-[10px] text-red-300">⚠️ Population Surge</div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">🍃 Leaf Wetness</div>
          <div class="text-2xl font-bold text-white">7.2 hrs</div>
        </div>
      </div>

      <!-- Pest Trend Chart Container -->
      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">Pest Population Daily Surveillance</h3>
            <p class="text-xs text-emerald-200/70">5-Day Trap Counter Trend Analysis</p>
          </div>
          <span class="px-3 py-1 bg-red-950 border border-red-500 text-red-300 text-xs font-bold rounded-lg">
            ⚠️ Pest Population Increasing (+350% over 5 days)
          </span>
        </div>

        <div class="h-64 relative bg-slate-950/80 rounded-2xl border border-emerald-500/30 p-4">
          <canvas id="pestChartCanvas"></canvas>
        </div>
      </div>
    </div>
  `;
}

function initPestChart() {
  const canvas = document.getElementById('pestChartCanvas');
  if (!canvas || !window.Chart) return;

  const ctx = canvas.getContext('2d');
  new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
      datasets: [{
        label: 'Light Trap Pest Counts',
        data: [4, 6, 8, 12, 18, 24],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: '#ef4444'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
      },
      plugins: {
        legend: { labels: { color: '#ecfdf5' } }
      }
    }
  });
}

// ----------------------------------------------------
// PAGE 8: GIS HOTSPOT MAP
// ----------------------------------------------------
function renderGisMapPage() {
  return `
    <div class="space-y-6 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🗺</span> Geospatial Crop Health Hotspots
          </h1>
          <p class="text-emerald-200/80 text-sm">Interactive GIS surveillance map showing disease clusters, reports, and extension workers.</p>
        </div>
        
        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-2">
          <select id="map-risk-filter" onchange="filterMapPins()" class="bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-white">
            <option value="all">Filter: All Risks</option>
            <option value="critical">🔴 Critical (>80)</option>
            <option value="high">🟠 High (60-80)</option>
            <option value="moderate">🟡 Moderate (<60)</option>
          </select>
          <button onclick="navigateTo('extension-dashboard')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">
            👨🌾 Extension Dashboard
          </button>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-6">
        <!-- Interactive Leaflet Map View -->
        <div class="lg:col-span-8 glass-card p-2 rounded-3xl border-emerald-500/40 h-[520px] relative overflow-hidden">
          <div id="leaflet-map-container" class="w-full h-full rounded-2xl"></div>
        </div>

        <!-- Hotspot Details Sidebar Panel -->
        <div class="lg:col-span-4 glass-card p-6 rounded-3xl border-emerald-500/40 space-y-4 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-white border-b border-emerald-500/30 pb-2">Active Village Hotspots</h3>
            <div id="hotspot-list-sidebar" class="space-y-3 mt-3 max-h-[380px] overflow-y-auto pr-1">
              ${window.KISAN_DATA.gisHotspots.map(h => `
                <div class="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition text-xs space-y-1" onclick="focusVillageOnMap(${h.lat}, ${h.lng})">
                  <div class="flex items-center justify-between font-bold">
                    <span class="text-white">${h.village} Village</span>
                    <span class="px-2 py-0.5 rounded ${h.riskScore >= 80 ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300'} font-bold">
                      Risk: ${h.riskScore}
                    </span>
                  </div>
                  <div class="text-emerald-300">${h.crop} • ${h.mainIssue}</div>
                  <div class="text-slate-400 flex justify-between">
                    <span>Reports: ${h.reports}</span>
                    <span class="text-amber-400">${h.trend}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <button onclick="openAssignWorkerModal()" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow transition">
            👨🌾 Assign Extension Worker to Hotspot
          </button>
        </div>
      </div>
    </div>
  `;
}

function initLeafletMap() {
  const container = document.getElementById('leaflet-map-container');
  if (!container || !window.L) return;

  // Initialize Leaflet Map centered around Karnal / North India region
  const map = window.L.map('leaflet-map-container').setView([29.6857, 76.9905], 11);

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors | KISANSETU GIS'
  }).addTo(map);

  window.kisansetuMap = map;

  // Add Village Marker Pins
  window.KISAN_DATA.gisHotspots.forEach(h => {
    const isCritical = h.riskScore >= 80;
    const color = isCritical ? 'red' : (h.riskScore >= 60 ? 'orange' : 'green');
    
    const circle = window.L.circleMarker([h.lat, h.lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.7,
      radius: 12
    }).addTo(map);

    circle.bindPopup(`
      <div class="p-2 space-y-1 text-xs">
        <h4 class="font-bold text-emerald-300 text-sm">${h.village} Village</h4>
        <div><strong>Crop:</strong> ${h.crop}</div>
        <div><strong>Main Issue:</strong> ${h.mainIssue}</div>
        <div><strong>Reports Logged:</strong> ${h.reports}</div>
        <div><strong>Risk Index:</strong> <span class="text-red-400 font-bold">${h.riskScore}/100 (${h.trend})</span></div>
        <div><strong>Assigned Officer:</strong> ${h.workerAssigned}</div>
        <button onclick="openAssignWorkerModal('${h.village}')" class="mt-2 w-full py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">Assign Extension Officer</button>
      </div>
    `);
  });
}

function focusVillageOnMap(lat, lng) {
  if (window.kisansetuMap) {
    window.kisansetuMap.flyTo([lat, lng], 13);
  }
}

function filterMapPins() {
  showToast("Filtered GIS Hotspot map layer markers");
}

function openAssignWorkerModal(villageName = "Rampur") {
  showToast(`Assigned Extension Officer Dr. A. Sharma to ${villageName} Hotspot Sector.`);
}

// ----------------------------------------------------
// PAGE 9: IPM ADVISORY
// ----------------------------------------------------
function renderIpmAdvisoryPage() {
  const adv = window.KISAN_DATA.diseases['early_blight'].ipm;
  const currLang = window.appState.language || 'hi';
  const langText = window.KISAN_DATA.multilingualAdvisories[currLang] || window.KISAN_DATA.multilingualAdvisories['en'];

  return `
    <div class="max-w-5xl mx-auto space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🌱</span> Integrated Pest Management (IPM) Advisory
          </h1>
          <p class="text-emerald-200/80 text-sm">Prioritizing biological, physical, and preventive controls over chemicals.</p>
        </div>
        
        <!-- Language Switcher in Page Header -->
        <div class="flex items-center gap-2">
          <select onchange="setLanguage(this.value)" class="bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white">
            ${window.KISAN_DATA.languages.map(l => `<option value="${l.code}" ${l.code === currLang ? 'selected' : ''}>${l.flag} ${l.name}</option>`).join('')}
          </select>
          <button onclick="speakAdvisory('${currLang}')" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-bold rounded-xl text-xs shadow flex items-center gap-1.5 transition">
            <span>🔊</span> Listen to Advisory
          </button>
        </div>
      </div>

      <!-- Multilingual Speech Advisory Box -->
      <div class="glass-card p-6 rounded-3xl border-emerald-500/50 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 space-y-3">
        <h3 class="text-lg font-bold text-white">${langText.title}</h3>
        <p class="text-sm text-emerald-100 leading-relaxed font-medium">${langText.text}</p>
      </div>

      <!-- 4-Level IPM Priority Hierarchy -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-white border-b border-emerald-500/30 pb-2">Structured IPM Priority Framework</h2>

        <div class="grid md:grid-cols-2 gap-6">
          
          <!-- 1. Prevention -->
          <div class="glass-card p-6 space-y-3 rounded-2xl border-emerald-500/40 border-l-4 border-l-emerald-400">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-emerald-900 text-emerald-300 text-xs font-extrabold uppercase">Priority 1</span>
              <h3 class="text-lg font-bold text-white">Cultural & Preventive Measures</h3>
            </div>
            <ul class="space-y-2 text-xs text-slate-200">
              ${adv.prevention.map(p => `<li class="flex items-start gap-2"><span class="text-emerald-400 font-bold">✓</span> <span>${p}</span></li>`).join('')}
            </ul>
          </div>

          <!-- 2. Monitoring -->
          <div class="glass-card p-6 space-y-3 rounded-2xl border-emerald-500/40 border-l-4 border-l-teal-400">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-teal-900 text-teal-300 text-xs font-extrabold uppercase">Priority 2</span>
              <h3 class="text-lg font-bold text-white">Scouting & Monitoring</h3>
            </div>
            <ul class="space-y-2 text-xs text-slate-200">
              ${adv.monitoring.map(m => `<li class="flex items-start gap-2"><span class="text-teal-400 font-bold">✓</span> <span>${m}</span></li>`).join('')}
            </ul>
          </div>

          <!-- 3. Biological / Physical -->
          <div class="glass-card p-6 space-y-3 rounded-2xl border-emerald-500/40 border-l-4 border-l-lime-400">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-lime-900 text-lime-300 text-xs font-extrabold uppercase">Priority 3</span>
              <h3 class="text-lg font-bold text-white">Biological & Mechanical Controls</h3>
            </div>
            <ul class="space-y-2 text-xs text-slate-200">
              ${adv.biological.map(b => `<li class="flex items-start gap-2"><span class="text-lime-400 font-bold">✓</span> <span>${b}</span></li>`).join('')}
            </ul>
          </div>

          <!-- 4. Chemical - If Necessary -->
          <div class="glass-card p-6 space-y-3 rounded-2xl border-amber-500/40 border-l-4 border-l-amber-400">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-amber-900 text-amber-300 text-xs font-extrabold uppercase">Priority 4 (If Necessary)</span>
              <h3 class="text-lg font-bold text-white">Label-Compliant Chemical Control</h3>
            </div>
            <ul class="space-y-2 text-xs text-slate-200">
              ${adv.chemical.map(c => `<li class="flex items-start gap-2"><span class="text-amber-400 font-bold">⚠</span> <span>${c}</span></li>`).join('')}
            </ul>
          </div>

        </div>

        <!-- Mandatory Safety Warning -->
        <div class="p-6 rounded-2xl bg-amber-950/80 border border-amber-500/60 text-xs text-amber-100 space-y-2">
          <div class="font-bold text-amber-300 text-sm flex items-center gap-2">
            <span>⚠️</span> MANDATORY SAFETY DIRECTION
          </div>
          <p>
            Always follow the locally approved product label directions registered under DPPQ&S / Central Insecticides Board and seek advice from authorized agricultural extension officers before chemical application. Wear full Personal Protective Equipment (PPE).
          </p>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 10: EXPERT VALIDATION WORKFLOW
// ----------------------------------------------------
function renderExpertValidationPage() {
  const cases = window.KISAN_DATA.expertCases;

  return `
    <div class="space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>👨🔬</span> Agriculture Expert Validation Portal
          </h1>
          <p class="text-emerald-200/80 text-sm">Review AI predictions, confirm diagnosis, or escalate uncertain scans to pathology labs.</p>
        </div>
        <div class="px-4 py-2 rounded-xl bg-purple-950 border border-purple-500 text-purple-200 font-bold text-xs">
          Pending Verification Cases: ${cases.length}
        </div>
      </div>

      <!-- Decision Workflow Flowchart Visual -->
      <div class="glass-card p-6 rounded-3xl border-emerald-500/40 space-y-4">
        <h3 class="text-lg font-bold text-white">Validation Decision Workflow</h3>
        <div class="flex flex-wrap items-center justify-between text-xs font-semibold gap-2 text-emerald-200">
          <span class="p-2.5 rounded bg-emerald-950 border border-emerald-500">Farmer Scan</span> ➔
          <span class="p-2.5 rounded bg-emerald-950 border border-emerald-500">AI Confidence Check</span> ➔
          <span class="p-2.5 rounded bg-amber-950 border border-amber-500 text-amber-300">LOW CONFIDENCE (&lt;85%)</span> ➔
          <span class="p-2.5 rounded bg-purple-950 border border-purple-500 text-purple-300 font-bold">Expert Panel Review</span> ➔
          <span class="p-2.5 rounded bg-emerald-800 text-white">Confirmed Advisory / Lab Dispatch</span>
        </div>
      </div>

      <!-- Expert Pending Cases Table -->
      <div class="glass-card p-6 rounded-3xl border-emerald-500/40 space-y-6">
        <h3 class="text-xl font-bold text-white">Cases Requiring Expert Action</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-200 border-collapse">
            <thead>
              <tr class="border-b border-emerald-500/30 text-emerald-300 uppercase tracking-wider font-bold">
                <th class="p-3">Case ID</th>
                <th class="p-3">Farmer & Field</th>
                <th class="p-3">Crop</th>
                <th class="p-3">AI Prediction</th>
                <th class="p-3">Confidence</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Expert Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-500/20">
              ${cases.map(c => `
                <tr class="hover:bg-emerald-950/40">
                  <td class="p-3 font-mono font-bold text-white">${c.id}</td>
                  <td class="p-3">
                    <div class="font-bold text-white">${c.farmer}</div>
                    <div class="text-[10px] text-slate-400">${c.field}</div>
                  </td>
                  <td class="p-3 font-medium">${c.crop}</td>
                  <td class="p-3 font-semibold text-amber-300">${c.aiDiagnosis}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded ${c.confidence >= 80 ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'} font-bold">
                      ${c.confidence}%
                    </span>
                  </td>
                  <td class="p-3 font-mono text-[11px] text-purple-300">${c.status}</td>
                  <td class="p-3 text-right space-x-2">
                    <button onclick="expertActionConfirm('${c.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold">Confirm</button>
                    <button onclick="expertActionLab('${c.id}')" class="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-purple-200 rounded font-bold">Refer to Lab</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function expertActionConfirm(id) {
  showToast(`✅ Diagnosis for Case ${id} validated by Agriculture Expert! Advisory dispatched to farmer.`);
}

function expertActionLab(id) {
  navigateTo('lab-referral');
  showToast(`🧪 Case ${id} referred to Pathology Diagnostic Laboratory.`);
}

// ----------------------------------------------------
// PAGE 11: LABORATORY REFERRAL
// ----------------------------------------------------
function renderLabReferralPage() {
  return `
    <div class="max-w-4xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>🧪</span> Laboratory Pathology Referral Center
        </h1>
        <p class="text-emerald-200/80 text-sm">Escalated physical leaf sample analysis, fungal culturing, and DNA sequencing.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        
        <div class="p-6 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-between">
          <div>
            <div class="text-xs font-mono text-purple-300">LAB DISPATCH TICKET #LAB-77492</div>
            <h2 class="text-2xl font-extrabold text-white">ICAR-IARI Plant Pathology Lab</h2>
            <div class="text-xs text-slate-300">Karnal Regional Diagnostic Center</div>
          </div>
          <span class="px-4 py-1.5 rounded-full bg-purple-900 text-purple-200 border border-purple-400 font-bold text-xs">
            STATUS: SAMPLE IN CULTURE TESTING
          </span>
        </div>

        <!-- Sample Workflow Progress -->
        <div class="grid grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div class="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300">
            1. Dispatch Registered ✅
          </div>
          <div class="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300">
            2. Sample Received ✅
          </div>
          <div class="p-3 rounded-xl bg-purple-950 border border-purple-500 text-purple-200 font-bold">
            3. Microscopic Assay ⏳
          </div>
          <div class="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-400">
            4. Final Lab Report
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-slate-950/70 border border-emerald-500/30 text-left space-y-3 text-xs">
          <h4 class="font-bold text-emerald-300 text-sm">Laboratory Diagnostic Log</h4>
          <div class="space-y-1 text-slate-300">
            <div>• <strong>Sample Collected From:</strong> Rajesh Kumar (Rampur Village)</div>
            <div>• <strong>Suspected Specimen:</strong> Solanum lycopersicum leaf lesion</div>
            <div>• <strong>Pathologist Assigned:</strong> Dr. V. K. Swaminathan (Sr. Mycologist)</div>
            <div>• <strong>Preliminary PCR Result:</strong> Positive for Alternaria solani spore DNA</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 12: FOLLOW-UP MONITORING
// ----------------------------------------------------
function renderFollowUpPage() {
  return `
    <div class="max-w-5xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>🔄</span> Post-Treatment Follow-up Monitoring
        </h1>
        <p class="text-emerald-200/80 text-sm">Track crop recovery over time with AI before vs after image comparison.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-8">
        
        <!-- Timeline -->
        <div class="grid grid-cols-3 gap-4 text-center text-xs font-bold">
          <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1">
            <div class="text-emerald-400">DAY 1</div>
            <div class="text-white text-sm">📷 Disease Detected</div>
            <div class="text-[10px] text-slate-400">Early Blight spotted (89/100)</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1">
            <div class="text-emerald-400">DAY 3</div>
            <div class="text-white text-sm">🌱 Bio-Action Taken</div>
            <div class="text-[10px] text-slate-400">Applied Trichoderma + Sanitation</div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 space-y-1">
            <div class="text-emerald-300">DAY 7</div>
            <div class="text-white text-sm">📷 Follow-up Rescan</div>
            <div class="text-[10px] text-emerald-300">AI Comparison Analysis</div>
          </div>
        </div>

        <!-- Before vs After Visual Comparison Container -->
        <div class="space-y-4 text-left">
          <h3 class="text-lg font-bold text-white">Visual AI Recovery Comparison</h3>

          <div class="grid md:grid-cols-2 gap-6">
            
            <div class="p-4 rounded-2xl bg-slate-950 border border-red-500/40 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-red-400">
                <span>BEFORE (Day 1 Scan)</span>
                <span>Risk: 89/100</span>
              </div>
              <div class="h-48 rounded-xl bg-slate-900 flex items-center justify-center border border-red-500/30">
                <svg class="w-full h-full p-4" viewBox="0 0 200 120">
                  <path d="M100 110 Q50 90 40 40 Q100 10 100 10 Q100 10 160 10 Q150 90 100 110Z" fill="#15803D"/>
                  <circle cx="80" cy="50" r="14" fill="#B45309" stroke="#FEF08A" stroke-width="2"/>
                  <circle cx="120" cy="70" r="18" fill="#B45309" stroke="#FEF08A" stroke-width="2"/>
                </svg>
              </div>
              <div class="text-[11px] text-slate-300">Spreading brown concentric lesions</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>AFTER (Day 7 Rescan)</span>
                <span>Risk: 24/100</span>
              </div>
              <div class="h-48 rounded-xl bg-slate-900 flex items-center justify-center border border-emerald-500/30">
                <svg class="w-full h-full p-4" viewBox="0 0 200 120">
                  <path d="M100 110 Q50 90 40 40 Q100 10 100 10 Q100 10 160 10 Q150 90 100 110Z" fill="#166534"/>
                  <circle cx="80" cy="50" r="5" fill="#451A03" opacity="0.4"/>
                </svg>
              </div>
              <div class="text-[11px] text-emerald-300">Lesions arrested; new green leaf tissue emerging</div>
            </div>

          </div>
        </div>

        <!-- Outcome Result Badge -->
        <div class="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-between">
          <div>
            <div class="text-xs font-bold text-emerald-300 uppercase">AI Follow-up Assessment</div>
            <div class="text-2xl font-black text-white">🟢 STATUS: SIGNIFICANTLY IMPROVING</div>
            <div class="text-xs text-slate-300">Lesion growth halted. Continue IPM monitoring schedule.</div>
          </div>
          <button onclick="showToast('Follow-up record saved to field history')" class="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow">
            Save Follow-up Report
          </button>
        </div>

      </div>
    </div>
  `;
}

function initComparisonSlider() {}

// ----------------------------------------------------
// PAGE 13: EXTENSION WORKER DASHBOARD
// ----------------------------------------------------
function renderExtensionDashboard() {
  const cases = window.KISAN_DATA.extensionPriorityCases;

  return `
    <div class="space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>👨🌾</span> Extension Worker Field Hub
          </h1>
          <p class="text-emerald-200/80 text-sm">Assigned village reports, field visit prioritization, and diagnostic submissions.</p>
        </div>
        <div class="px-4 py-2 rounded-xl bg-amber-950 border border-amber-500 text-amber-200 font-bold text-xs">
          High Priority Visits Pending: 2
        </div>
      </div>

      <!-- Priority Farm Visits Table -->
      <div class="glass-card p-6 rounded-3xl border-emerald-500/40 space-y-4">
        <h3 class="text-xl font-bold text-white">Priority Farm Visits & Validation Queue</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-200 border-collapse">
            <thead>
              <tr class="border-b border-emerald-500/30 text-emerald-300 uppercase font-bold">
                <th class="p-3">Farm & Owner</th>
                <th class="p-3">Crop</th>
                <th class="p-3">Risk Index</th>
                <th class="p-3">Location</th>
                <th class="p-3">Recommended Action</th>
                <th class="p-3 text-right">Dispatch</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-500/20">
              ${cases.map(c => `
                <tr class="hover:bg-emerald-950/40">
                  <td class="p-3 font-bold text-white">${c.farm}</td>
                  <td class="p-3 font-medium">${c.crop}</td>
                  <td class="p-3">
                    <span class="px-3 py-1 rounded-full text-xs font-bold border ${c.riskClass}">
                      ${c.risk}/100
                    </span>
                  </td>
                  <td class="p-3">${c.location}</td>
                  <td class="p-3 font-bold text-amber-300">${c.action}</td>
                  <td class="p-3 text-right space-x-2">
                    <button onclick="showToast('Scheduled Field Visit for ${c.farm}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold">Schedule Visit</button>
                    <a href="tel:${c.phone}" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded font-bold">Call Farmer</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 14: AGRICULTURE OFFICIAL DASHBOARD
// ----------------------------------------------------
function renderOfficialDashboard() {
  return `
    <div class="space-y-8 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🏛</span> Agriculture Official Executive Dashboard
          </h1>
          <p class="text-emerald-200/80 text-sm">District and block-level disease monitoring, surveillance analytics, and response metrics.</p>
        </div>
        <button onclick="navigateTo('reports')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow">
          📈 Export Official Reports
        </button>
      </div>

      <!-- Top Executive Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">Total Reports Logged</div>
          <div class="text-3xl font-black text-white">12,450</div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-red-500/30 space-y-1 bg-red-950/20">
          <div class="text-xs font-semibold text-red-300">High Risk Fields</div>
          <div class="text-3xl font-black text-red-400">1,240</div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-amber-500/30 space-y-1">
          <div class="text-xs font-semibold text-amber-300">Active Hotspots</div>
          <div class="text-3xl font-black text-amber-400">86</div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-1">
          <div class="text-xs font-semibold text-emerald-300">Expert Validated</div>
          <div class="text-3xl font-black text-emerald-400">74%</div>
        </div>

        <div class="glass-card p-5 rounded-2xl border-purple-500/30 space-y-1">
          <div class="text-xs font-semibold text-purple-300">Active Lab Cases</div>
          <div class="text-3xl font-black text-purple-400">31</div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-3xl border-emerald-500/40 space-y-4">
          <h3 class="text-lg font-bold text-white">Crop-wise Disease Distribution</h3>
          <div class="h-56 relative">
            <canvas id="officialCropChart"></canvas>
          </div>
        </div>

        <div class="glass-card p-6 rounded-3xl border-emerald-500/40 space-y-4">
          <h3 class="text-lg font-bold text-white">District Extension Response Time (Hours)</h3>
          <div class="h-56 relative">
            <canvas id="officialResponseChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initOfficialCharts() {
  const c1 = document.getElementById('officialCropChart');
  const c2 = document.getElementById('officialResponseChart');

  if (c1 && window.Chart) {
    new window.Chart(c1.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Rice (Brown Spot)', 'Tomato (Early Blight)', 'Wheat (Rust)', 'Cotton (Aphids)'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#06b6d4']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (c2 && window.Chart) {
    new window.Chart(c2.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Karnal Block', 'Ambala Block', 'Panipat Block', 'Kurukshetra Block'],
        datasets: [{
          label: 'Avg Response Time (Hrs)',
          data: [1.8, 2.4, 3.1, 1.2],
          backgroundColor: '#10b981'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

// ----------------------------------------------------
// PAGE 15: ALERTS & NOTIFICATIONS
// ----------------------------------------------------
function renderAlertsPage() {
  return `
    <div class="max-w-4xl mx-auto space-y-8 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🔔</span> Early Warning Alert Center
          </h1>
          <p class="text-emerald-200/80 text-sm">Real-time localized pest and disease emergency broadcast notifications.</p>
        </div>
        <button onclick="showToast('🔔 Test Audio Broadcast Triggered')" class="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 rounded-xl text-xs font-bold transition flex items-center gap-2">
          🔊 Test Alarm Audio
        </button>
      </div>

      <div class="space-y-4">
        
        <div class="glass-card p-6 rounded-2xl border-red-500/60 bg-red-950/30 space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-red-900 text-red-200 border border-red-500 text-xs font-extrabold">
                🔴 HIGH-RISK ALERT
              </span>
              <h3 class="text-lg font-bold text-white">Rice Brown Spot & Pest Activity Surging</h3>
            </div>
            <span class="text-xs text-slate-400">10 mins ago</span>
          </div>

          <p class="text-xs text-slate-200 leading-relaxed">
            Rice pest trap counters in Rampur Village sector exceeded Economic Threshold Levels (ETL) by 350%. High humidity (84%) creates extreme vulnerability for brown spot expansion.
          </p>

          <div class="flex items-center justify-between text-xs pt-2">
            <span class="text-red-300 font-bold">Action Required: Inspect field canopy within 24-48 hours.</span>
            <button onclick="navigateTo('ipm-advisory')" class="px-4 py-1.5 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg">View Advisory</button>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl border-amber-500/40 bg-amber-950/20 space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-amber-900 text-amber-200 border border-amber-500 text-xs font-extrabold">
                🟠 MODERATE WEATHER ALERT
              </span>
              <h3 class="text-lg font-bold text-white">Incoming Heavy Downpour Forecast</h3>
            </div>
            <span class="text-xs text-slate-400">2 hours ago</span>
          </div>

          <p class="text-xs text-slate-200 leading-relaxed">
            Agro-meteorology unit predicts 25mm rain on Thursday. Ensure field drainage channels are cleared to prevent root rot.
          </p>
        </div>

      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 16: REPORTS & ANALYTICS
// ----------------------------------------------------
function renderReportsPage() {
  return `
    <div class="max-w-5xl mx-auto space-y-8 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>📈</span> Crop Health Analytics & Reporting
          </h1>
          <p class="text-emerald-200/80 text-sm">Generate and export institutional surveillance reports in PDF, CSV, and Excel.</p>
        </div>
        
        <div class="flex items-center gap-2">
          <button onclick="exportFile('CSV')" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">Export CSV</button>
          <button onclick="exportFile('PDF')" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold">Export PDF Report</button>
        </div>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        <h3 class="text-xl font-bold text-white">Surveillance Report Summary Table</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-200 border-collapse">
            <thead>
              <tr class="border-b border-emerald-500/30 text-emerald-300 font-bold">
                <th class="p-3">District / Block</th>
                <th class="p-3">Primary Crop</th>
                <th class="p-3">Top Disease Issue</th>
                <th class="p-3">Total Scans</th>
                <th class="p-3">Avg Risk Score</th>
                <th class="p-3">Treatment Efficacy</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-500/20">
              <tr class="hover:bg-emerald-950/40">
                <td class="p-3 font-bold text-white">Karnal (Rampur)</td>
                <td class="p-3">Rice & Tomato</td>
                <td class="p-3 text-amber-300">Early Blight</td>
                <td class="p-3 font-mono">1,420</td>
                <td class="p-3 font-bold text-red-400">86 / 100</td>
                <td class="p-3 font-bold text-emerald-400">92%</td>
              </tr>
              <tr class="hover:bg-emerald-950/40">
                <td class="p-3 font-bold text-white">Shivpur Block</td>
                <td class="p-3">Tomato</td>
                <td class="p-3 text-amber-300">Late Blight</td>
                <td class="p-3 font-mono">890</td>
                <td class="p-3 font-bold text-amber-400">72 / 100</td>
                <td class="p-3 font-bold text-emerald-400">88%</td>
              </tr>
              <tr class="hover:bg-emerald-950/40">
                <td class="p-3 font-bold text-white">Lakshmi Nagar</td>
                <td class="p-3">Wheat</td>
                <td class="p-3 text-emerald-300">Powdery Mildew</td>
                <td class="p-3 font-mono">510</td>
                <td class="p-3 font-bold text-yellow-400">51 / 100</td>
                <td class="p-3 font-bold text-emerald-400">95%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function exportFile(format) {
  showToast(`📥 Generated & Downloaded KISANSETU_Crop_Health_Report.${format.toLowerCase()}`);
}

// ----------------------------------------------------
// PAGE 17: PROFILE & SETTINGS
// ----------------------------------------------------
function renderSettingsPage() {
  return `
    <div class="max-w-4xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>⚙️</span> Settings & Role Switcher
        </h1>
        <p class="text-emerald-200/80 text-sm">Switch role modes for demonstration, language preferences, and offline settings.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        
        <!-- Role Switcher -->
        <div class="space-y-3 text-left">
          <label class="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Demonstration User Role Switcher:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onclick="setRole('farmer')" class="p-4 rounded-2xl border ${window.appState.userRole === 'farmer' ? 'border-emerald-400 bg-emerald-900/60' : 'border-emerald-500/30 bg-slate-950'} text-left hover:border-emerald-400 transition">
              <div class="text-2xl">👨🌾</div>
              <div class="font-bold text-white text-sm">Farmer</div>
              <div class="text-[10px] text-emerald-300">Field health & scans</div>
            </button>

            <button onclick="setRole('extension')" class="p-4 rounded-2xl border ${window.appState.userRole === 'extension' ? 'border-emerald-400 bg-emerald-900/60' : 'border-emerald-500/30 bg-slate-950'} text-left hover:border-emerald-400 transition">
              <div class="text-2xl">👨🌾</div>
              <div class="font-bold text-white text-sm">Extension Officer</div>
              <div class="text-[10px] text-emerald-300">Field visit priority</div>
            </button>

            <button onclick="setRole('expert')" class="p-4 rounded-2xl border ${window.appState.userRole === 'expert' ? 'border-emerald-400 bg-emerald-900/60' : 'border-emerald-500/30 bg-slate-950'} text-left hover:border-emerald-400 transition">
              <div class="text-2xl">👨🔬</div>
              <div class="font-bold text-white text-sm">Agri Expert</div>
              <div class="text-[10px] text-emerald-300">Diagnosis validation</div>
            </button>

            <button onclick="setRole('official')" class="p-4 rounded-2xl border ${window.appState.userRole === 'official' ? 'border-emerald-400 bg-emerald-900/60' : 'border-emerald-500/30 bg-slate-950'} text-left hover:border-emerald-400 transition">
              <div class="text-2xl">🏛</div>
              <div class="font-bold text-white text-sm">Agri Official</div>
              <div class="text-[10px] text-emerald-300">District analytics</div>
            </button>
          </div>
        </div>

        <!-- Offline Mode Simulator Button -->
        <div class="p-6 rounded-2xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between text-left">
          <div>
            <h4 class="font-bold text-white text-base">Offline-First Engine Simulator (Item 29)</h4>
            <p class="text-xs text-slate-300">Simulate field connectivity loss. Scans will queue locally and auto-sync when online.</p>
          </div>
          <button onclick="toggleOfflineMode()" class="px-5 py-2.5 rounded-xl ${window.appState.isOffline ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'} font-bold text-xs shadow transition">
            ${window.appState.isOffline ? '📴 Disable Offline Mode' : '📴 Enable Offline Mode'}
          </button>
        </div>

      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE 18: TECHNICAL ARCHITECTURE & DB SCHEMA
// ----------------------------------------------------
function renderAdminArchPage() {
  const schema = window.KISAN_DATA.dbSchema;

  return `
    <div class="max-w-5xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>💻</span> System Architecture & ML Feedback Loop
        </h1>
        <p class="text-emerald-200/80 text-sm">PostgreSQL/PostGIS relational data models, computer vision architecture, and model retraining feedback loop.</p>
      </div>

      <!-- Technical Architecture Diagram -->
      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6">
        <h3 class="text-xl font-bold text-white text-center">System Architecture Layers</h3>

        <div class="space-y-3 text-xs text-left">
          <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
            <span class="font-bold text-emerald-400 w-32">FIELD LAYER:</span>
            <span class="text-slate-200">Mobile App + Camera + ESP32 IoT Sensors + Light Traps + GPS Telemetry</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
            <span class="font-bold text-emerald-400 w-32">DATA LAYER:</span>
            <span class="text-slate-200">PostgreSQL + PostGIS Spatial Engine + Weather API + Historical Surveillance Store</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
            <span class="font-bold text-emerald-400 w-32">AI / ANALYTICS:</span>
            <span class="text-slate-200">Vision Transformer (ViT) / CNN Computer Vision + Agro-Weather Risk Engine</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
            <span class="font-bold text-emerald-400 w-32">DECISION LAYER:</span>
            <span class="text-slate-200">Expert Panel Review Portal + GIS Hotspot Engine + IPM Rule Engine + Broadcast Alerts</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
            <span class="font-bold text-emerald-400 w-32">USER LAYER:</span>
            <span class="text-slate-200">Farmer Mobile App + Extension Field Portal + Agriculture Official Executive Hub</span>
          </div>
        </div>
      </div>

      <!-- ML Feedback Loop Visual (Item 22) -->
      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-4">
        <h3 class="text-xl font-bold text-white text-center">Machine Learning Feedback Loop</h3>
        <p class="text-xs text-emerald-200/80 text-center">"The System Learns From Field Confirmations"</p>

        <div class="flex flex-wrap items-center justify-between text-xs font-semibold gap-2 text-emerald-200 pt-2">
          <span class="p-2.5 rounded bg-emerald-950 border border-emerald-500">Farmer Data</span> ➔
          <span class="p-2.5 rounded bg-emerald-950 border border-emerald-500">AI Prediction</span> ➔
          <span class="p-2.5 rounded bg-purple-950 border border-purple-500 text-purple-300">Expert Confirmation</span> ➔
          <span class="p-2.5 rounded bg-purple-950 border border-purple-500 text-purple-300">Lab Result</span> ➔
          <span class="p-2.5 rounded bg-emerald-800 text-white font-bold">Labeled Dataset Retraining</span>
        </div>
      </div>

      <!-- PostgreSQL Database Schema Tables (Item 25) -->
      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-6 text-left">
        <h3 class="text-xl font-bold text-white">Relational PostgreSQL / PostGIS Data Models</h3>

        <div class="grid md:grid-cols-2 gap-4">
          ${schema.tables.map(t => `
            <div class="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div class="font-mono font-bold text-emerald-300 text-sm flex items-center gap-2">
                <span>🗄</span> ${t.name} Table
              </div>
              <ul class="space-y-1 font-mono text-[11px] text-slate-300">
                ${t.fields.map(f => `<li class="flex items-center gap-2"><span class="text-emerald-500">•</span> ${f}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PAGE: PLANT SPECIES RECOGNITION (DEMO)
// ----------------------------------------------------
function renderPlantRecognitionPage() {
  const plants = window.KISAN_DATA.plantRecognition || [];
  const selected = window.selectedPlantRec || plants[0];

  return `
    <div class="max-w-5xl mx-auto space-y-8 py-4">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
          <span>🌿</span> AI Plant & Weed Species Recognition
        </h1>
        <p class="text-emerald-200/80 text-sm">Instant botanical classification, crop vs weed identification, and agronomic utility analysis.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl border-emerald-500/40 space-y-8">
        
        <!-- Preset Species Selector -->
        <div class="space-y-3 text-left">
          <label class="block text-xs font-bold text-emerald-300 uppercase tracking-wide">Select Demo Plant Specimen to Identify:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${plants.map(p => `
              <button onclick="selectPlantRecSample('${p.id}')" id="plant-btn-${p.id}" 
                class="plant-rec-btn p-4 rounded-2xl border ${selected.id === p.id ? 'border-emerald-400 bg-emerald-950/80' : 'border-emerald-500/20 bg-slate-950'} text-left hover:border-emerald-400 transition space-y-1">
                <div class="text-xs font-extrabold text-white">${p.commonName}</div>
                <div class="text-[10px] italic text-emerald-300 font-serif">${p.botanicalName}</div>
                <div class="pt-1">
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold ${p.badgeClass}">${p.status}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Scanning Engine Display -->
        <div class="grid md:grid-cols-2 gap-8 items-center text-left">
          
          <div class="glass-card p-6 rounded-2xl border-emerald-500/30 space-y-4">
            <div class="relative rounded-xl overflow-hidden h-56 bg-slate-950 flex items-center justify-center border border-emerald-500/30 scanner-overlay">
              <div id="plant-svg-display" class="w-full h-full flex items-center justify-center">
                ${getSampleLeafSvg(selected.svgKey || 'tomato')}
              </div>
              <div class="scanner-beam"></div>
              <div class="absolute bottom-3 left-3 bg-slate-900/90 border border-emerald-500/50 rounded-lg px-3 py-1 text-xs text-emerald-300 font-mono">
                🔍 LEAF VENATION MATCH: ${selected.confidence}%
              </div>
            </div>

            <!-- Animated Progress Bar -->
            <div id="plant-scan-progress" class="hidden space-y-2 p-3 bg-emerald-950/90 rounded-xl border border-emerald-500/40">
              <div class="flex justify-between text-xs font-bold text-emerald-300">
                <span id="plant-scan-step">Scanning leaf morphology & floral traits...</span>
                <span id="plant-scan-pct">33%</span>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div id="plant-progress-bar" class="bg-gradient-to-r from-emerald-500 to-lime-400 h-full w-1/3 transition-all duration-500"></div>
              </div>
            </div>

            <button onclick="startPlantRecScanAnimation()" id="run-plant-scan-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow transition">
              🌿 RE-SCAN BOTANICAL SPECIES
            </button>
          </div>

          <!-- Recognition Result Card -->
          <div id="plant-rec-result-card" class="glass-card p-6 rounded-2xl border-emerald-500/40 space-y-4">
            <div class="flex items-start justify-between border-b border-emerald-500/30 pb-3">
              <div>
                <span class="px-3 py-1 rounded-full text-xs font-bold border ${selected.badgeClass}">${selected.status}</span>
                <h2 class="text-2xl font-black text-white mt-2">${selected.commonName}</h2>
                <div class="text-sm italic font-serif text-emerald-300">${selected.botanicalName}</div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-black text-emerald-400">${selected.confidence}%</div>
                <div class="text-[10px] text-slate-400 font-mono">MATCH CONFIDENCE</div>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div><strong class="text-emerald-300">Taxonomic Family:</strong> <span class="text-slate-200">${selected.family}</span></div>
              <div><strong class="text-emerald-300">Agronomic Class:</strong> <span class="text-slate-200">${selected.type}</span></div>
              <div><strong class="text-emerald-300">Optimal Temperature:</strong> <span class="text-slate-200">${selected.optimalTemp}</span></div>
              <div><strong class="text-emerald-300">Ideal Soil Parameters:</strong> <span class="text-slate-200">${selected.idealSoil}</span></div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 text-xs space-y-1">
              <strong class="text-emerald-300 block">Key Diagnostic Features:</strong>
              <ul class="space-y-1 text-slate-200">
                ${selected.characteristics.map(c => `<li>• ${c}</li>`).join('')}
              </ul>
            </div>

            <div class="p-3.5 rounded-xl ${selected.status.includes('WEED') ? 'bg-red-950/80 border border-red-500/50 text-red-200' : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-100'} text-xs">
              <strong>Agricultural Impact:</strong> ${selected.economicImportance}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

function initPlantRecListeners() {}

function selectPlantRecSample(id) {
  const plants = window.KISAN_DATA.plantRecognition || [];
  window.selectedPlantRec = plants.find(p => p.id === id) || plants[0];
  renderCurrentView();
}

function startPlantRecScanAnimation() {
  const progressBox = document.getElementById('plant-scan-progress');
  const btn = document.getElementById('run-plant-scan-btn');
  const stepText = document.getElementById('plant-scan-step');
  const pctText = document.getElementById('plant-scan-pct');
  const bar = document.getElementById('plant-progress-bar');

  if (!progressBox || !btn) return;

  progressBox.classList.remove('hidden');
  btn.disabled = true;

  const steps = [
    { text: "Scanning leaf morphology & floral traits...", pct: 35 },
    { text: "Extracting leaf venation & trichome structures...", pct: 70 },
    { text: "Matching botanical taxonomy database...", pct: 100 }
  ];

  let idx = 0;
  const interval = setInterval(() => {
    if (idx < steps.length) {
      stepText.textContent = steps[idx].text;
      pctText.textContent = `${steps[idx].pct}%`;
      bar.style.width = `${steps[idx].pct}%`;
      idx++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        progressBox.classList.add('hidden');
        btn.disabled = false;
        showToast(`🌿 Plant Recognized: ${window.selectedPlantRec ? window.selectedPlantRec.commonName : 'Botanical Match'}`);
      }, 400);
    }
  }, 500);
}

