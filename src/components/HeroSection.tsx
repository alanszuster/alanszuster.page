import React from "react";
import styles from "../styles/components/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section id="home" className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>SRE • Platform Engineering • AI Side Projects</p>
            <h1 className={styles.heroTitle}>
              Building systems that stay calm under pressure.
            </h1>
            <h2 className={styles.heroSubtitle}>Alan Szuster</h2>
            <p className={styles.heroDescription}>
              I design reliable cloud platforms, automate delivery paths, and
              turn operational chaos into measurable engineering outcomes.
            </p>
            <div className={styles.heroActions}>
              <a href="#services" className={styles.primaryAction}>
                View Portfolio
              </a>
              <a href="#ai-playground" className={styles.secondaryAction}>
                Try AI Playground
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
            <h3>Focus Areas</h3>
            <ul>
              <li>Production reliability and observability</li>
              <li>Infrastructure as Code and platform automation</li>
              <li>Developer experience and delivery speed</li>
            </ul>
          </aside>
          <div className={styles.glow} aria-hidden="true"></div>
          <div className={styles.glowSecondary} aria-hidden="true"></div>
          </div>
        </div>
    </section>
  );
}
