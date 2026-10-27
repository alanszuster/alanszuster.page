import React from "react";
import styles from "../styles/components/ServicesSection.module.css";

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>How I Help Teams</h2>
          <p className={styles.lead}>
            I focus on outcomes that matter in real production environments:
            faster delivery, safer operations, and scalable platforms.
          </p>
        </div>
        <div className={styles.cardGrid}>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-gauge-high"></i>
              <h3 className={styles.cardTitle}>Release Flow</h3>
              <p className={styles.cardDescription}>
                I design CI/CD pipelines that shorten lead time while keeping
                quality gates and rollback paths explicit.
              </p>
              <p className={styles.cardMeta}>Automation • Testing • Release Engineering</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-life-ring"></i>
              <h3 className={styles.cardTitle}>Reliability Operations</h3>
              <p className={styles.cardDescription}>
                I build observability and incident workflows that reduce noise,
                speed up diagnosis, and improve on-call confidence.
              </p>
              <p className={styles.cardMeta}>SLOs • Alerting • Incident Response</p>
            </div>
          </article>
          <article className={styles.card}>
            <div className={styles.cardBody}>
              <i className="fas fa-layer-group"></i>
              <h3 className={styles.cardTitle}>Scalable Platform</h3>
              <p className={styles.cardDescription}>
                I build repeatable cloud foundations across Kubernetes and
                multi-cloud environments using Infrastructure as Code.
              </p>
              <p className={styles.cardMeta}>Kubernetes • Terraform • Cloud Architecture</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
