import React from "react";
import styles from "../styles/components/ServicesSection.module.css";

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <div className="container px-4">
        <div className="row gx-5 justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h2 className={styles.sectionTitle}>What I Do</h2>
              <hr className={styles.divider} />
            </div>
          </div>
        </div>
        <div className="row gx-5 row-cols-1 row-cols-md-3">
          <div className="col mb-5">
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <i className="fas fa-server fa-3x mb-4 text-primary"></i>
                <h3 className={styles.cardTitle}>
                  Infrastructure & Automation
                </h3>
                <p className={styles.cardDescription}>
                  CI/CD automation, cloud infrastructure management (GCP,
                  Azure), and container orchestration with Docker and
                  Kubernetes.
                </p>
              </div>
            </div>
          </div>
          <div className="col mb-5">
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <i className="fas fa-code fa-3x mb-4 text-primary"></i>
                <h3 className={styles.cardTitle}>Software Development</h3>
                <p className={styles.cardDescription}>
                  Building scalable applications using Python, Java, Node.js,
                  and TypeScript.
                </p>
              </div>
            </div>
          </div>
          <div className="col mb-5">
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <i className="fas fa-chart-line fa-3x mb-4 text-primary"></i>
                <h3 className={styles.cardTitle}>Monitoring & Analytics</h3>
                <p className={styles.cardDescription}>
                  Implementing monitoring solutions with Datadog, Zabbix, and
                  other tools to ensure system reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
