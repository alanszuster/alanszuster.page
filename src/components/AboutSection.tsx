import React from "react";
import styles from "../styles/components/AboutSection.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.lead}>
            I work across cloud, platform, networking, security, software
            engineering, and AI/ML integrations.
          </p>
        </div>
        <div className={styles.contentGrid}>
          <article className={styles.contentBox}>
            <h3>Networking & Security</h3>
            <p className={styles.description}>
              Network and security baselines, access control, and hardening
              across cloud environments.
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
