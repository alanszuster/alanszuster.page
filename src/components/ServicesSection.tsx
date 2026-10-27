import React from "react";
import styles from "../styles/components/ServicesSection.module.css";

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Services</h2>
          <p className={styles.lead}>
            Hands-on delivery across SRE, cloud, platform, networking,
            security, software engineering, and AI/ML.
          </p>
        </div>
        <div className={styles.cardGrid}>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-gauge-high"></i>
              <h3 className={styles.cardTitle}>SRE & Reliability Operations</h3>
              <p className={styles.cardDescription}>
                SLO/SLI design, alert tuning, incident response support, and
                production hardening to improve stability and recovery time.
              </p>
              <p className={styles.cardMeta}>SLOs • On-call • Incident Response</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-life-ring"></i>
              <h3 className={styles.cardTitle}>Cloud Infrastructure Engineering</h3>
              <p className={styles.cardDescription}>
                Architecture and operations on GCP/Azure, including secure and
                scalable infrastructure, environment baselines, and governance.
              </p>
              <p className={styles.cardMeta}>GCP • Azure • Networking • Security</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-layer-group"></i>
              <h3 className={styles.cardTitle}>Platform & DevEx Automation</h3>
              <p className={styles.cardDescription}>
                Platform automation with Kubernetes, Terraform, and CI/CD
                workflows that improve release throughput and developer
                experience.
              </p>
              <p className={styles.cardMeta}>Kubernetes • Terraform • CI/CD</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-brain"></i>
              <h3 className={styles.cardTitle}>Software + AI/ML Engineering</h3>
              <p className={styles.cardDescription}>
                AI/ML and agentic implementation connected to production
                infrastructure, APIs, and engineering workflows, with hands-on
                coding in Python, TypeScript, Node.js, and Bash.
              </p>
              <p className={styles.cardMeta}>Python • Bash • LLM Integrations</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
