// src/shared/gameData.ts
var controlCards = [
  { title: "Employee Training", category: "Identify", cost: 35e3, desc: "Educates staff on social engineering, suspicious behavior, and physical security awareness." },
  { title: "Emergency Procedures", category: "Identify", cost: 3e4, desc: "Defines escalation, reporting, and verification procedures for suspicious requests and major incidents." },
  { title: "Asset Inventory", category: "Identify", cost: 25e3, desc: "Maintains a current inventory of systems, devices, owners, and critical data." },
  { title: "Risk Assessment", category: "Identify", cost: 4e4, desc: "Prioritizes cyber risk, outside testing, and acceptable-risk planning across the organization." },
  { title: "Phishing Campaigns", category: "Identify", cost: 25e3, desc: "Runs simulations to improve staff readiness against phishing and business email compromise." },
  { title: "Firewall", category: "Protect", cost: 75e3, desc: "Filters traffic between internal and external networks and segments sensitive environments." },
  { title: "Antivirus", category: "Protect", cost: 5e4, desc: "Detects and blocks known malware and suspicious execution on endpoints." },
  { title: "Multi-factor Auth", category: "Protect", cost: 9e4, desc: "Adds a second factor to authentication so stolen passwords are less useful." },
  { title: "Encryption", category: "Protect", cost: 85e3, desc: "Protects sensitive data at rest and in transit, including backups and portable devices." },
  { title: "Patch Management", category: "Protect", cost: 6e4, desc: "Applies security updates quickly to reduce exposure to known vulnerabilities." },
  { title: "SIEM Monitoring", category: "Detect", cost: 1e5, desc: "Centralizes logging and alerting to help teams spot suspicious activity faster." },
  { title: "User Activity Logs", category: "Detect", cost: 3e4, desc: "Tracks unusual logins, behavior changes, and risky account usage." },
  { title: "IDS", category: "Detect", cost: 8e4, desc: "Detects network intrusion attempts and suspicious east-west movement." },
  { title: "Endpoint Detection", category: "Detect", cost: 6e4, desc: "Provides deeper endpoint visibility into malware, scripts, and persistence behavior." },
  { title: "Threat Intelligence", category: "Detect", cost: 4e4, desc: "Uses external threat data to identify likely indicators and active attacker behavior." },
  { title: "Incident Response Team", category: "Respond", cost: 1e5, desc: "Ensures trained responders or contracted specialists can coordinate during a serious event." },
  { title: "Backup & Restore", category: "Respond", cost: 6e4, desc: "Provides tested data recovery and restoration capability after outages, corruption, or ransomware." },
  { title: "Disaster Recovery Plan", category: "Respond", cost: 8e4, desc: "Documents how to restore operations after major incidents or facility-level disruption." },
  { title: "Communications Plan", category: "Respond", cost: 4e4, desc: "Defines who communicates to staff, public, leadership, and media during an outage." },
  { title: "Legal & Compliance", category: "Respond", cost: 5e4, desc: "Covers notification rules, privacy obligations, and legal decision points after a breach." }
];
var injectCardDrafts = [
  {
    event: "Living-off-the-Land (LotL) PowerShell Attack",
    description: "An attacker uses legitimate Windows tools (PowerShell and WMI) to move laterally through your network.",
    impacts: [
      { text: "Lateral movement across network \xE2\u20AC\u201C $75,000", mitigatedBy: "IDS" },
      { text: "Malware-less persistence established \xE2\u20AC\u201C $45,000", mitigatedBy: "Endpoint Detection" }
    ],
    stats: "60% of modern attacks now use 'LotL' techniques, where no actual malware files are ever saved to the disk.",
    remediation: "Enforce PowerShell Constrained Language Mode and use Endpoint Detection (EDR) to monitor for suspicious process parenting."
  },
  {
    event: "Phishing Whaling Attack",
    description: "An email from a bad actor impersonating a high ranking administrator is received. Requesting an urgent payroll transfer due to a recent bank account change. Payroll processes this change.",
    impacts: [
      { text: "Payroll funds misdirected \xE2\u20AC\u201C $35,000", mitigatedBy: "Employee Training" },
      { text: "No verification of transfer \xE2\u20AC\u201C $30,000", mitigatedBy: "Phishing Campaigns" }
    ],
    stats: "Phishing attacks cost US businesses $17B annually. Approximately 30% of employees click phishing links without training.",
    remediation: "Conduct employee phishing simulations and implement strict verification for anything relating to password changes, MFA Resets, Change in bank information, Paying Invoices and Wire transfers. Do you require these types of changes to be in person?"
  },
  {
    event: "Internet Service Outage",
    description: "A neighboring business has a sprinkler line put in and accidently cuts your connection to your ISP, taking your internet down for 3 days.",
    impacts: [
      { text: "Business operations disrupted \xE2\u20AC\u201C $50,000", mitigatedBy: "Disaster Recovery Plan" },
      { text: "Unable to communicate to all parties \xE2\u20AC\u201C $30,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "Accidental outages are extremely common, and are something a good business continitunity plan would help protect against.",
    remediation: "Outages come in all shapes and sizes, and not just ransomware events. Would your environment survive this?"
  },
  {
    event: "Ransomware \xE2\u20AC\u201C Double Extortion",
    description: "Your Critical Authentication servers have been encrypted. Sensitive data is exfiltrated and a heafty ransom is demanded.",
    impacts: [
      { text: "Malware executed \xE2\u20AC\u201C $80,000", mitigatedBy: "Antivirus" },
      { text: "Unable to restore systems quickly \xE2\u20AC\u201C $120,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Average ransomware recovery costs now exceed $5.08 Million! Aside from the 1,000's of man hours and months it can take to recover.",
    remediation: "Use layered defenses, maintain onsite and offsite backups, and test incident response plans regularly. Are you prepared to pay? Not to pay? What if its medical data involving patient images? There are many things to consider here."
  },
  {
    event: "Insider Threat \xE2\u20AC\u201C Data Exfiltration",
    description: "An Employee downloads confidential data and uploads it to their personal cloud storage because they said it was easier to use. Internal documents have been leaked to the news.",
    impacts: [
      { text: "Intellectual property loss \xE2\u20AC\u201C $70,000", mitigatedBy: "User Activity Logs" },
      { text: "Business strategy exposure \xE2\u20AC\u201C $35,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "Insider threats cause over $8.76M in losses per year.",
    remediation: "Monitor user behavior and enforce least privilege. Google and Microsoft both have tools to monitor both intentional and unintentional possible data exfil."
  },
  {
    event: "Malware via USB Drop",
    description: "An infected USB drive is placed in the parking lot of your organization. A staff member is curious and plugs it into their workstation. Malware quickly spreads through your network.",
    impacts: [
      { text: "Malware infection \xE2\u20AC\u201C $25,000", mitigatedBy: "Antivirus" },
      { text: "Lateral movement risk \xE2\u20AC\u201C $20,000", mitigatedBy: "Patch Management" }
    ],
    stats: "With new techniques being implemented all the time, USB-based malware still remains a common infection vector. Many attackers will spend over a year trying to get into a target company. Its much easier to drop a flash drive or send a phishing email to get the Information they need to attack than it is to attack externally",
    remediation: "Educate staff and use endpoint protection."
  },
  {
    event: "Web Application Exploit",
    description: "Your Employee web portal was not updated to the lastet security standards. An attacker used SQL injection to gain access to your employee information database and customer portal.",
    impacts: [
      { text: "Customer data exfiltrated \xE2\u20AC\u201C $55,000", mitigatedBy: "Patch Management" },
      { text: "Loss of trust \xE2\u20AC\u201C $20,000", mitigatedBy: "Encryption" }
    ],
    stats: "Web application attacks are the top method for data breaches. It can take teams of people years to fully secure a site with new Vulnerabilities coming out every day.",
    remediation: "Patch systems and conduct penetration testing. OWASP Juice Shop has some good tutorials on Injection attacks."
  },
  {
    event: "MFA Fatigue / Push Bombing",
    description: "During a major update, An attacker with a stolen password sends hundreds of MFA push notifications to a sysadmin. Thinking it was part of the update process, the admin clicks 'Approve'.",
    impacts: [
      { text: "Administrative account compromise \xE2\u20AC\u201C $100,000", mitigatedBy: "Employee Training" },
      { text: "Infrastructure access \xE2\u20AC\u201C $50,000", mitigatedBy: "Incident Response Team" }
    ],
    stats: "Push bombing was the primary vector in the high-profile Uber and Cisco breaches in 2022.",
    remediation: "Switch from simple 'Approve/Deny' push notifications to 'MFA Number Matching', or passkeys to ensure the user is physically present at the login screen."
  },
  {
    event: "Ransomware via 'PrintNightmare' Exploit",
    description: "Attackers exploit a critical vulnerability in the Windows Print Spooler service to gain SYSTEM-level privileges and deploy ransomware network-wide.",
    impacts: [
      { text: "Privilege escalation \xE2\u20AC\u201C $80,000", mitigatedBy: "Patch Management" },
      { text: "Widespread file encryption \xE2\u20AC\u201C $120,000", mitigatedBy: "Antivirus" }
    ],
    stats: "Critical vulnerabilities like PrintNightmare allow low-level users to become domain admins in seconds.",
    remediation: "Disable the Print Spooler service on domain controllers and ensure critical security patches are applied within a resonable time period after release."
  },
  {
    event: "Supply Chain Attack: Malicious Library (Log4j Anyone?)",
    description: "An internal application relies on an Open Source library that has been hijacked by a foreign threat actor. The library contains a back-door.",
    impacts: [
      { text: "Application back-door \xE2\u20AC\u201C $65,000", mitigatedBy: "Threat Intelligence" },
      { text: "Data exfiltration via API \xE2\u20AC\u201C $45,000", mitigatedBy: "IDS" }
    ],
    stats: "Supply chain attacks (like the SolarWinds breach) are devastating because the software comes from a 'trusted' vendor.",
    remediation: "Maintain a Software Bill of Materials (SBOM) and use network segmentation to prevent apps from communicating with unknown external IPs."
  },
  {
    event: "Shadow AI / Prompt Injection",
    description: "A staff member uses an unauthorized third-party AI tool to 'summarize' confidential information. The AI tool's database is used to train a public model, exposing your confidential data.",
    impacts: [
      { text: "Intellectual property leak \xE2\u20AC\u201C $75,000", mitigatedBy: "Risk Assessment" },
      { text: "Compliance violation (Data Privacy) \xE2\u20AC\u201C $45,000", mitigatedBy: "Legal & Compliance" }
    ],
    stats: "Shadow AI (using AI without IT approval) has overtaken other types of accidental corporate data leakage Worldwide.",
    remediation: "Establish an 'Acceptable Use Policy' for Generative AI and implement CASB (Cloud Access Security Broker) tools to block unauthorized AI domains."
  },
  {
    event: "Physical Social Engineering: 'Tailgating'",
    description: "A person dressed as a delivery driver, carrying a large box, waits by the Main entrance. A staff member holds the door open for them. The intruder places a 'Dropbox' device (a small pirate computer) behind a printer, granting them remote access to your internal network.",
    impacts: [
      { text: "Physical perimeter breach \xE2\u20AC\u201C $40,000", mitigatedBy: "Employee Training" },
      { text: "Internal network backdoor \xE2\u20AC\u201C $70,000", mitigatedBy: "IDS" }
    ],
    stats: "Physical security is the first line of defense; a $100 device hidden inside a building can bypass a $100,000 external firewall.",
    remediation: "Conduct 'Badge-In' training and ensure that all network jacks in public-facing areas (lobbies, conference rooms) are disabled or restricted by MAC-filtering."
  },
  {
    event: "How was your Hawaii trip?",
    description: "A staff member unknowingly brings a family of hissing cockroaches back from vacation in their backpack. These pests have now infested the server room, and they are causing electrical arcing and shorting out of equipment.",
    impacts: [
      { text: "Hardware failure and short circuits \xE2\u20AC\u201C $85,000", mitigatedBy: "Risk Assessment" },
      { text: "Network downtime and data loss \xE2\u20AC\u201C $45,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Environmental threats aren't just weather-related; bio-infestations can cause permanent 'carbon tracking' on circuit boards, leading to cascading hardware failures that are often not covered by standard e-waste warranties.",
    remediation: "Immediately power down affected racks to prevent fire, engage professional pest control for deep-clean fumigation, and utilize off-site Disaster Recovery (DR) sites to maintain business continuity while hardware is replaced."
  },
  {
    event: "DDoS Attack",
    description: "Bad Actors flood your external facing IP's with traffic, causing your network equipment to have a memory dump error and crash. You are currently down.",
    impacts: [
      { text: "Service downtime \xE2\u20AC\u201C $35,000", mitigatedBy: "Firewall" },
      { text: "Lost revenue \xE2\u20AC\u201C $25,000", mitigatedBy: "Incident Response Team" }
    ],
    stats: "Average DDoS attack costs $20,000\xE2\u20AC\u201C$40,000 per hour of downtime.",
    remediation: "Deploy traffic filtering and response procedures. Remember that having your device ignore traffic still has a CPU cost. Do you have DDos prevention?"
  },
  {
    event: "Spear Phishing \xE2\u20AC\u201C HR Compromise",
    description: "An email was sent to HR asking them to Verify Their Email or it will be shut off. The Staff members put in their username and password allowing their Credentials to be sent to a bad actor. This resulted in stolen data, exposing employee PII, and an impending ransomware attack.",
    impacts: [
      { text: "Employee PII leaked \xE2\u20AC\u201C $40,000", mitigatedBy: "Employee Training" },
      { text: "Reputation damage \xE2\u20AC\u201C $15,000", mitigatedBy: "Multi-factor Auth" }
    ],
    stats: "Social engineering caused 36% of reported breaches in 2023.",
    remediation: "Train staff on IT procedures and enforce MFA on all accounts. This is an extremely common attack vector and millions of these types of emails are sent daily."
  },
  {
    event: "Communications outage",
    description: "AWS North american servers are down. Your VOIP, and Email providers are expierencing an outage as a result.",
    impacts: [
      { text: "Servers are Down \xE2\u20AC\u201C $60,000", mitigatedBy: "Emergency Procedures" },
      { text: "Unable to contact staff/Members \xE2\u20AC\u201C $20,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "3rd party outages cost companies Billions in losses globally.",
    remediation: "Cyber resilance plans are important for all scenarios. Make good generalized Disaster recovery plans. Do you have a way to communicate if phones and email are down?"
  },
  {
    event: "Door Access Control Outage",
    description: "Targeting IOT devices, A bad actor tries to access your Facilites door access server. The bad actor did not gain access, but the Database that holds all of your door access key card data is now corrupted.",
    impacts: [
      { text: "Access control restricted \xE2\u20AC\u201C $60,000", mitigatedBy: "SIEM Monitoring" },
      { text: "Unable to access buildings \xE2\u20AC\u201C $20,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Third-party and IoT-related outages contribute to billions of dollars in global business losses each year.",
    remediation: "Implement cyber resilience and disaster recovery plans, including regular backups and monitoring of physical security systems. Do you have a way to get in and out of your buildings without keycard access?"
  },
  {
    event: "Natures Course",
    description: "An earthquake has taken out your Main Data Center. All other business locations seem to have limited damage.",
    impacts: [
      { text: "Outage per Hour \xE2\u20AC\u201C $60,000", mitigatedBy: "Emergency Procedures" },
      { text: "Unable to Contact Staff/Members or emergency personel \xE2\u20AC\u201C $20,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "Industry surveys suggest that **90% of mid-sized and large enterprises can lose more than $300,000 in revenue per hour of downtime after a major weather event.",
    remediation: "If a major weather event or earthquake were to happen, how would your building(s) survive? How quickly could you recover from an event like this?."
  },
  {
    event: "Lost Unencrypted Laptop",
    description: "An Employee at a conference leaves their laptop with sensitive data in their vehicle. The laptop is missing and presumed stolen.",
    impacts: [
      { text: "Data exposure \xE2\u20AC\u201C $45,000", mitigatedBy: "Encryption" },
      { text: "Asset tracking failure \xE2\u20AC\u201C $20,000", mitigatedBy: "Asset Inventory" }
    ],
    stats: "Lost devices are the direct cause of 15% of data breaches.",
    remediation: "Encrypt devices and track assets. Do you have a good inventory system? Inventory is #1 in the NIST Framework for Cybersecurity Controls. Would you know if a laptop was missing, or who one belonged to if it was found?"
  },
  {
    event: "DNS Hijacking",
    description: "Domain records are altered to redirect web traffic from a known good website to a malicious one. This bad shortcut is now being pushed to all staff.",
    impacts: [
      { text: "Website outage \xE2\u20AC\u201C $35,000", mitigatedBy: "Threat Intelligence" },
      { text: "Delayed detection \xE2\u20AC\u201C $20,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "DNS hijacks can impact thousands of users quickly and are hard to catch.",
    remediation: "Secure DNS accounts and monitor changes."
  },
  {
    event: "Insider Sabotage",
    description: "A Disgruntled employee deletes all your Access management Data before he leaves on his last day. ie;ise, AD, entra etc.",
    impacts: [
      { text: "Data loss \xE2\u20AC\u201C $60,000", mitigatedBy: "Backup & Restore" },
      { text: "Delayed detection \xE2\u20AC\u201C $30,000", mitigatedBy: "User Activity Logs" }
    ],
    stats: "Insider sabotage is frequent in todays business world and can cause major operational damage and downtime if recovery systems are not put in place.",
    remediation: "Monitor behavior and enforce access controls. Do you have a goood onboarding and offboarding process?"
  },
  {
    event: "Credential Harvesting Website",
    description: "Staff trying to download a PDF reader find themselves on a Fake login page that captures their credentials (Username and password).",
    impacts: [
      { text: "Account compromise \xE2\u20AC\u201C $35,000", mitigatedBy: "Employee Training" },
      { text: "Unauthorized access \xE2\u20AC\u201C $25,000", mitigatedBy: "Multi-factor Auth" }
    ],
    stats: "Credential harvesting is a top phishing tactic alongside direct payroll, giftcard and money transfer schemes.",
    remediation: "Educate users and enforce MFA."
  },
  {
    event: "Public Wi-Fi Credential Theft",
    description: "Employee logs in to unsecured Wi-Fi that closely mimics yours, giving up that users username and password for your organization.",
    impacts: [
      { text: "Credential interception \xE2\u20AC\u201C $30,000", mitigatedBy: "Multi-factor Auth" },
      { text: "Unauthorized access \xE2\u20AC\u201C $20,000", mitigatedBy: "Employee Training" }
    ],
    stats: "Public Wi-Fi is a high-risk environment and shouldnt be used by Employees.",
    remediation: "Train staff and enforce MFA. With the large scale attacks in todays environment, excersise extreme caution with any Free or public wifi. Most should never be used on company owned devices."
  },
  {
    event: "VPN Credential Leak",
    description: "An Admin asks for VPN access to allow them to work from home when needed. At a conference a bad actor spots their credentials on a post it note on their laptop, allowing remote access to your environment.",
    impacts: [
      { text: "Network breach \xE2\u20AC\u201C $40,000", mitigatedBy: "Multi-factor Auth" },
      { text: "Suspicious activity unnoticed \xE2\u20AC\u201C $30,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "VPN access remains a prime target. Many compaines will allow VPN access for remote work from personal devices or improperly secured ones.",
    remediation: "Enforce MFA and monitor logins. In General, VPN Access should only be allowed by those individuals it is strictly necessary for and not on a permananent basis. Setting login times can also help prevent attacks."
  },
  {
    event: "New Parking Lot.",
    description: "A sink Hole drops your primary data center into a 20ft hole.",
    impacts: [
      { text: "Loss of Data \xE2\u20AC\u201C $80,000", mitigatedBy: "Backup & Restore" },
      { text: "Natural Disaster \xE2\u20AC\u201C $2,000,000", mitigatedBy: "Disaster Recovery Plan" }
    ],
    stats: "Environmental problems are an ever present risk.",
    remediation: "Train staff on Worst Case Senarios, and test backups regularly."
  },
  {
    event: "Do you hear buzzing?.",
    description: "Bees have taken over your server room through the HVAC system. Your entire building has to be evacuated and the HVAC has to be turned off for removal which could take several days.",
    impacts: [
      { text: "Loss of Data \xE2\u20AC\u201C $80,000", mitigatedBy: "Backup & Restore" },
      { text: "Natures Course \xE2\u20AC\u201C $2,000,000", mitigatedBy: "Disaster Recovery Plan" }
    ],
    stats: "Environmental problems are an ever present risk.",
    remediation: "Train staff on Worst Case Senarios. Rememember: You dont need a plan for all outages, just the category of outage."
  }
];
function slugifyInjectEvent(event) {
  return event.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
var injectCards = injectCardDrafts.map((inject) => ({
  id: slugifyInjectEvent(inject.event),
  ...inject
}));

// src/client/main.ts
var app = document.getElementById("app");
if (!app) throw new Error("App root not found");
var appRoot = app;
var state = {
  socket: null,
  clientId: "",
  role: null,
  room: null,
  roomCode: new URLSearchParams(window.location.search).get("room")?.toUpperCase() ?? "",
  playerName: "",
  error: "",
  hostInfo: null,
  facilitatorSelectedPlayerId: "",
  facilitatorModalMode: "",
  facilitatorFinalModalDismissed: false,
  facilitatorFinalModalRound: 0,
  injectLibrary: [],
  injectBuilderError: "",
  injectEditorId: "",
  injectDraft: createEmptyInjectDraft(),
  adminConfigured: true,
  adminAuthenticated: false,
  adminChecking: false,
  adminLoginError: ""
};
var categoryOrder = ["Identify", "Protect", "Detect", "Respond"];
var categoryClassMap = {
  Identify: "identify",
  Protect: "protect",
  Detect: "detect",
  Respond: "respond"
};
function createEmptyInjectDraft() {
  return {
    event: "",
    description: "",
    impacts: [
      { text: "", mitigatedBy: controlCards[0]?.title ?? "" },
      { text: "", mitigatedBy: controlCards[1]?.title ?? controlCards[0]?.title ?? "" }
    ],
    stats: "",
    remediation: ""
  };
}
function cloneInjectDraft(inject) {
  return {
    event: inject.event,
    description: inject.description,
    impacts: inject.impacts.map((impact) => ({ ...impact })),
    stats: inject.stats,
    remediation: inject.remediation
  };
}
function getFacilitatorSessionStorageKey() {
  return "irtt-facilitator-session";
}
function getOrCreateFacilitatorSessionKey() {
  let sessionKey = localStorage.getItem(getFacilitatorSessionStorageKey());
  if (!sessionKey) {
    sessionKey = crypto.randomUUID();
    localStorage.setItem(getFacilitatorSessionStorageKey(), sessionKey);
  }
  return sessionKey;
}
function getPlayerSessionStorageKey(roomCode) {
  return `irtt-player-session:${roomCode.toUpperCase()}`;
}
function getPlayerNameStorageKey(roomCode) {
  return `irtt-player-name:${roomCode.toUpperCase()}`;
}
function getOrCreatePlayerSessionKey(roomCode) {
  const key = getPlayerSessionStorageKey(roomCode);
  let sessionKey = localStorage.getItem(key);
  if (!sessionKey) {
    sessionKey = crypto.randomUUID();
    localStorage.setItem(key, sessionKey);
  }
  return sessionKey;
}
function persistPlayerIdentity(roomCode, playerName) {
  localStorage.setItem(getPlayerNameStorageKey(roomCode), playerName);
  getOrCreatePlayerSessionKey(roomCode);
}
function getStoredPlayerIdentity(roomCode) {
  return {
    name: localStorage.getItem(getPlayerNameStorageKey(roomCode)) ?? "",
    sessionKey: localStorage.getItem(getPlayerSessionStorageKey(roomCode)) ?? ""
  };
}
function getView() {
  if (window.location.pathname.startsWith("/admin/injects")) return "admin";
  if (window.location.pathname.startsWith("/facilitator")) return "facilitator";
  if (window.location.pathname.startsWith("/player")) return "player";
  return "landing";
}
async function loadHostInfo() {
  try {
    const response = await fetch("/api/info");
    state.hostInfo = await response.json();
  } catch {
    state.hostInfo = null;
  }
}
async function adminApiFetch(url, init = {}) {
  return fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: new Headers(init.headers)
  });
}
async function loadAdminSession() {
  if (getView() !== "admin") return;
  state.adminChecking = true;
  try {
    const response = await adminApiFetch("/api/admin/session");
    const payload = await response.json();
    state.adminConfigured = payload.configured;
    state.adminAuthenticated = payload.authenticated;
    state.adminLoginError = "";
    if (payload.authenticated) {
      await loadAdminInjectLibrary();
    }
  } catch {
    state.adminConfigured = true;
    state.adminAuthenticated = false;
    state.adminLoginError = "Unable to contact the admin service right now.";
  } finally {
    state.adminChecking = false;
  }
}
async function loadAdminInjectLibrary() {
  if (getView() !== "admin") return;
  try {
    const response = await adminApiFetch("/api/admin/injects");
    if (response.status === 401) {
      state.adminAuthenticated = false;
      state.injectLibrary = [];
      return;
    }
    const payload = await response.json();
    state.injectLibrary = payload.injects;
    state.injectBuilderError = "";
  } catch {
    state.injectBuilderError = "Unable to load the inject library right now.";
  }
}
async function loginAdmin(password) {
  state.adminLoginError = "";
  try {
    const response = await adminApiFetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      const payload = await response.json();
      state.adminLoginError = payload.message ?? "Login failed.";
      render();
      return;
    }
    state.adminAuthenticated = true;
    state.injectDraft = createEmptyInjectDraft();
    state.injectEditorId = "";
    await loadAdminInjectLibrary();
    render();
  } catch {
    state.adminLoginError = "Unable to contact the admin service right now.";
    render();
  }
}
async function logoutAdmin() {
  try {
    await adminApiFetch("/api/admin/logout", { method: "POST" });
  } catch {
  }
  state.adminAuthenticated = false;
  state.injectLibrary = [];
  state.injectBuilderError = "";
  state.injectEditorId = "";
  state.injectDraft = createEmptyInjectDraft();
  render();
}
function maybeAutoRejoinPlayerRoom() {
  if (getView() !== "player" || !state.roomCode || !state.socket || state.room) return;
  const stored = getStoredPlayerIdentity(state.roomCode);
  if (!stored.name || !stored.sessionKey) return;
  state.playerName = stored.name;
  send({ type: "join-room", roomCode: state.roomCode, name: stored.name, sessionKey: stored.sessionKey });
}
function maybeAutoRejoinFacilitatorRoom() {
  if (getView() !== "facilitator" || !state.roomCode || !state.socket || state.room) return;
  send({ type: "rejoin-facilitator", roomCode: state.roomCode, sessionKey: getOrCreateFacilitatorSessionKey() });
}
function connect() {
  if (state.socket || !["facilitator", "player"].includes(getView())) return;
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  state.socket = new WebSocket(`${protocol}://${window.location.host}`);
  state.socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "welcome") {
      state.clientId = message.clientId;
      state.role = message.role;
    }
    if (message.type === "room-created") {
      state.roomCode = message.roomCode;
      history.replaceState(null, "", `/facilitator?room=${message.roomCode}`);
    }
    if (message.type === "room-state") {
      const priorPhase = state.room?.phase;
      state.room = message.room;
      if (getView() === "facilitator") {
        if (!state.facilitatorSelectedPlayerId && message.room.players.length) {
          state.facilitatorSelectedPlayerId = message.room.players[0]?.id ?? "";
        }
        const selectedStillExists = message.room.players.some((player) => player.id === state.facilitatorSelectedPlayerId);
        if (!selectedStillExists) {
          state.facilitatorSelectedPlayerId = message.room.players[0]?.id ?? "";
          state.facilitatorModalMode = "";
        }
        if (message.room.phase === "hotwash" && priorPhase !== "hotwash") {
          state.facilitatorFinalModalDismissed = false;
          state.facilitatorFinalModalRound = message.room.round;
        }
        if (message.room.phase !== "hotwash") {
          state.facilitatorFinalModalDismissed = false;
          state.facilitatorFinalModalRound = 0;
        }
      }
    }
    if (message.type === "error") {
      state.error = message.message;
    }
    render();
    maybeAutoRejoinPlayerRoom();
    maybeAutoRejoinFacilitatorRoom();
  });
}
function send(message) {
  state.error = "";
  state.socket?.send(JSON.stringify(message));
}
function cardSelected(player, cardTitle) {
  return player?.selectedCards.includes(cardTitle) ?? false;
}
function getLocalPlayer() {
  return state.room?.players.find((player) => player.id === state.clientId);
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}
function roomJoinLinks() {
  if (!state.hostInfo || !state.roomCode) return `<div class="muted">Room link will appear once the server reports a reachable address.</div>`;
  const links = state.hostInfo.addresses.length ? state.hostInfo.addresses.map((address) => `http://${address}:${state.hostInfo?.port}/player?room=${state.roomCode}`) : [`${window.location.origin}/player?room=${state.roomCode}`];
  return `
    <div class="stack">
      ${links.map((link) => `<div><div class="eyebrow">Join URL</div><div>${escapeHtml(link)}</div></div>`).join("")}
    </div>
  `;
}
function selectAdminInject(injectId = "") {
  state.injectBuilderError = "";
  state.injectEditorId = injectId;
  if (injectId) {
    const inject = state.injectLibrary.find((entry) => entry.id === injectId);
    state.injectDraft = inject ? cloneInjectDraft(inject) : createEmptyInjectDraft();
  } else {
    state.injectDraft = createEmptyInjectDraft();
  }
  render();
}
function renderLanding() {
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Multiplayer Classroom Mode</div>
          <h1>Incident Response Tabletop Live</h1>
          <p class="muted">A facilitator hosts the room, players join on their own devices, everyone builds a deck, then the room survives the inject phase together.</p>
        </div>
        <div class="landing-actions">
          <a href="/facilitator"><button>Facilitator Screen</button></a>
          <a href="/player"><button class="secondary">Player Join</button></a>
          <a href="/admin/injects"><button class="secondary">Admin Injects</button></a>
        </div>
      </div>
    </div>
  `;
}
function renderInject(currentInject) {
  return `
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => `<div class="inject-row"><span>${escapeHtml(impact.text)}</span><span class="badge warn">${escapeHtml(impact.mitigatedBy)}</span></div>`).join("")}
    <div class="spacer"></div>
    <div class="eyebrow">Player outcomes</div>
    ${currentInject.resolutions.map((resolution) => `
      <div class="inject-row">
        <strong>${escapeHtml(resolution.playerName)}</strong>
        <div class="stack">
          ${resolution.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
          <span class="badge ${resolution.delta >= 0 ? "good" : "bad"}">${resolution.delta >= 0 ? "+" : ""}${resolution.delta}</span>
        </div>
      </div>
    `).join("")}
    ${currentInject.reports.length ? `
      <div class="spacer"></div>
      <div class="eyebrow">Submitted Reports</div>
      ${currentInject.reports.map((report) => `
        <div class="report-card">
          <strong>${escapeHtml(report.playerName)}</strong>
          <div class="muted">${report.summary ? escapeHtml(report.summary) : "No written summary provided."}</div>
          <div class="row">
            ${report.notified.length ? report.notified.map((entry) => `<span class="badge warn">${escapeHtml(entry)}</span>`).join("") : `<span class="badge">No notifications selected</span>`}
          </div>
        </div>
      `).join("")}
    ` : ""}
  `;
}
function renderFacilitatorPlayerInjectModal(currentInject, player) {
  const resolution = currentInject.resolutions.find((entry) => entry.playerId === player.id);
  const report = currentInject.reports.find((entry) => entry.playerId === player.id);
  return `
    <div class="eyebrow">Current Round View</div>
    <h2>${escapeHtml(player.name)}</h2>
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => {
    const protectedByPlayer = player.selectedCards.includes(impact.mitigatedBy);
    return `
        <div class="inject-impact ${protectedByPlayer ? "good" : "bad"}">
          <strong>${escapeHtml(impact.text)}</strong>
          <div class="muted">${protectedByPlayer ? `Covered by ${escapeHtml(impact.mitigatedBy)}` : `Missing ${escapeHtml(impact.mitigatedBy)}`}</div>
        </div>
      `;
  }).join("")}
    <div class="spacer"></div>
    <div class="inject-row">
      <strong>Round Result</strong>
      <div class="stack">
        ${resolution?.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
        <span class="badge ${resolution && resolution.delta >= 0 ? "good" : "bad"}">${resolution ? `${resolution.delta >= 0 ? "+" : ""}${resolution.delta}` : "Pending"}</span>
      </div>
    </div>
    ${report ? `
      <div class="report-card">
        <strong>Submitted Report</strong>
        <div class="muted">${report.summary ? escapeHtml(report.summary) : "No written summary provided."}</div>
        <div class="row">
          ${report.notified.length ? report.notified.map((entry) => `<span class="badge warn">${escapeHtml(entry)}</span>`).join("") : `<span class="badge">No notifications selected</span>`}
        </div>
      </div>
    ` : `<div class="report-card"><strong>No report submitted</strong><div class="muted">This player did not submit the optional incident report for this round.</div></div>`}
  `;
}
function renderInjectBuilderContent() {
  const draft = state.injectDraft;
  return `
    <div class="inject-builder-page">
      ${state.injectBuilderError ? `<div class="panel slim-panel"><span class="badge bad">${escapeHtml(state.injectBuilderError)}</span></div>` : ""}
      <div class="inject-builder-layout">
        <div class="inject-library-list">
          <div class="inject-builder-section-row">
            <div class="eyebrow">Library</div>
            <button class="secondary slim-button" id="create-new-inject" type="button">New Inject</button>
          </div>
          ${state.injectLibrary.length ? state.injectLibrary.map((inject) => `
              <div class="inject-library-item ${inject.id === state.injectEditorId ? "active" : ""}">
                <div>
                  <strong>${escapeHtml(inject.event)}</strong>
                  <div class="muted">${inject.impacts.length} impacts</div>
                </div>
                <div class="stack">
                  <button class="secondary slim-button" data-inject-edit-id="${inject.id}">Edit</button>
                  <button class="danger slim-button" data-inject-delete-id="${inject.id}">Delete</button>
                </div>
              </div>
            `).join("") : `<div class="muted">No inject cards yet. Create the first one to seed the library.</div>`}
        </div>
        <div class="inject-builder-form">
          <label class="form-block">
            <span class="eyebrow">Inject Title</span>
            <input id="inject-event" value="${escapeHtml(draft.event)}" maxlength="120" placeholder="Ransomware - Shared Drive Encryption">
          </label>
          <label class="form-block">
            <span class="eyebrow">Scenario Description</span>
            <textarea id="inject-description" maxlength="600" placeholder="What is happening in this inject?">${escapeHtml(draft.description)}</textarea>
          </label>
          <div class="form-block">
            <div class="inject-builder-section-row">
              <span class="eyebrow">Impact Rows</span>
              <button class="secondary slim-button" id="add-impact-row" type="button">Add Impact</button>
            </div>
            <div class="inject-impact-list">
              ${draft.impacts.map((impact, index) => `
                <div class="inject-impact-editor">
                  <input data-impact-text-index="${index}" value="${escapeHtml(impact.text)}" maxlength="140" placeholder="What goes wrong for the team?">
                  <select data-impact-control-index="${index}">
                    ${controlCards.map((card) => `<option value="${escapeHtml(card.title)}" ${impact.mitigatedBy === card.title ? "selected" : ""}>${escapeHtml(card.title)}</option>`).join("")}
                  </select>
                  <button class="danger slim-button" data-remove-impact-index="${index}" type="button" ${draft.impacts.length <= 1 ? "disabled" : ""}>Remove</button>
                </div>
              `).join("")}
            </div>
          </div>
          <label class="form-block">
            <span class="eyebrow">Context / Stats</span>
            <textarea id="inject-stats" maxlength="400" placeholder="Why does this scenario matter in the real world?">${escapeHtml(draft.stats)}</textarea>
          </label>
          <label class="form-block">
            <span class="eyebrow">Remediation Guidance</span>
            <textarea id="inject-remediation" maxlength="500" placeholder="What should the team discuss or do next?">${escapeHtml(draft.remediation)}</textarea>
          </label>
          <div class="controls">
            <button class="success" id="save-inject">${state.injectEditorId ? "Save Changes" : "Create Inject"}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function renderFacilitator() {
  const room = state.room;
  const players = room?.players ?? [];
  const ready = players.filter((player) => player.locked).length;
  const canBegin = Boolean(room && room.phase === "deckbuild" && players.length > 0 && ready === players.length);
  const currentInject = room?.currentInject;
  const selectedPlayer = players.find((player) => player.id === state.facilitatorSelectedPlayerId) ?? players[0];
  const showFinalModal = Boolean(
    room && room.phase === "hotwash" && room.round >= room.maxRounds && !state.facilitatorFinalModalDismissed
  );
  const showPlayerModal = Boolean(selectedPlayer && state.facilitatorModalMode);
  appRoot.innerHTML = `
    <div class="app-shell">
      ${room ? "" : `
        <div class="hero">
          <div>
            <div class="eyebrow">Facilitator Console</div>
            <h1>Run the room and drive the incident</h1>
            <p class="muted">Create the room, let everyone build decks, then move the group into live injects and hotwash.</p>
          </div>
          <div class="controls">
            <a href="/admin/injects"><button class="secondary" type="button">Admin Injects</button></a>
            <button id="create-room">Create Room</button>
          </div>
        </div>
      `}
      ${state.error ? `<div class="panel"><span class="badge bad">${escapeHtml(state.error)}</span></div>` : ""}
      ${room ? `
        <div class="panel room-panel">
          <div class="room-panel-header">
            <div>
              <div class="eyebrow">Room</div>
              <h2>Code: ${room.roomCode}</h2>
            </div>
            <div class="controls">
              <a href="/admin/injects"><button class="secondary" type="button">Admin Injects</button></a>
              <button class="secondary" id="reset-room">Reset Room</button>
              ${room.phase === "deckbuild" ? `<button id="begin-gameplay" ${canBegin ? "" : "disabled"}>Begin Incident Phase</button>` : ""}
              ${room.phase === "gameplay" ? `<button id="draw-inject">Draw Inject</button>` : ""}
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="muted">Phase</span><span class="value">${room.phase}</span></div>
            <div class="stat"><span class="muted">Players</span><span class="value">${players.length}</span></div>
            <div class="stat"><span class="muted">Locked</span><span class="value">${ready}/${players.length}</span></div>
            <div class="stat"><span class="muted">Round</span><span class="value">${room.round}/${room.maxRounds}</span></div>
          </div>
          <div class="spacer"></div>
          ${roomJoinLinks()}
        </div>
        <div class="layout">
          <div>
            <div class="panel">
              <div class="eyebrow">Players</div>
              <h3>Readiness Board</h3>
              <div class="players">
                ${players.length ? players.map((player) => `
                  <div class="player-row">
                    <div>
                      <button class="player-name-button ${player.id === selectedPlayer?.id && state.facilitatorModalMode === "deck" ? "active" : ""}" data-player-id="${player.id}" data-player-view="deck">${escapeHtml(player.name)}</button>
                      <div class="muted">${player.selectedCards.length} cards selected \u2022 ${player.budgetRemaining.toLocaleString()} budget left</div>
                    </div>
                    <div class="stack">
                      <button class="secondary remove-player-button" data-remove-player-id="${player.id}">Remove</button>
                      <span class="badge ${player.connected ? "good" : "warn"}">${player.connected ? "Connected" : "Offline"}</span>
                      <span class="badge ${player.locked ? "good" : "warn"}">${player.locked ? "Locked" : "Building"}</span>
                    </div>
                  </div>
                `).join("") : `<div class="muted">No players yet. Share the join URL and room code.</div>`}
              </div>
            </div>
            <div class="panel">
              <div class="eyebrow">Leaderboard</div>
              <h3>Team Results</h3>
              <div class="leaderboard">
                ${players.map((player) => `
                  <div class="leaderboard-item">
                    <button class="player-name-button ${player.id === selectedPlayer?.id && state.facilitatorModalMode === "inject" ? "active" : ""}" data-player-id="${player.id}" data-player-view="inject">${escapeHtml(player.name)}</button>
                    <div><span class="muted">Score</span><div>${player.score}</div></div>
                    <div><span class="muted">Last</span><div>${player.lastDelta >= 0 ? "+" : ""}${player.lastDelta}</div></div>
                    <div><span class="muted">Hits</span><div>${player.criticalHits}</div></div>
                    <div><span class="muted">Cards</span><div>${player.selectedCards.length}</div></div>
                  </div>
                `).join("") || `<div class="muted">Players will appear here after they join the room.</div>`}
              </div>
            </div>
          </div>
          <div>
            <div class="panel">
              <div class="eyebrow">Current Inject</div>
              ${currentInject ? renderInject(currentInject) : `<div class="muted">No inject has been drawn yet.</div>`}
            </div>
          </div>
        </div>
      ` : ""}
      ${showPlayerModal && selectedPlayer ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            ${state.facilitatorModalMode === "deck" ? `
                <div class="eyebrow">Locked Deck</div>
                <h2>${escapeHtml(selectedPlayer.name)}</h2>
                ${selectedPlayer.selectedCards.length ? selectedPlayer.selectedCards.map((title) => `<div class="inject-row"><span>${escapeHtml(title)}</span></div>`).join("") : `<div class="muted">No cards selected yet.</div>`}
              ` : currentInject ? renderFacilitatorPlayerInjectModal(currentInject, selectedPlayer) : `
                  <div class="eyebrow">Current Round View</div>
                  <h2>${escapeHtml(selectedPlayer.name)}</h2>
                  <div class="muted">No inject has been drawn yet, so there is no current-round player view to display.</div>
                `}
            <div class="controls">
              <button id="close-player-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
      ${showFinalModal && room ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            <div class="eyebrow">Final Scores</div>
            <h2>Round ${room.maxRounds} complete</h2>
            <p class="muted">All five rounds have been resolved. Scores reflect how hard each team was hit over the full exercise.</p>
            <div class="leaderboard">
              ${[...players].sort((a, b) => b.score - a.score).map((player) => `
                  <div class="leaderboard-item">
                    <strong>${escapeHtml(player.name)}</strong>
                    <div><span class="muted">Final Score</span><div>${player.score}</div></div>
                    <div><span class="muted">Critical Hits</span><div>${player.criticalHits}</div></div>
                    <div><span class="muted">Cards</span><div>${player.selectedCards.length}</div></div>
                    <div><span class="muted">Status</span><div>${player.score >= 0 ? "Held" : "Overrun"}</div></div>
                  </div>
                `).join("")}
            </div>
            <div class="controls">
              <button id="close-final-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
    </div>
  `;
  document.getElementById("create-room")?.addEventListener(
    "click",
    () => send({ type: "create-room", sessionKey: getOrCreateFacilitatorSessionKey() })
  );
  document.getElementById("begin-gameplay")?.addEventListener("click", () => send({ type: "begin-gameplay", roomCode: state.roomCode }));
  document.getElementById("draw-inject")?.addEventListener("click", () => send({ type: "draw-inject", roomCode: state.roomCode }));
  document.getElementById("reset-room")?.addEventListener("click", () => send({ type: "reset-room", roomCode: state.roomCode }));
  document.querySelectorAll("[data-player-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const clickedId = button.getAttribute("data-player-id") ?? "";
      const clickedView = button.getAttribute("data-player-view") ?? "";
      const isSame = state.facilitatorSelectedPlayerId === clickedId && state.facilitatorModalMode === clickedView;
      state.facilitatorSelectedPlayerId = isSame ? "" : clickedId;
      state.facilitatorModalMode = isSame ? "" : clickedView;
      render();
    });
  });
  document.querySelectorAll("[data-remove-player-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const playerId = button.getAttribute("data-remove-player-id") ?? "";
      const player = players.find((entry) => entry.id === playerId);
      if (!playerId || !player) return;
      const confirmed = window.confirm(`Remove ${player.name} from the room?`);
      if (!confirmed) return;
      if (state.facilitatorSelectedPlayerId === playerId) {
        state.facilitatorSelectedPlayerId = "";
        state.facilitatorModalMode = "";
      }
      send({ type: "remove-player", roomCode: state.roomCode, playerId });
    });
  });
  document.getElementById("close-player-modal")?.addEventListener("click", () => {
    state.facilitatorSelectedPlayerId = "";
    state.facilitatorModalMode = "";
    render();
  });
  document.getElementById("close-final-modal")?.addEventListener("click", () => {
    state.facilitatorFinalModalDismissed = true;
    render();
  });
}
function renderAdmin() {
  const injectCount = state.injectLibrary.length;
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Admin Console</div>
          <h1>Inject Builder</h1>
          <p class="muted">Manage the persistent inject library from a separate protected admin route.</p>
        </div>
        <div class="controls">
          <a href="/facilitator"><button class="secondary" type="button">Back to Facilitator</button></a>
          ${state.adminAuthenticated ? `<button id="admin-logout">Log Out</button>` : ""}
        </div>
      </div>
      ${state.adminChecking ? `
        <div class="panel">
          <div class="muted">Checking admin session...</div>
        </div>
      ` : !state.adminConfigured ? `
        <div class="panel">
          <div class="eyebrow">Not Configured</div>
          <h2>Admin login is disabled</h2>
          <p class="muted">Set <code>ADMIN_PASSWORD_HASH</code> on the server to enable the admin route.</p>
        </div>
      ` : !state.adminAuthenticated ? `
        <div class="panel admin-login-panel">
          <div class="eyebrow">Admin Login</div>
          <h2>Sign in to manage inject cards</h2>
          <p class="muted">This route is separate from the live game and uses a secure admin session.</p>
          ${state.adminLoginError ? `<div class="badge bad">${escapeHtml(state.adminLoginError)}</div>` : ""}
          <div class="join-form">
            <input id="admin-password" type="password" placeholder="Admin password">
            <button id="admin-login">Log In</button>
          </div>
        </div>
      ` : `
        <div class="panel room-panel">
          <div class="room-panel-header">
            <div>
              <div class="eyebrow">Library Status</div>
              <h2>${injectCount} Inject Cards</h2>
            </div>
            <div class="controls">
              <button class="secondary" id="create-new-inject" type="button">New Inject</button>
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="muted">Saved Injects</span><span class="value">${injectCount}</span></div>
            <div class="stat"><span class="muted">Status</span><span class="value">Protected</span></div>
            <div class="stat"><span class="muted">Route</span><span class="value">/admin/injects</span></div>
            <div class="stat"><span class="muted">Access</span><span class="value">Cookie Session</span></div>
          </div>
        </div>
        ${renderInjectBuilderContent()}
      `}
    </div>
  `;
  document.getElementById("admin-login")?.addEventListener("click", () => {
    const password = document.getElementById("admin-password")?.value ?? "";
    void loginAdmin(password);
  });
  document.getElementById("admin-password")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const password = document.getElementById("admin-password")?.value ?? "";
    void loginAdmin(password);
  });
  document.getElementById("admin-logout")?.addEventListener("click", () => {
    void logoutAdmin();
  });
  if (!state.adminAuthenticated) return;
  document.getElementById("create-new-inject")?.addEventListener("click", () => selectAdminInject());
  document.querySelectorAll("[data-inject-edit-id]").forEach((button) => {
    button.addEventListener("click", () => selectAdminInject(button.getAttribute("data-inject-edit-id") ?? ""));
  });
  document.querySelectorAll("[data-inject-delete-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const injectId = button.getAttribute("data-inject-delete-id") ?? "";
      const inject = state.injectLibrary.find((entry) => entry.id === injectId);
      if (!inject) return;
      const confirmed = window.confirm(`Delete inject card "${inject.event}"?`);
      if (!confirmed) return;
      try {
        const response = await adminApiFetch(`/api/admin/injects/${injectId}`, { method: "DELETE" });
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.message ?? "Unable to delete inject.");
        }
        await loadAdminInjectLibrary();
        if (state.injectEditorId === injectId) {
          state.injectEditorId = "";
          state.injectDraft = createEmptyInjectDraft();
        }
        render();
      } catch (error) {
        state.injectBuilderError = error instanceof Error ? error.message : "Unable to delete inject.";
        render();
      }
    });
  });
  document.getElementById("add-impact-row")?.addEventListener("click", () => {
    state.injectDraft.impacts.push({ text: "", mitigatedBy: controlCards[0]?.title ?? "" });
    render();
  });
  document.querySelectorAll("[data-remove-impact-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-remove-impact-index"));
      state.injectDraft.impacts.splice(index, 1);
      render();
    });
  });
  document.querySelectorAll("[data-impact-text-index]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.getAttribute("data-impact-text-index"));
      state.injectDraft.impacts[index].text = input.value;
    });
  });
  document.querySelectorAll("[data-impact-control-index]").forEach((select) => {
    select.addEventListener("change", () => {
      const index = Number(select.getAttribute("data-impact-control-index"));
      state.injectDraft.impacts[index].mitigatedBy = select.value;
    });
  });
  document.getElementById("save-inject")?.addEventListener("click", async () => {
    state.injectBuilderError = "";
    state.injectDraft.event = document.getElementById("inject-event")?.value ?? "";
    state.injectDraft.description = document.getElementById("inject-description")?.value ?? "";
    state.injectDraft.stats = document.getElementById("inject-stats")?.value ?? "";
    state.injectDraft.remediation = document.getElementById("inject-remediation")?.value ?? "";
    try {
      const response = await adminApiFetch(state.injectEditorId ? `/api/admin/injects/${state.injectEditorId}` : "/api/admin/injects", {
        method: state.injectEditorId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.injectDraft)
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to save inject.");
      }
      await loadAdminInjectLibrary();
      if (payload.inject) {
        state.injectEditorId = payload.inject.id;
        state.injectDraft = cloneInjectDraft(payload.inject);
      }
      render();
    } catch (error) {
      state.injectBuilderError = error instanceof Error ? error.message : "Unable to save inject.";
      render();
    }
  });
}
function renderLockedDeck(player) {
  return `
    <div class="panel">
      <div class="eyebrow">Locked Loadout</div>
      <h3>Your Controls</h3>
      ${player.selectedCards.length ? player.selectedCards.map((title) => `<div class="inject-row"><span>${escapeHtml(title)}</span></div>`).join("") : `<div class="muted">No cards selected.</div>`}
    </div>
  `;
}
function renderPlayerInject(currentInject, playerId) {
  const localPlayer = getLocalPlayer();
  const resolution = currentInject.resolutions.find((entry) => entry.playerId === playerId);
  return `
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => {
    const protectedByPlayer = localPlayer?.selectedCards.includes(impact.mitigatedBy);
    return `
        <div class="inject-impact ${protectedByPlayer ? "good" : "bad"}">
          <strong>${escapeHtml(impact.text)}</strong>
          <div class="muted">${protectedByPlayer ? `Covered by ${escapeHtml(impact.mitigatedBy)}` : `Missing ${escapeHtml(impact.mitigatedBy)}`}</div>
        </div>
      `;
  }).join("")}
    <div class="spacer"></div>
    <div class="inject-row">
      <strong>Your result</strong>
      <div class="stack">
        ${resolution?.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
        <span class="badge ${resolution && resolution.delta >= 0 ? "good" : "bad"}">${resolution ? `${resolution.delta >= 0 ? "+" : ""}${resolution.delta}` : "Pending"}</span>
      </div>
    </div>
    <div class="muted">${escapeHtml(currentInject.inject.remediation)}</div>
    ${resolution && !resolution.reportSubmitted ? `
      <div class="spacer"></div>
      <div class="report-form">
        <div class="eyebrow">Optional Incident Report</div>
        <p class="muted">Submit a short round report for a +5 bonus.</p>
        <textarea id="report-summary" class="report-textarea" placeholder="What happened for your team, and what would you do next?"></textarea>
        <div class="report-checkboxes">
          ${["Law Enforcement", "Management", "Internal Ticketing", "Communications / PR", "Legal / Compliance"].map((label) => `
            <label class="report-check">
              <input type="checkbox" value="${label}">
              <span>${label}</span>
            </label>
          `).join("")}
        </div>
        <button id="submit-report" class="success">Submit Report (+5)</button>
      </div>
    ` : resolution?.reportSubmitted ? `
      <div class="spacer"></div>
      <div class="report-card">
        <strong>Report submitted</strong>
        <div class="muted">Your round report bonus has been applied.</div>
      </div>
    ` : ""}
  `;
}
function renderDeckBuilder(player) {
  return `
    <div class="panel">
      <div class="deckbuild-sticky">
        <div class="deckbuild-budget">
          <div>
            <div class="eyebrow">Budget Left</div>
            <strong>$${player.budgetRemaining.toLocaleString()}</strong>
          </div>
          <div class="muted">${player.selectedCards.length} cards selected</div>
        </div>
        <div class="row">
          ${player.locked ? `<button class="secondary" id="unlock-deck">Unlock Deck</button>` : `<button class="success" id="lock-deck">Lock Deck</button>`}
        </div>
      </div>
      <div class="spacer"></div>
      <div class="controls-grid">
        ${categoryOrder.map((category) => {
    const cards = controlCards.filter((card) => card.category === category);
    const categoryClass = categoryClassMap[category];
    return `
            <div class="category category-${categoryClass}">
              <div class="eyebrow">${category}</div>
              <h3>${category} Cards</h3>
              ${cards.map((card) => `
                <div class="control-card category-${categoryClass} ${cardSelected(player, card.title) ? "selected" : ""}">
                  <strong>${escapeHtml(card.title)}</strong>
                  <div class="muted">${escapeHtml(card.desc)}</div>
                  <div class="row">
                    <span class="badge warn category-badge-${categoryClass}">$${card.cost.toLocaleString()}</span>
                    ${cardSelected(player, card.title) ? `<span class="badge good">Selected</span>` : ""}
                  </div>
                  <button class="category-button-${categoryClass}" ${player.locked ? "disabled" : ""} data-card-toggle="${escapeHtml(card.title)}">${cardSelected(player, card.title) ? "Remove" : "Add to Deck"}</button>
                </div>
              `).join("")}
            </div>
          `;
  }).join("")}
      </div>
    </div>
  `;
}
function renderPlayer() {
  const room = state.room;
  const player = getLocalPlayer();
  const isDeckbuild = room?.phase === "deckbuild";
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Player Console</div>
          <h1>${player ? escapeHtml(player.name) : "Join the room"}</h1>
          <p class="muted">${room ? `Room ${room.roomCode} \u2022 Phase: ${room.phase}` : "Enter the facilitator's room code and your name to join."}</p>
        </div>
      </div>
      ${state.error ? `<div class="panel"><span class="badge bad">${escapeHtml(state.error)}</span></div>` : ""}
      ${!player ? `
        <div class="panel">
          <div class="join-form">
            <input id="room-code" placeholder="Room code" value="${escapeHtml(state.roomCode)}" maxlength="4">
            <input id="player-name" placeholder="Your name" value="${escapeHtml(state.playerName)}" maxlength="24">
            <button id="join-room">Join Room</button>
            <button class="secondary" id="change-room-link" type="button">Use Different Room</button>
          </div>
        </div>
      ` : `
        ${isDeckbuild ? `
          <div>
            ${renderDeckBuilder(player)}
          </div>
        ` : `
          <div class="layout">
            <div>
              <div class="panel">
                <div class="stat-grid">
                  <div class="stat"><span class="muted">Budget Left</span><span class="value">${player.budgetRemaining.toLocaleString()}</span></div>
                  <div class="stat"><span class="muted">Score</span><span class="value">${player.score}</span></div>
                  <div class="stat"><span class="muted">Critical Hits</span><span class="value">${player.criticalHits}</span></div>
                  <div class="stat"><span class="muted">Deck Status</span><span class="value">${player.locked ? "Locked" : "Open"}</span></div>
                </div>
              </div>
              ${renderLockedDeck(player)}
            </div>
            <div>
              <div class="panel">
                <div class="eyebrow">Current Round</div>
                ${room?.currentInject ? renderPlayerInject(room.currentInject, player.id) : `<div class="muted">Waiting for the facilitator to draw the next inject.</div>`}
              </div>
            </div>
          </div>
        `}
      `}
    </div>
  `;
  document.getElementById("join-room")?.addEventListener("click", () => {
    const roomCode = document.getElementById("room-code").value.toUpperCase();
    const playerName = document.getElementById("player-name").value;
    state.roomCode = roomCode;
    state.playerName = playerName;
    persistPlayerIdentity(roomCode, playerName);
    history.replaceState(null, "", `/player?room=${roomCode}`);
    send({ type: "join-room", roomCode, name: playerName, sessionKey: getOrCreatePlayerSessionKey(roomCode) });
  });
  document.getElementById("change-room-link")?.addEventListener("click", () => {
    state.roomCode = "";
    state.room = null;
    state.error = "";
    history.replaceState(null, "", "/player");
    render();
  });
  document.querySelectorAll("[data-card-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      send({ type: "toggle-card", roomCode: state.roomCode, cardTitle: button.getAttribute("data-card-toggle") ?? "" });
    });
  });
  document.getElementById("lock-deck")?.addEventListener("click", () => send({ type: "lock-deck", roomCode: state.roomCode }));
  document.getElementById("unlock-deck")?.addEventListener("click", () => send({ type: "unlock-deck", roomCode: state.roomCode }));
  document.getElementById("submit-report")?.addEventListener("click", () => {
    const summary = document.getElementById("report-summary")?.value ?? "";
    const notified = [...document.querySelectorAll(".report-check input:checked")].map((input) => input.value);
    send({ type: "submit-report", roomCode: state.roomCode, summary, notified });
  });
}
function render() {
  const view = getView();
  if (view === "landing") {
    renderLanding();
    return;
  }
  if (view === "facilitator") {
    renderFacilitator();
    return;
  }
  if (view === "admin") {
    renderAdmin();
    return;
  }
  renderPlayer();
}
async function initialize() {
  const view = getView();
  if (view === "facilitator") {
    await loadHostInfo();
  }
  if (view === "admin") {
    await loadAdminSession();
  }
  render();
}
connect();
maybeAutoRejoinPlayerRoom();
maybeAutoRejoinFacilitatorRoom();
void initialize();
//# sourceMappingURL=app.js.map
