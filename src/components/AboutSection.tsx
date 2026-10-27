import React from "react";
import styles from "../styles/components/AboutSection.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.lead}>
            I work across reliability, cloud, platform, networking, security,
            and software engineering, plus AI/ML and agentic implementations
            where they improve delivery outcomes. A large part of my time is
            still hands-on production coding.
          </p>
        </div>
        <div className={styles.contentGrid}>
          <article className={styles.contentBox}>
            <h3>Reliability Engineering</h3>
            <p className={styles.description}>
              SLO/SLI definition, alert quality improvements, incident
              readiness, and measurable reliability gains in production.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>Cloud & Platform</h3>
            <p className={styles.description}>
              Kubernetes, Docker, Terraform, and CI/CD across GCP and Azure,
              with Datadog-centered operational baselines.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>Software Engineering + AI/ML</h3>
            <p className={styles.description}>
              Daily coding in Python, TypeScript, Node.js, and Bash, plus
              ML/agentic workflow implementation integrated with existing APIs,
              infrastructure, and automation pipelines.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
