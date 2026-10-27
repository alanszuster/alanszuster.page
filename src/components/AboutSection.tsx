import React from "react";
import styles from "../styles/components/AboutSection.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.lead}>
            I work at the intersection of platform, reliability, and product
            velocity. My approach is simple: ship faster, fail safer, recover
            quicker.
          </p>
        </div>
        <div className={styles.contentGrid}>
          <article className={styles.contentBox}>
            <h3>How I work</h3>
            <p className={styles.description}>
              I focus on systems thinking, not isolated fixes. That means
              improving architecture, feedback loops, and team workflows at the
              same time.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>What I optimize</h3>
            <p className={styles.description}>
              Deployment confidence, alert quality, incident response, and
              developer ergonomics across CI/CD, Kubernetes, and cloud-native
              services.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>Engineering style</h3>
            <p className={styles.description}>
              Pragmatic, measurable, and automation-first. I value maintainable
              platforms that teams can trust in production.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
