import {
  SiApacheairflow,
  SiCss3,
  SiDocker,
  SiGooglebigquery,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiPlotly,
  SiPostgresql,
  SiPowerbi,
  SiPython,
  SiTypescript,
} from "react-icons/si";
import type { IconType } from "react-icons";

export const SKILL_ICONS: Record<string, IconType> = {
  Python: SiPython,
  PostgreSQL: SiPostgresql,
  "Google Cloud Platform": SiGooglecloud,
  BigQuery: SiGooglebigquery,
  "Apache Airflow": SiApacheairflow,
  "Power BI": SiPowerbi,
  Plotly: SiPlotly,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  HTML5: SiHtml5,
  CSS3: SiCss3,
  Docker: SiDocker,
};
