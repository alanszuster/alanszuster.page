import React from "react";
import styles from "../styles/components/ServicesSection.module.css";

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Selected Impact</h2>
          <p className={styles.lead}>
            Portfolio should show results, not only tool names. These are the
            outcomes I usually optimize for in production environments.
          </p>
        </div>
        <div className={styles.cardGrid}>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-gauge-high"></i>
              <h3 className={styles.cardTitle}>Delivery Velocity</h3>
              <p className={styles.cardDescription}>
                Designing CI/CD and release workflows that reduce lead time
                while keeping quality gates and rollback paths clear.
              </p>
              <p className={styles.cardMeta}>Automation • Testing • Release Engineering</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-life-ring"></i>
              <h3 className={styles.cardTitle}>Reliability & Resilience</h3>
              <p className={styles.cardDescription}>
                Hardening services for failure scenarios using observability,
                incident readiness, and production-safe operational practices.
              </p>
              <p className={styles.cardMeta}>SLOs • Alerting • Incident Response</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-layer-group"></i>
              <h3 className={styles.cardTitle}>Platform Scalability</h3>
              <p className={styles.cardDescription}>
                Building scalable cloud foundations across Kubernetes and
                multi-cloud infrastructure with repeatable Infrastructure as
                Code patterns.
              </p>
              <p className={styles.cardMeta}>Kubernetes • Terraform • Cloud Architecture</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
