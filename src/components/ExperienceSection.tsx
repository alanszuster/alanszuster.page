import React from "react";
import styles from "../styles/components/ExperienceSection.module.css";

const roles = [
  {
    title: "Site Reliability Engineer",
    period: "May 2024 — Present",
    summary:
      "Running production Kubernetes and cloud platforms on GCP and Azure, plus AI agents and ML workloads.",
  },
  {
    title: "ServiceNow Developer",
    period: "Dec 2022 — May 2024",
    summary:
      "Developed and integrated the ServiceNow platform: ITSM and custom apps.",
  },
  {
    title: "IT Operator",
    period: "Jan 2022 — Nov 2022",
    summary: "First-line support for business applications used across retail.",
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className={styles.experience}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Experience</h2>
        </div>
        <ol className={styles.timeline}>
          {roles.map((role) => (
            <li key={role.title} className={styles.role}>
              <div className={styles.roleHead}>
                <h3>{role.title}</h3>
                <span className={styles.period}>{role.period}</span>
              </div>
              <p className={styles.company}>Salling Group A/S</p>
              <p className={styles.summary}>{role.summary}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
