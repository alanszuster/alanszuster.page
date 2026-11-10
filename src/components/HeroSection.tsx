import React from "react";
import Image from "next/image";
import styles from "../styles/components/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section id="home" className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>
              Cloud • Platform • DevOps • AIOps • Software Engineering • AI Engineering
            </p>
            <h1 className={styles.heroTitle}>Alan Szuster</h1>
            <h2 className={styles.heroSubtitle}>Site Reliability Engineer</h2>
            <p className={styles.heroDescription}>
              Working on cloud infrastructure and platform engineering across
              GCP and Azure, focusing on Kubernetes, container orchestration,
              Infrastructure as Code, CI/CD automation, and cloud-native
              environments.
            </p>
            <p className={styles.heroDescription}>
              Designing, maintaining, and improving infrastructure, automating
              workflows, and developing tools and solutions using Python,
              Terraform, JavaScript, Node.js, TypeScript, and Bash. Working
              across both infrastructure and development aspects of AI/ML,
              including GPU workloads, LLMs, Machine Learning, and Agentic AI
              solutions.
            </p>
            <div className={styles.heroActions}>
              <a
                href="/Alan-Szuster-CV.pdf"
                download
                className={styles.primaryAction}
              >
                <i className="fas fa-download" aria-hidden="true"></i>
                Download CV
              </a>
              <a
                href="mailto:alan@alanszuster.dev"
                className={styles.secondaryAction}
              >
                Get in touch
              </a>
            </div>
          </div>
          <div className={styles.photoWrap}>
            <Image
              src="/alan.jpg"
              alt="Portrait of Alan Szuster"
              width={320}
              height={400}
              priority
              className={styles.photo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
