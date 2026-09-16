import type { Project } from "@/lib/api";

/**
 * Last-resort project data, used only when the backend can't be reached
 * (see getProjects in lib/api.ts).
 *
 * The Projects section is the strongest proof of work on the page, so it must
 * never render empty in front of a recruiter because an API call timed out.
 *
 * HAND-MAINTAINED, NOT A SNAPSHOT. Every field here was written from copy that
 * already exists in lib/content.ts, so nothing is invented - but it will drift
 * from the database as projects are edited there. Regenerate it from
 * `GET /api/projects` whenever the real data changes.
 *
 * Deliberately a partial set: it covers only the projects whose copy exists in
 * this repo. Others (faulty-gas-bottle-detection, football-tactic-prediction)
 * are omitted rather than described from guesswork - a degraded section with
 * four accurate entries beats six with two invented ones.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "automated-sales-forecast-pipeline",
    name: "Automated Sales Forecast Pipeline",
    description:
      "An end-to-end automated pipeline forecasting weekly sales through the end of the following fiscal year, covering ingestion, transformation and delivery. IKEA Global approached the team to understand the architecture.",
    tech_stack: ["Python", "SQL", "BigQuery", "Apache Airflow", "PySpark", "Google Cloud Platform"],
    category: "Data Engineering",
    organization: "IKEA Belgium",
    year: "2026",
    link_url: null,
    link_label: null,
    repo_url: null,
    image_url: null,
    image_credit_name: null,
    image_credit_url: null,
    featured: true,
  },
  {
    id: 2,
    slug: "store-kpi-dashboard",
    name: "Store KPI Dashboard",
    description:
      "Sourced and reconciled inconsistent data across eight Belgian stores by tracking down data owners in different teams, then built a Power BI dashboard putting store KPIs and country-average benchmarks in one executive view.",
    tech_stack: ["Power BI", "SQL", "BigQuery", "Excel"],
    category: "Analytics & BI",
    organization: "IKEA Belgium",
    year: "2026",
    link_url: null,
    link_label: null,
    repo_url: null,
    image_url: null,
    image_credit_name: null,
    image_credit_url: null,
    featured: true,
  },
  {
    id: 3,
    slug: "sales-impact-pricing-analysis",
    name: "Click&Collect Growth Driver Analysis",
    description:
      "Analysed the growth drivers behind Click&Collect using machine learning to quantify each factor's contribution. The findings gave the executive team the evidence to change service pricing strategy, which went into testing in April 2026.",
    tech_stack: ["Python", "scikit-learn", "SQL", "BigQuery"],
    category: "Analytics & BI",
    organization: "IKEA Belgium",
    year: "2026",
    link_url: null,
    link_label: null,
    repo_url: null,
    image_url: null,
    image_credit_name: null,
    image_credit_url: null,
    featured: true,
  },
  {
    id: 4,
    slug: "ai-talent-matching-system",
    name: "AI Talent Matching System",
    description:
      "The AI matching layer for an HR platform: candidates to roles, and roles to candidates. A fine-tuned BERT model pulls structured fields out of unstructured CVs so they can be matched instead of keyword-searched, LayoutLM reads document layout rather than flat text, and DBSCAN clusters similar profiles.",
    tech_stack: ["Python", "BERT", "LayoutLM", "DBSCAN", "PostgreSQL", "Docker"],
    category: "AI & Machine Learning",
    organization: "HRNext.vn",
    year: "2025",
    link_url: null,
    link_label: null,
    repo_url: null,
    image_url: null,
    image_credit_name: null,
    image_credit_url: null,
    featured: true,
  },
];
