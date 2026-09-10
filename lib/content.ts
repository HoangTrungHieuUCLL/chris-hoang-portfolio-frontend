export const profile = {
  name: "Chris Hoang",
  title: "Data Analyst & AI Engineer",
  tagline: "Data is powerful. Use it wisely.",
  location: "Munich, Germany",
  visaNote: "No visa sponsorship required",
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
    role: "Data Analyst",
    org: "IKEA Belgium (Internship)",
    period: "Feb 2026 - May 2026",
    bullets: [
      "Built data pipelines and scheduled reporting, transforming complex data into actionable insights that drive improvements in digital experience and conversion.",
      "Designed and enhanced Power BI dashboards, and engineered BigQuery SQL workflows so analysts can reliably self-serve insights.",
      "Deployed ML models to analyse large datasets and delivered clear, data-driven recommendations to stakeholders.",
    ],
  },
  {
    role: "Server Administrator",
    org: "Rakuten Bank, Ltd. (Japan)",
    period: "Apr 2021 - Jul 2023",
    bullets: [
      "Monitored and maintained servers and network devices (Zabbix) across Windows Server, RedHat, Linux, Oracle Solaris, and VMware.",
      "Ran daily, monthly, and yearly backup and disaster-recovery procedures, and composed standard operating procedures.",
    ],
  },
  {
    role: "IT Support",
    org: "Kyushu Institute of Information Sciences (Japan)",
    period: "Jan 2020 - Mar 2021",
    bullets: [
      "Provided hardware and software support and organised classes to raise cybersecurity awareness among teachers and students.",
    ],
  },
];

export const education = [
  {
    degree: "Bachelor of Applied Computer Science",
    school: "UC Leuven-Limburg, Belgium",
    period: "Sep 2023 - Jun 2026",
    note: "Magna cum laude",
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
