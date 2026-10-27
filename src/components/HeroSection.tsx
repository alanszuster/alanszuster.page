import React from "react";
import styles from "../styles/components/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section id="home" className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Site Reliability Engineer</p>
            <h1 className={styles.heroTitle}>
              I help teams ship faster without breaking production.
            </h1>
            <h2 className={styles.heroSubtitle}>Alan Szuster</h2>
            <p className={styles.heroDescription}>
              I work across cloud infrastructure, CI/CD, and observability to
              build systems that stay reliable under real-world pressure.
            </p>
            <div className={styles.heroActions}>
              <a href="#services" className={styles.primaryAction}>
                See What I Deliver
              </a>
              <a href="#ai-playground" className={styles.secondaryAction}>
                Open Playground
              </a>
            </div>
            <div className={styles.highlights}>
              <span>CI/CD</span>
              <span>Kubernetes</span>
              <span>Datadog</span>
              <span>GCP + Azure</span>
            </div>
          </div>
          <aside className={styles.heroCard}>
            <h3>What I do daily</h3>
            <ul>
              <li>Production reliability, incident response, observability</li>
              <li>Platform automation with IaC and delivery pipelines</li>
              <li>Developer experience focused on safe release velocity</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
