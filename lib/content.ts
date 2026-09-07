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
  lookingFor: "Junior positions in Data Analyst, Data Engineer, and AI Engineer roles.",
  languages: [
    { name: "Vietnamese", level: "Native" },
    { name: "English", level: "Fluent — C1" },
    { name: "Japanese", level: "Fluent — C1" },
    { name: "German", level: "Intermediate — B1" },
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/chris-hoang-ucll/",
    github: "https://github.com/HoangTrungHieuUCLL",
    instagram: "https://www.instagram.com/nojagerbombforchris/",
  },
  resumeUrl: "/resume.pdf",
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
    period: "Feb 2026 — May 2026",
    bullets: [
      "Built data pipelines and scheduled reporting, transforming complex data into actionable insights that drive improvements in digital experience and conversion.",
      "Designed and enhanced Power BI dashboards, and engineered BigQuery SQL workflows so analysts can reliably self-serve insights.",
      "Deployed ML models to analyse large datasets and delivered clear, data-driven recommendations to stakeholders.",
    ],
  },
  {
    role: "Server Administrator",
    org: "Rakuten Bank, Ltd. (Japan)",
    period: "Apr 2021 — Jul 2023",
    bullets: [
      "Monitored and maintained servers and network devices (Zabbix) across Windows Server, RedHat, Linux, Oracle Solaris, and VMware.",
      "Ran daily, monthly, and yearly backup and disaster-recovery procedures, and composed standard operating procedures.",
    ],
  },
  {
    role: "IT Support",
    org: "Kyushu Institute of Information Sciences (Japan)",
    period: "Jan 2020 — Mar 2021",
    bullets: [
      "Provided hardware and software support and organised classes to raise cybersecurity awareness among teachers and students.",
    ],
  },
];

export const education = [
  {
    degree: "Bachelor of Applied Computer Science",
    school: "UC Leuven-Limburg, Belgium",
    period: "Sep 2023 — Jun 2026",
    note: "Magna cum laude",
  },
  {
    degree: "Bachelor of Informatics & Management",
    school: "Kyushu Institute of Information Sciences, Japan",
    period: "Apr 2017 — Mar 2021",
  },
];

export type SkillGroup = {
  label: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  { label: "Languages & Data", skills: ["Python", "SQL", "PostgreSQL", "PySpark", "ShinyPython"] },
  { label: "Cloud & Orchestration", skills: ["Google Cloud Platform", "BigQuery", "CloudRun", "Apache Airflow"] },
  { label: "Visualisation & BI", skills: ["Power BI", "Looker Studio", "Matplotlib", "Seaborn", "Plotly"] },
  { label: "Web", skills: ["TypeScript", "JavaScript", "HTML5", "CSS3", "Java"] },
  { label: "Other", skills: ["Excel VBA", "Machine Learning", "Docker"] },
];
