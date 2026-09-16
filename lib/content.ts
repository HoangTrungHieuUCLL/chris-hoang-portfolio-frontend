export const profile = {
  name: "Chris Hoang",
  title: "Data Analyst & AI Engineer",
  tagline: "Data is powerful. Use it wisely.",
  location: "Munich, Germany",
  visaNote: "No visa sponsorship required",
  availableFrom: "Available from 1 Nov 2026",
  email: "chris.hoang4271@gmail.com",
  phone: "+49 171 2930766",
  bio: [
    "I specialise in turning messy, raw data into pipelines other teams can actually build on, from raw analysis to designing and building ETL/ELT infrastructure on time-series data. At IKEA Belgium that meant eight stores, eight sets of systems, and no single source of truth. I tracked down the data owners across teams, structured the data so it made sense to different stakeholders, and organised and ran the project myself end to end. What came out of it was an automated forecast pipeline with validation checks that caught bad data before it reached anyone downstream, plus the dashboard tooling built on top of it. Along the way I trained ML models that shipped, not just ones that worked in a notebook.",
    "I work fluently across SQL and PostgreSQL, Python, and data modelling, including PySpark for large datasets, plus Power BI and Google Cloud Platform. I bring an AI-first mindset, using modern AI coding assistants daily to accelerate pipeline development, automate routine data tasks, and optimise existing codebases. I have no patience for a number that doesn't add up. Raw data only becomes useful once it's structured enough for someone else to build on it.",
  ],
  lookingFor: "Positions in Data Analyst, Data Engineer, and AI Engineer roles.",
  languages: [
    { name: "Vietnamese", level: "Native" },
    { name: "English", level: "Fluent - C1" },
    { name: "Japanese", level: "Fluent - C1" },
    { name: "German", level: "Intermediate - B1" },
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/chris-hoang-ucll/",
    github: "https://github.com/HoangTrungHieuUCLL",
    instagram: "https://www.instagram.com/nojagerbombforchris/",
  },
};

export type Experience = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "AI Engineer",
    org: "HRNext.vn (Freelance)",
    period: "Aug 2025 - Present",
    bullets: [
      "Building the AI matching layer for an HR platform: candidates to roles, and roles to candidates.",
      "Fine-tuned a BERT model for named-entity recognition on CVs, pulling structured fields out of unstructured resume documents so they can be matched instead of keyword-searched. LayoutLM reads document layout rather than flat text, and DBSCAN clusters similar profiles.",
      "Extended matching into reverse search, so employers can discover candidates directly instead of waiting for applications to come in.",
      "Built and containerised the service end to end: Python API, PostgreSQL, Docker Compose for local parity across frontend, backend and database, and a test suite alongside the model code. Deployed on Railway under its own subdomain.",
    ],
  },
  {
    role: "Data Analyst",
    org: "IKEA Belgium (Internship)",
    period: "Feb 2026 - May 2026",
    bullets: [
      "Data analytics for the eCommerce team, working across Marketing, Sales and Design to turn business questions into evidence.",
      "Built an end-to-end automated pipeline forecasting weekly sales through the end of the following fiscal year, covering ingestion, transformation and delivery. IKEA Global approached the team to understand the architecture.",
      "Analysed the growth drivers behind Click&Collect using machine learning to quantify each factor's contribution. The findings gave the executive team the evidence to change service pricing strategy, which went into testing in April 2026.",
      "Sourced and reconciled inconsistent data across eight Belgian stores by tracking down data owners in different teams, then built a Power BI dashboard putting store KPIs and country-average benchmarks in one executive view.",
      "Engineered BigQuery SQL workflows and data models so analysts could pull insights without waiting on someone else's query.",
      "Built a sales prediction application letting users supply their own variables and get predicted sales back.",
      "Tools: SQL, Python, BigQuery, Google Cloud Platform, Power BI, Apache Airflow, PySpark, Excel",
    ],
  },
  {
    role: "IT Operations Analyst",
    org: "Rakuten Bank, Ltd. (Japan)",
    period: "Apr 2021 - Jul 2023",
    bullets: [
      "Monitored operational metrics (CPU, memory, disk, network traffic, logs, SNMP traps) across production servers and network devices, diagnosing incidents from time-series data and log analysis.",
      "Built an Excel VBA tool to track and consolidate server alerts automatically, cutting daily monitoring time from 5 hours to 1.",
      "Investigated incidents across teams by identifying system users, reconstructing what happened, and agreeing remediation with the people involved.",
      "Authored standard operating procedures adopted by the team, covering monitoring, maintenance and backup routines.",
      "Ran scheduled backup and recovery operations and monthly hardware inspections for the bank's server estate.",
    ],
  },
];

export type Education = {
  degree: string;
  school: string;
  period: string;
  note?: string;
};

export const education: Education[] = [
  {
    degree: "Bachelor of Applied Computer Science",
    school: "UC Leuven-Limburg, Belgium",
    period: "Sep 2023 - Jun 2026",
    note: "Magna cum laude, 77.58%",
  },
  {
    degree: "Bachelor of Informatics & Management",
    school: "Kyushu Institute of Information Sciences, Japan",
    period: "Apr 2017 - Mar 2021",
  },
];

export type SkillGroup = {
  label: string;
  skills: string[];
};

// Skills shown whether or not a project happens to list them. Everything a
// project's tech stack mentions is folded in on top of these, see buildSkillGroups.
export const skillGroups: SkillGroup[] = [
  { label: "Languages & Data", skills: ["Python", "SQL", "PostgreSQL", "PySpark", "pandas"] },
  { label: "AI & Machine Learning", skills: ["Machine Learning", "PyTorch", "scikit-learn"] },
  { label: "Computer Vision", skills: ["OpenCV", "Computer Vision"] },
  { label: "Cloud & Orchestration", skills: ["Google Cloud Platform", "BigQuery", "CloudRun", "Apache Airflow", "Docker"] },
  { label: "Visualisation & BI", skills: ["Power BI", "Looker Studio", "Matplotlib", "Seaborn", "Plotly"] },
  { label: "Web", skills: ["TypeScript", "JavaScript", "HTML5", "CSS3", "Java"] },
  { label: "Other", skills: ["Excel VBA"] },
];

// Different projects spell the same thing differently; fold those together so a
// skill cannot appear twice under two names.
const skillAliases: Record<string, string> = {
  CSS: "CSS3",
  ShinyPython: "Shiny for Python",
  Javascript: "JavaScript",
  Postgres: "PostgreSQL",
};

// Where a skill coming from a project's tech stack belongs. Anything unlisted
// falls into the last group, so a new project never gets dropped silently.
const skillCategories: Record<string, string> = {
  // Languages & Data
  Python: "Languages & Data",
  SQL: "Languages & Data",
  PostgreSQL: "Languages & Data",
  pandas: "Languages & Data",
  // AI & Machine Learning
  "Machine Learning": "AI & Machine Learning",
  PyTorch: "AI & Machine Learning",
  "scikit-learn": "AI & Machine Learning",
  BERT: "AI & Machine Learning",
  LayoutLM: "AI & Machine Learning",
  LSTM: "AI & Machine Learning",
  DBSCAN: "AI & Machine Learning",
  "TF-IDF": "AI & Machine Learning",
  NLTK: "AI & Machine Learning",
  "Random Forest": "AI & Machine Learning",
  "Google Gemini": "AI & Machine Learning",
  "Tracking Data": "AI & Machine Learning",
  // Computer Vision
  OpenCV: "Computer Vision",
  "Computer Vision": "Computer Vision",
  YOLO11: "Computer Vision",
  Ultralytics: "Computer Vision",
  ByteTrack: "Computer Vision",
  ConvNeXtV2: "Computer Vision",
  EasyOCR: "Computer Vision",
  MiDaS: "Computer Vision",
  // Cloud & Orchestration
  "Google Cloud Platform": "Cloud & Orchestration",
  "Apache Airflow": "Cloud & Orchestration",
  Docker: "Cloud & Orchestration",
  // Visualisation & BI
  "Power BI": "Visualisation & BI",
  Plotly: "Visualisation & BI",
  Streamlit: "Visualisation & BI",
  "Shiny for Python": "Visualisation & BI",
  mplsoccer: "Visualisation & BI",
  // Web
  TypeScript: "Web",
  JavaScript: "Web",
  HTML5: "Web",
  CSS3: "Web",
  Java: "Web",
  React: "Web",
  "Next.js": "Web",
  Express: "Web",
  Flask: "Web",
  "Web Speech API": "Web",
  "Web App": "Web",
  // Other
  "Excel VBA": "Other",
  PyGame: "Other",
  "Agile/SCRUM": "Other",
};

/**
 * Merges the curated skills above with every skill listed on a project, so the
 * Skills section stays in step with the projects without being edited by hand.
 */
export function buildSkillGroups(projectSkills: string[]): SkillGroup[] {
  const fallback = skillGroups[skillGroups.length - 1].label;
  const grouped = new Map<string, string[]>(
    skillGroups.map((group) => [group.label, [...group.skills]] as [string, string[]])
  );
  const known = new Set(skillGroups.flatMap((group) => group.skills));

  for (const raw of projectSkills) {
    const skill = skillAliases[raw] ?? raw;
    if (known.has(skill)) continue;
    known.add(skill);

    const label = skillCategories[skill] ?? fallback;
    const bucket = grouped.get(label);
    if (bucket) {
      bucket.push(skill);
    } else {
      grouped.set(label, [skill]);
    }
  }

  return Array.from(grouped, ([label, skills]) => ({ label, skills })).filter((group) => group.skills.length > 0);
}
