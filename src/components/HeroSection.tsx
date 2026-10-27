import React from "react";
import styles from "../styles/components/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section id="home" className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Cloud • Platform • Software Engineering</p>
            <h1 className={styles.heroTitle}>Alan Szuster</h1>
            <h2 className={styles.heroSubtitle}>
              Cloud Engineer • Platform Engineer • Software Engineer
            </h2>
            <p className={styles.heroDescription}>
              I build and operate cloud platforms on GCP and Azure, with
              hands-on work in CI/CD, Kubernetes, Terraform, networking,
              security, and software engineering.
            </p>
            <div className={styles.heroActions}>
              <a href="#services" className={styles.primaryAction}>
                Service Scope
              </a>
              <a href="#ai-playground" className={styles.secondaryAction}>
                AI/ML Playground
              </a>
            </div>
            <div className={styles.highlights}>
              <span>CI/CD</span>
              <span>Kubernetes</span>
              <span>Terraform</span>
              <span>Datadog</span>
              <span>Python/TS/Node/Bash</span>
              <span>GCP + Azure</span>
              <span>AI/ML + Agentic</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
