import React from "react";
import styles from "../styles/components/AboutSection.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.lead}>
            I am an SRE who enjoys turning fragile systems into reliable
            platforms. My work combines infrastructure, automation, and
            monitoring so engineering teams can move with confidence.
          </p>
        </div>
        <div className={styles.contentGrid}>
          <article className={styles.contentBox}>
            <h3>Approach</h3>
            <p className={styles.description}>
              I focus on practical reliability engineering: clear SLOs,
              meaningful alerts, and infrastructure that is easy to operate.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>Core stack</h3>
            <p className={styles.description}>
              Kubernetes, Docker, Terraform, CI/CD tooling, and cloud
              platforms including GCP and Azure, with Datadog-based
              observability.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>Engineering style</h3>
            <p className={styles.description}>
              Calm under pressure, metrics-driven, and automation-first. I care
              about maintainable systems that work well for both users and
              engineers.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
