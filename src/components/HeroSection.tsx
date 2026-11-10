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
              Cloud • Platform • Infrastructure • DevOps • AIOps
            </p>
            <h1 className={styles.heroTitle}>Alan Szuster</h1>
            <h2 className={styles.heroSubtitle}>Site Reliability Engineer</h2>
            <p className={styles.heroDescription}>
              SRE at Salling Group running production Kubernetes and cloud
              networking on GCP and Azure. I also build and run AI agents and
              ML workloads on Kubernetes, Vertex AI and Azure AI Foundry,
              including GPU.
            </p>
            <div className={styles.heroActions}>
              <a href="#experience" className={styles.primaryAction}>
                Experience
              </a>
              <a
                href="/Alan-Szuster-CV.pdf"
                download
                className={styles.secondaryAction}
              >
                <i className="fas fa-download" aria-hidden="true"></i>
                Download CV
              </a>
              <a href="#ai-playground" className={styles.secondaryAction}>
                AI/ML Playground
              </a>
              <a
                href="mailto:alanszuster22@gmail.com"
                className={styles.secondaryAction}
              >
                Get in touch
              </a>
            </div>
            <div className={styles.highlights}>
              <span>Kubernetes</span>
              <span>GKE + AKS</span>
              <span>Terraform</span>
              <span>Argo CD</span>
              <span>GitHub Actions</span>
              <span>Agentic AI</span>
              <span>Python/TS/Bash</span>
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
