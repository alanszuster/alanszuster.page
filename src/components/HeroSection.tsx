import React from "react";
import styles from "../styles/components/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section id="home" className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Alan Szuster</h1>
            <h2 className={styles.heroSubtitle}>Site Reliability Engineer</h2>
            <p className={styles.heroDescription}>
              Ensures reliability and scalability of systems through CI/CD
              automation, cloud infrastructure (GCP, Azure), container
              orchestration (Docker, Kubernetes), and monitoring (Datadog,
              Zabbix). Codes in Python, Java, Node.js, TypeScript, and Bash.
              Occasionally builds AI/ML and GenAI solutions as side projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
