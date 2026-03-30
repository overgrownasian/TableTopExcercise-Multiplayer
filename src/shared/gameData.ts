import type { ControlCard, InjectCard, InjectCardDraft } from "./types.js";

export const controlCards: ControlCard[] = [
  { title: "Employee Training", category: "Identify", cost: 35000, desc: "Educates staff on social engineering, suspicious behavior, and physical security awareness." },
  { title: "Emergency Procedures", category: "Identify", cost: 30000, desc: "Defines escalation, reporting, and verification procedures for suspicious requests and major incidents." },
  { title: "Asset Inventory", category: "Identify", cost: 25000, desc: "Maintains a current inventory of systems, devices, owners, and critical data." },
  { title: "Risk Assessment", category: "Identify", cost: 40000, desc: "Prioritizes cyber risk, outside testing, and acceptable-risk planning across the organization." },
  { title: "Phishing Campaigns", category: "Identify", cost: 25000, desc: "Runs simulations to improve staff readiness against phishing and business email compromise." },
  { title: "Firewall", category: "Protect", cost: 75000, desc: "Filters traffic between internal and external networks and segments sensitive environments." },
  { title: "Antivirus", category: "Protect", cost: 50000, desc: "Detects and blocks known malware and suspicious execution on endpoints." },
  { title: "Multi-factor Auth", category: "Protect", cost: 90000, desc: "Adds a second factor to authentication so stolen passwords are less useful." },
  { title: "Encryption", category: "Protect", cost: 85000, desc: "Protects sensitive data at rest and in transit, including backups and portable devices." },
  { title: "Patch Management", category: "Protect", cost: 60000, desc: "Applies security updates quickly to reduce exposure to known vulnerabilities." },
  { title: "SIEM Monitoring", category: "Detect", cost: 100000, desc: "Centralizes logging and alerting to help teams spot suspicious activity faster." },
  { title: "User Activity Logs", category: "Detect", cost: 30000, desc: "Tracks unusual logins, behavior changes, and risky account usage." },
  { title: "IDS", category: "Detect", cost: 80000, desc: "Detects network intrusion attempts and suspicious east-west movement." },
  { title: "Endpoint Detection", category: "Detect", cost: 60000, desc: "Provides deeper endpoint visibility into malware, scripts, and persistence behavior." },
  { title: "Threat Intelligence", category: "Detect", cost: 40000, desc: "Uses external threat data to identify likely indicators and active attacker behavior." },
  { title: "Incident Response Team", category: "Respond", cost: 100000, desc: "Ensures trained responders or contracted specialists can coordinate during a serious event." },
  { title: "Backup & Restore", category: "Respond", cost: 60000, desc: "Provides tested data recovery and restoration capability after outages, corruption, or ransomware." },
  { title: "Disaster Recovery Plan", category: "Respond", cost: 80000, desc: "Documents how to restore operations after major incidents or facility-level disruption." },
  { title: "Communications Plan", category: "Respond", cost: 40000, desc: "Defines who communicates to staff, public, leadership, and media during an outage." },
  { title: "Legal & Compliance", category: "Respond", cost: 50000, desc: "Covers notification rules, privacy obligations, and legal decision points after a breach." }
];

const injectCardDrafts: InjectCardDraft[] = [
  {
    event: "Living-off-the-Land (LotL) PowerShell Attack",
    description: "An attacker uses legitimate Windows tools (PowerShell and WMI) to move laterally through your network.",
    impacts: [
      { text: "Lateral movement across network â€“ $75,000", mitigatedBy: "IDS" },
      { text: "Malware-less persistence established â€“ $45,000", mitigatedBy: "Endpoint Detection" }
    ],
    stats: "60% of modern attacks now use 'LotL' techniques, where no actual malware files are ever saved to the disk.",
    remediation: "Enforce PowerShell Constrained Language Mode and use Endpoint Detection (EDR) to monitor for suspicious process parenting."
  },
  {
    event: "Phishing Whaling Attack",
    description: "An email from a bad actor impersonating a high ranking administrator is received. Requesting an urgent payroll transfer due to a recent bank account change. Payroll processes this change.",
    impacts: [
      { text: "Payroll funds misdirected â€“ $35,000", mitigatedBy: "Employee Training" },
      { text: "No verification of transfer â€“ $30,000", mitigatedBy: "Phishing Campaigns" }
    ],
    stats: "Phishing attacks cost US businesses $17B annually. Approximately 30% of employees click phishing links without training.",
    remediation: "Conduct employee phishing simulations and implement strict verification for anything relating to password changes, MFA Resets, Change in bank information, Paying Invoices and Wire transfers. Do you require these types of changes to be in person?"
  },
  {
    event: "Internet Service Outage",
    description: "A neighboring business has a sprinkler line put in and accidently cuts your connection to your ISP, taking your internet down for 3 days.",
    impacts: [
      { text: "Business operations disrupted â€“ $50,000", mitigatedBy: "Disaster Recovery Plan" },
      { text: "Unable to communicate to all parties â€“ $30,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "Accidental outages are extremely common, and are something a good business continitunity plan would help protect against.",
    remediation: "Outages come in all shapes and sizes, and not just ransomware events. Would your environment survive this?"
  },
  {
    event: "Ransomware â€“ Double Extortion",
    description: "Your Critical Authentication servers have been encrypted. Sensitive data is exfiltrated and a heafty ransom is demanded.",
    impacts: [
      { text: "Malware executed â€“ $80,000", mitigatedBy: "Antivirus" },
      { text: "Unable to restore systems quickly â€“ $120,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Average ransomware recovery costs now exceed $5.08 Million! Aside from the 1,000's of man hours and months it can take to recover.",
    remediation: "Use layered defenses, maintain onsite and offsite backups, and test incident response plans regularly. Are you prepared to pay? Not to pay? What if its medical data involving patient images? There are many things to consider here."
  },
  {
    event: "Insider Threat â€“ Data Exfiltration",
    description: "An Employee downloads confidential data and uploads it to their personal cloud storage because they said it was easier to use. Internal documents have been leaked to the news.",
    impacts: [
      { text: "Intellectual property loss â€“ $70,000", mitigatedBy: "User Activity Logs" },
      { text: "Business strategy exposure â€“ $35,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "Insider threats cause over $8.76M in losses per year.",
    remediation: "Monitor user behavior and enforce least privilege. Google and Microsoft both have tools to monitor both intentional and unintentional possible data exfil."
  },
  {
    event: "Malware via USB Drop",
    description: "An infected USB drive is placed in the parking lot of your organization. A staff member is curious and plugs it into their workstation. Malware quickly spreads through your network.",
    impacts: [
      { text: "Malware infection â€“ $25,000", mitigatedBy: "Antivirus" },
      { text: "Lateral movement risk â€“ $20,000", mitigatedBy: "Patch Management" }
    ],
    stats: "With new techniques being implemented all the time, USB-based malware still remains a common infection vector. Many attackers will spend over a year trying to get into a target company. Its much easier to drop a flash drive or send a phishing email to get the Information they need to attack than it is to attack externally",
    remediation: "Educate staff and use endpoint protection."
  },
  {
    event: "Web Application Exploit",
    description: "Your Employee web portal was not updated to the lastet security standards. An attacker used SQL injection to gain access to your employee information database and customer portal.",
    impacts: [
      { text: "Customer data exfiltrated â€“ $55,000", mitigatedBy: "Patch Management" },
      { text: "Loss of trust â€“ $20,000", mitigatedBy: "Encryption" }
    ],
    stats: "Web application attacks are the top method for data breaches. It can take teams of people years to fully secure a site with new Vulnerabilities coming out every day.",
    remediation: "Patch systems and conduct penetration testing. OWASP Juice Shop has some good tutorials on Injection attacks."
  },
  {
    event: "MFA Fatigue / Push Bombing",
    description: "During a major update, An attacker with a stolen password sends hundreds of MFA push notifications to a sysadmin. Thinking it was part of the update process, the admin clicks 'Approve'.",
    impacts: [
      { text: "Administrative account compromise â€“ $100,000", mitigatedBy: "Employee Training" },
      { text: "Infrastructure access â€“ $50,000", mitigatedBy: "Incident Response Team" }
    ],
    stats: "Push bombing was the primary vector in the high-profile Uber and Cisco breaches in 2022.",
    remediation: "Switch from simple 'Approve/Deny' push notifications to 'MFA Number Matching', or passkeys to ensure the user is physically present at the login screen."
  },
  {
    event: "Ransomware via 'PrintNightmare' Exploit",
    description: "Attackers exploit a critical vulnerability in the Windows Print Spooler service to gain SYSTEM-level privileges and deploy ransomware network-wide.",
    impacts: [
      { text: "Privilege escalation â€“ $80,000", mitigatedBy: "Patch Management" },
      { text: "Widespread file encryption â€“ $120,000", mitigatedBy: "Antivirus" }
    ],
    stats: "Critical vulnerabilities like PrintNightmare allow low-level users to become domain admins in seconds.",
    remediation: "Disable the Print Spooler service on domain controllers and ensure critical security patches are applied within a resonable time period after release."
  },
  {
    event: "Supply Chain Attack: Malicious Library (Log4j Anyone?)",
    description: "An internal application relies on an Open Source library that has been hijacked by a foreign threat actor. The library contains a back-door.",
    impacts: [
      { text: "Application back-door â€“ $65,000", mitigatedBy: "Threat Intelligence" },
      { text: "Data exfiltration via API â€“ $45,000", mitigatedBy: "IDS" }
    ],
    stats: "Supply chain attacks (like the SolarWinds breach) are devastating because the software comes from a 'trusted' vendor.",
    remediation: "Maintain a Software Bill of Materials (SBOM) and use network segmentation to prevent apps from communicating with unknown external IPs."
  },
  {
    event: "Shadow AI / Prompt Injection",
    description: "A staff member uses an unauthorized third-party AI tool to 'summarize' confidential information. The AI tool's database is used to train a public model, exposing your confidential data.",
    impacts: [
      { text: "Intellectual property leak â€“ $75,000", mitigatedBy: "Risk Assessment" },
      { text: "Compliance violation (Data Privacy) â€“ $45,000", mitigatedBy: "Legal & Compliance" }
    ],
    stats: "Shadow AI (using AI without IT approval) has overtaken other types of accidental corporate data leakage Worldwide.",
    remediation: "Establish an 'Acceptable Use Policy' for Generative AI and implement CASB (Cloud Access Security Broker) tools to block unauthorized AI domains."
  },
  {
    event: "Physical Social Engineering: 'Tailgating'",
    description: "A person dressed as a delivery driver, carrying a large box, waits by the Main entrance. A staff member holds the door open for them. The intruder places a 'Dropbox' device (a small pirate computer) behind a printer, granting them remote access to your internal network.",
    impacts: [
      { text: "Physical perimeter breach â€“ $40,000", mitigatedBy: "Employee Training" },
      { text: "Internal network backdoor â€“ $70,000", mitigatedBy: "IDS" }
    ],
    stats: "Physical security is the first line of defense; a $100 device hidden inside a building can bypass a $100,000 external firewall.",
    remediation: "Conduct 'Badge-In' training and ensure that all network jacks in public-facing areas (lobbies, conference rooms) are disabled or restricted by MAC-filtering."
  },
  {
    event: "How was your Hawaii trip?",
    description: "A staff member unknowingly brings a family of hissing cockroaches back from vacation in their backpack. These pests have now infested the server room, and they are causing electrical arcing and shorting out of equipment.",
    impacts: [
      { text: "Hardware failure and short circuits â€“ $85,000", mitigatedBy: "Risk Assessment" },
      { text: "Network downtime and data loss â€“ $45,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Environmental threats aren't just weather-related; bio-infestations can cause permanent 'carbon tracking' on circuit boards, leading to cascading hardware failures that are often not covered by standard e-waste warranties.",
    remediation: "Immediately power down affected racks to prevent fire, engage professional pest control for deep-clean fumigation, and utilize off-site Disaster Recovery (DR) sites to maintain business continuity while hardware is replaced."
  },
  {
    event: "DDoS Attack",
    description: "Bad Actors flood your external facing IP's with traffic, causing your network equipment to have a memory dump error and crash. You are currently down.",
    impacts: [
      { text: "Service downtime â€“ $35,000", mitigatedBy: "Firewall" },
      { text: "Lost revenue â€“ $25,000", mitigatedBy: "Incident Response Team" }
    ],
    stats: "Average DDoS attack costs $20,000â€“$40,000 per hour of downtime.",
    remediation: "Deploy traffic filtering and response procedures. Remember that having your device ignore traffic still has a CPU cost. Do you have DDos prevention?"
  },
  {
    event: "Spear Phishing â€“ HR Compromise",
    description: "An email was sent to HR asking them to Verify Their Email or it will be shut off. The Staff members put in their username and password allowing their Credentials to be sent to a bad actor. This resulted in stolen data, exposing employee PII, and an impending ransomware attack.",
    impacts: [
      { text: "Employee PII leaked â€“ $40,000", mitigatedBy: "Employee Training" },
      { text: "Reputation damage â€“ $15,000", mitigatedBy: "Multi-factor Auth" }
    ],
    stats: "Social engineering caused 36% of reported breaches in 2023.",
    remediation: "Train staff on IT procedures and enforce MFA on all accounts. This is an extremely common attack vector and millions of these types of emails are sent daily."
  },
  {
    event: "Communications outage",
    description: "AWS North american servers are down. Your VOIP, and Email providers are expierencing an outage as a result.",
    impacts: [
      { text: "Servers are Down â€“ $60,000", mitigatedBy: "Emergency Procedures" },
      { text: "Unable to contact staff/Members â€“ $20,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "3rd party outages cost companies Billions in losses globally.",
    remediation: "Cyber resilance plans are important for all scenarios. Make good generalized Disaster recovery plans. Do you have a way to communicate if phones and email are down?"
  },
  {
    event: "Door Access Control Outage",
    description: "Targeting IOT devices, A bad actor tries to access your Facilites door access server. The bad actor did not gain access, but the Database that holds all of your door access key card data is now corrupted.",
    impacts: [
      { text: "Access control restricted â€“ $60,000", mitigatedBy: "SIEM Monitoring" },
      { text: "Unable to access buildings â€“ $20,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Third-party and IoT-related outages contribute to billions of dollars in global business losses each year.",
    remediation: "Implement cyber resilience and disaster recovery plans, including regular backups and monitoring of physical security systems. Do you have a way to get in and out of your buildings without keycard access?"
  },
  {
    event: "Natures Course",
    description: "An earthquake has taken out your Main Data Center. All other business locations seem to have limited damage.",
    impacts: [
      { text: "Outage per Hour â€“ $60,000", mitigatedBy: "Emergency Procedures" },
      { text: "Unable to Contact Staff/Members or emergency personel â€“ $20,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "Industry surveys suggest that **90% of mid-sized and large enterprises can lose more than $300,000 in revenue per hour of downtime after a major weather event.",
    remediation: "If a major weather event or earthquake were to happen, how would your building(s) survive? How quickly could you recover from an event like this?."
  },
  {
    event: "Lost Unencrypted Laptop",
    description: "An Employee at a conference leaves their laptop with sensitive data in their vehicle. The laptop is missing and presumed stolen.",
    impacts: [
      { text: "Data exposure â€“ $45,000", mitigatedBy: "Encryption" },
      { text: "Asset tracking failure â€“ $20,000", mitigatedBy: "Asset Inventory" }
    ],
    stats: "Lost devices are the direct cause of 15% of data breaches.",
    remediation: "Encrypt devices and track assets. Do you have a good inventory system? Inventory is #1 in the NIST Framework for Cybersecurity Controls. Would you know if a laptop was missing, or who one belonged to if it was found?"
  },
  {
    event: "DNS Hijacking",
    description: "Domain records are altered to redirect web traffic from a known good website to a malicious one. This bad shortcut is now being pushed to all staff.",
    impacts: [
      { text: "Website outage â€“ $35,000", mitigatedBy: "Threat Intelligence" },
      { text: "Delayed detection â€“ $20,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "DNS hijacks can impact thousands of users quickly and are hard to catch.",
    remediation: "Secure DNS accounts and monitor changes."
  },
  {
    event: "Insider Sabotage",
    description: "A Disgruntled employee deletes all your Access management Data before he leaves on his last day. ie;ise, AD, entra etc.",
    impacts: [
      { text: "Data loss â€“ $60,000", mitigatedBy: "Backup & Restore" },
      { text: "Delayed detection â€“ $30,000", mitigatedBy: "User Activity Logs" }
    ],
    stats: "Insider sabotage is frequent in todays business world and can cause major operational damage and downtime if recovery systems are not put in place.",
    remediation: "Monitor behavior and enforce access controls. Do you have a goood onboarding and offboarding process?"
  },
  {
    event: "Credential Harvesting Website",
    description: "Staff trying to download a PDF reader find themselves on a Fake login page that captures their credentials (Username and password).",
    impacts: [
      { text: "Account compromise â€“ $35,000", mitigatedBy: "Employee Training" },
      { text: "Unauthorized access â€“ $25,000", mitigatedBy: "Multi-factor Auth" }
    ],
    stats: "Credential harvesting is a top phishing tactic alongside direct payroll, giftcard and money transfer schemes.",
    remediation: "Educate users and enforce MFA."
  },
  {
    event: "Public Wi-Fi Credential Theft",
    description: "Employee logs in to unsecured Wi-Fi that closely mimics yours, giving up that users username and password for your organization.",
    impacts: [
      { text: "Credential interception â€“ $30,000", mitigatedBy: "Multi-factor Auth" },
      { text: "Unauthorized access â€“ $20,000", mitigatedBy: "Employee Training" }
    ],
    stats: "Public Wi-Fi is a high-risk environment and shouldnt be used by Employees.",
    remediation: "Train staff and enforce MFA. With the large scale attacks in todays environment, excersise extreme caution with any Free or public wifi. Most should never be used on company owned devices."
  },
  {
    event: "VPN Credential Leak",
    description: "An Admin asks for VPN access to allow them to work from home when needed. At a conference a bad actor spots their credentials on a post it note on their laptop, allowing remote access to your environment.",
    impacts: [
      { text: "Network breach â€“ $40,000", mitigatedBy: "Multi-factor Auth" },
      { text: "Suspicious activity unnoticed â€“ $30,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "VPN access remains a prime target. Many compaines will allow VPN access for remote work from personal devices or improperly secured ones.",
    remediation: "Enforce MFA and monitor logins. In General, VPN Access should only be allowed by those individuals it is strictly necessary for and not on a permananent basis. Setting login times can also help prevent attacks."
  },
  {
    event: "New Parking Lot.",
    description: "A sink Hole drops your primary data center into a 20ft hole.",
    impacts: [
      { text: "Loss of Data â€“ $80,000", mitigatedBy: "Backup & Restore" },
      { text: "Natural Disaster â€“ $2,000,000", mitigatedBy: "Disaster Recovery Plan" }
    ],
    stats: "Environmental problems are an ever present risk.",
    remediation: "Train staff on Worst Case Senarios, and test backups regularly."
  },
  {
    event: "Do you hear buzzing?.",
    description: "Bees have taken over your server room through the HVAC system. Your entire building has to be evacuated and the HVAC has to be turned off for removal which could take several days.",
    impacts: [
      { text: "Loss of Data â€“ $80,000", mitigatedBy: "Backup & Restore" },
      { text: "Natures Course â€“ $2,000,000", mitigatedBy: "Disaster Recovery Plan" }
    ],
    stats: "Environmental problems are an ever present risk.",
    remediation: "Train staff on Worst Case Senarios. Rememember: You dont need a plan for all outages, just the category of outage."
  }
];

function slugifyInjectEvent(event: string) {
  return event
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-' )
    .replace(/(^-|-$)/g, '');
}

export const injectCards: InjectCard[] = injectCardDrafts.map((inject) => ({
  id: slugifyInjectEvent(inject.event),
  ...inject
}));


